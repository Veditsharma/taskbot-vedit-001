
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const ChatInputForm = ({ onSendMessage, isSending }: ChatInputFormProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    onSendMessage(message);
    setMessage("");
  };

  return (
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
  );
};

export default ChatInputForm;
