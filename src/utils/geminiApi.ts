
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, Task } from "../types";

interface GeminiResponse {
  text: string;
  taskSuggestions?: Task[];
}

/**
 * Calls the Gemini AI through Supabase Edge Function
 */
export async function callGeminiApi(
  message: string,
  messageHistory: Pick<ChatMessage, "text" | "sender" | "timestamp">[]
): Promise<GeminiResponse> {
  const { data, error } = await supabase.functions.invoke('gemini-chat', {
    body: { 
      message,
      context: "You are an AI assistant for a task management app. Be concise and practical. If the user is asking to create a task, always suggest creating a well-structured task at the end of your response.",
      history: messageHistory
    }
  });
  
  if (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(error.message);
  }
  
  // Ensure the response is clean and well-structured
  if (data && data.text) {
    data.text = data.text.trim();
    
    // If there are task suggestions, make sure they're properly formatted
    if (data.taskSuggestions && Array.isArray(data.taskSuggestions)) {
      data.taskSuggestions = data.taskSuggestions.map(task => ({
        ...task,
        title: task.title.trim(),
        description: task.description?.trim() || task.title.trim(),
        tags: task.tags || ["ai-generated"]
      }));
    }
  }
  
  return data;
}
