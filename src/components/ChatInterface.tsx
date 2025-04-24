
import { useState, useRef, useEffect } from "react";
import { Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, Task, FIELD_OPTIONS } from "../types";
import { mockChatMessages } from "../mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  onAddTask: (task: Task) => void;
}

const ChatInterface = ({ onSendMessage, onAddTask }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setChatHistory(mockChatMessages);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, newMessage]);
    onSendMessage(message);
    setMessage("");

    // Simulate bot response with task suggestions
    setTimeout(() => {
      // Generate a task suggestion based on the message
      const taskSuggestions = generateTaskSuggestions(message);
      
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: "I've analyzed your message. Here are some tasks I can add to your board:",
        sender: "bot",
        timestamp: new Date().toISOString(),
        taskSuggestions,
      };
      
      setChatHistory(prev => [...prev, botResponse]);
    }, 1500);
  };

  const generateTaskSuggestions = (userMessage: string): Task[] => {
    // This is a simplified mock implementation
    // In a real app, this would use NLP/AI to extract tasks
    
    const mockFields = ["Design", "Development", "Marketing", "Research"];
    const randomField = mockFields[Math.floor(Math.random() * mockFields.length)];
    
    // Create a deadline between tomorrow and 7 days from now
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 7) + 1);
    
    return [
      {
        id: `task-suggestion-${Date.now()}`,
        title: `Task from chat: ${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}`,
        description: `Generated from your message: "${userMessage}"`,
        priority: "medium",
        tags: ["chat-generated"],
        column: "not-started",
        createdBy: "bot",
        createdAt: new Date().toISOString(),
        deadline: deadline.toISOString(),
        field: randomField
      }
    ];
  };

  const handleAddTask = (task: Task) => {
    onAddTask(task);
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your board.`,
    });
    
    // Add a confirmation message in the chat
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: `I've added "${task.title}" to your task board.`,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, confirmationMessage]);
  };

  const handleRejectTask = (messageId: string) => {
    // Remove the task suggestions from the message
    setChatHistory(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, taskSuggestions: undefined };
      }
      return msg;
    }));
    
    // Add a confirmation message
    const rejectionMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: "No problem. I won't add those tasks to your board.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory(prev => [...prev, rejectionMessage]);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-semibold">CreodoBot Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Ask me to create tasks, organize your board, or get suggestions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">
              No messages yet. Start chatting with CreodoBot!
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              
              {msg.taskSuggestions && msg.taskSuggestions.length > 0 && (
                <div className="ml-4">
                  {msg.taskSuggestions.map((task) => (
                    <Card key={task.id} className="mb-2 bg-muted/50 border-muted">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2"
                              onClick={() => handleAddTask(task)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2 text-muted-foreground"
                              onClick={() => handleRejectTask(msg.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className={task.priority === "low" ? "priority-low" : task.priority === "medium" ? "priority-medium" : "priority-high"}>
                            {task.priority}
                          </Badge>
                          
                          {task.field && (
                            <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-700">
                              {task.field}
                            </Badge>
                          )}
                          
                          {task.deadline && (
                            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(task.deadline), "MMM d")}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to CreodoBot..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim()) {
                  handleSubmit(e);
                }
              }
            }}
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
