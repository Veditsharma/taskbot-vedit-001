
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ChatMessage, Task } from "../types";
import { callGeminiApi } from "@/utils/geminiApi";
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
      
      // Call the Gemini API through our utility function
      const response = await callGeminiApi(message, messageHistory);
      
      // Remove typing indicator and add the AI response
      setChatHistory(prev => prev.filter(msg => !msg.isTyping));
      
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: response.text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        taskSuggestions: response.taskSuggestions,
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

  // Handle creating a task from conversation
  const handleTaskFromConversation = (title: string, description: string) => {
    // Create task object
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.length > 60 ? title.substring(0, 57) + '...' : title,
      description: description || title,
      priority: "high", // Default to high as shown in the example image
      tags: ["ai-generated"],
      column: "not-started",
      createdBy: "bot",
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      field: "Development" // Default field from the example image
    };
    
    onAddTask(newTask);
    
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added to your board.`,
    });
    
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: `I've created a task "${newTask.title}" from our conversation and added it to your board.`,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, confirmationMessage]);
  };
  
  // Handle removing quick actions
  const handleRemoveQuickActions = (messageId: string) => {
    // Add a small confirmation message
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: "I've removed the task suggestion.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, confirmationMessage]);
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
            onTaskFromConversation={handleTaskFromConversation}
            onRemoveQuickActions={handleRemoveQuickActions}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInputForm onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default ChatInterface;
