
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, Task } from "../types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TaskSuggestionForm from "./TaskSuggestionForm";
import { supabase } from "@/integrations/supabase/client";
import ChatMessageList from "./ChatMessageList";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  onAddTask: (task: Task) => void;
}

const ChatInterface = ({ onSendMessage, onAddTask }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setMessage("");

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
      <div className="p-4 border-b border-gray-800 bg-[#121212]">
        <h2 className="font-semibold text-white">AI Assistant</h2>
        <p className="text-sm text-gray-400">
          Powered by Google Gemini AI
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Connecting to AI assistant...</p>
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-400">
              Start chatting with your AI assistant!
            </p>
          </div>
        ) : (
          <ChatMessageList 
            messages={chatHistory} 
            onAddTask={handleAddTask} 
            onRejectTask={handleRejectTask} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything or tell me to create a task..."
            className="chat-input min-h-[44px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim() && !isSending) {
                  handleSubmit(e);
                }
              }
            }}
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-primary hover:bg-primary/90"
            disabled={!message.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
