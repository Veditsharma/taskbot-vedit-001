import { useState, useRef, useEffect } from "react";
import { Send, Plus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, Task, FIELD_OPTIONS } from "../types";
import { mockChatMessages } from "../mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TaskSuggestionForm from "./TaskSuggestionForm";

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

    setTimeout(() => {
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
    const words = userMessage.toLowerCase().split(' ');
    
    let priority: "low" | "medium" | "high" = "medium";
    if (words.some(w => ["urgent", "asap", "important", "critical"].includes(w))) {
      priority = "high";
    } else if (words.some(w => ["whenever", "eventually", "someday"].includes(w))) {
      priority = "low";
    }

    let field = FIELD_OPTIONS.find(f =>
      words.some(w => w.includes(f.toLowerCase()))
    );

    let deadline = new Date();
    if (words.includes("tomorrow")) {
      deadline.setDate(deadline.getDate() + 1);
    } else if (words.includes("next") && words.includes("week")) {
      deadline.setDate(deadline.getDate() + 7);
    } else {
      deadline.setDate(deadline.getDate() + 3);
    }

    return [{
      id: `task-suggestion-${Date.now()}`,
      title: userMessage.split('.')[0],
      description: userMessage,
      priority,
      tags: ["chat-generated"],
      column: "not-started",
      createdBy: "bot",
      createdAt: new Date().toISOString(),
      deadline: deadline.toISOString(),
      field: field || "Other"
    }];
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
                        <TaskSuggestionForm
                          task={task}
                          onSave={handleAddTask}
                          onCancel={() => handleRejectTask(msg.id)}
                        />
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
