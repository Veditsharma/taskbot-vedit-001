
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../types";

interface GeminiResponse {
  text: string;
  taskSuggestions?: any;
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
      context: "You are an assistant for a task management app. Help the user manage their tasks, suggest new tasks, and answer questions about productivity.",
      history: messageHistory
    }
  });
  
  if (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(error.message);
  }
  
  return data;
}
