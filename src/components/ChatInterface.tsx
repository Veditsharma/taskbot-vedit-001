
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ChatMessage, Task } from "../types";
import { supabase } from "@/integrations/supabase/client";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInputForm";
import ChatHeader from "./ChatHeader";
import ChatStateIndicator from "./ChatStateIndicator";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  onAddTask: (task: Task) => void;
}

const ChatInterface = ({ onSendMessage, onAddTask }: ChatInterfaceProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      // Add a welcome message from the bot
      const welcomeMessage: ChatMessage = {
        id: `msg-welcome`,
        text: "Hello! I'm your AI-powered task assistant. I can help you manage tasks, answer questions, and keep you organized. Try asking me to create a task or help you organize your work.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setChatHistory([welcomeMessage]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    onSendMessage(message);

    try {
      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: `typing-${Date.now()}`,
        text: "...",
        sender: "bot",
        timestamp: new Date().toISOString(),
        isTyping: true,
      };
      
      setChatHistory(prev => [...prev, typingMessage]);
      
      // Prepare recent message history for context
      const messageHistory = chatHistory.filter(msg => !msg.isTyping)
        .slice(-5)  // Send only the last 5 messages for context
        .map(({ text, sender, timestamp }) => ({ text, sender, timestamp }));
      
      // Call the Gemini API through our edge function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message,
          context: "You are an assistant for a task management app. Help the user manage their tasks, suggest new tasks, and answer questions about productivity.",
          history: messageHistory
        }
      });
      
      if (error) throw new Error(error.message);
      
      // Remove typing indicator and add the AI response
      setChatHistory(prev => prev.filter(msg => !msg.isTyping));
      
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: data.text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        taskSuggestions: data.taskSuggestions,
      };
      
      setChatHistory(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Remove typing indicator on error
      setChatHistory(prev => prev.filter(msg => !msg.isTyping));
    } finally {
      setIsSending(false);
    }
  };

  const handleAddTask = (task: Task) => {
    onAddTask(task);
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your board.`,
    });
    
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: `I've added "${task.title}" to your task board with priority ${task.priority}${task.deadline ? ` and deadline ${format(new Date(task.deadline), "PPP")}` : ''}.`,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, confirmationMessage]);
  };

  const handleRejectTask = (messageId: string) => {
    setChatHistory(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, taskSuggestions: undefined };
      }
      return msg;
    }));
    
    const rejectionMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: "No problem. I won't add those tasks to your board.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, rejectionMessage]);
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-xl overflow-hidden bg-[#121212]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatStateIndicator 
          isLoading={isLoading} 
          isEmpty={chatHistory.length === 0} 
        />
        
        {!isLoading && chatHistory.length > 0 && (
          <ChatMessageList 
            messages={chatHistory} 
            onAddTask={handleAddTask} 
            onRejectTask={handleRejectTask} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInputForm onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default ChatInterface;
