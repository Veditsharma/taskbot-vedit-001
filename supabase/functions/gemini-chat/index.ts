
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    const { message, context, history } = await req.json();
    
    // Prepare the messages array for Gemini
    const messages = [];
    
    // Add system context if available
    if (context) {
      messages.push({
        role: "user",
        parts: [{ text: context }]
      });
      messages.push({
        role: "model",
        parts: [{ text: "I'll help you manage your tasks as requested." }]
      });
    }
    
    // Add chat history if available
    if (history && Array.isArray(history) && history.length > 0) {
      // Only include the last 10 messages to avoid token limits
      const recentHistory = history.slice(-10);
      
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // Add the current message
    messages.push({
      role: "user",
      parts: [{ text: message }]
    });

    console.log("Sending to Gemini:", JSON.stringify(messages, null, 2));

    // API call to Google Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));
    
    // Extract the response text
    let responseText;
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      console.error("Error in Gemini response:", data);
      responseText = "I'm sorry, I couldn't generate a response.";
    }

    // Check if the message contains task suggestions
    const taskSuggestions = extractTaskSuggestions(message, responseText);

    return new Response(JSON.stringify({ 
      text: responseText,
      taskSuggestions
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Gemini chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to extract potential task suggestions from AI response
function extractTaskSuggestions(userMessage, aiResponse) {
  // Check if the message seems like a task creation request
  const taskKeywords = ['create task', 'add task', 'new task', 'make task', 'schedule', 'todo', 'to-do', 'to do'];
  const containsTaskKeyword = taskKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );
  
  if (!containsTaskKeyword) {
    return null;
  }
  
  // Extract potential task details
  let title = userMessage.split('.')[0].trim();
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Default priority based on urgency words
  let priority = "medium";
  if (/urgent|asap|immediately|critical|emergency/i.test(userMessage)) {
    priority = "high";
  } else if (/whenever|sometime|later|eventually|low priority/i.test(userMessage)) {
    priority = "low";
  }
  
  // Try to identify a field/category
  const fields = [
    "Design", "Development", "Marketing", "Research", 
    "LinkedIn", "Content", "Personal", "Health", "Other"
  ];
  
  let field = "Other";
  for (const f of fields) {
    if (userMessage.toLowerCase().includes(f.toLowerCase())) {
      field = f;
      break;
    }
  }
  
  // Calculate a default deadline (3 days from now)
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  
  return [{
    id: `task-${Date.now()}`,
    title,
    description: userMessage,
    priority,
    tags: ["ai-generated"],
    column: "not-started",
    createdBy: "bot",
    createdAt: new Date().toISOString(),
    deadline: deadline.toISOString(),
    field
  }];
}
