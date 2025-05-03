
import React from "react";
import { MessageSquare } from "lucide-react";

interface ChatStateIndicatorProps {
  isLoading: boolean;
  isEmpty: boolean;
}

const ChatStateIndicator = ({ isLoading, isEmpty }: ChatStateIndicatorProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
        <div className="animate-pulse bg-gray-800/50 rounded-full p-3">
          <MessageSquare size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-400 text-center">Connecting to AI assistant...</p>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="bg-primary/20 p-4 rounded-full">
          <MessageSquare size={30} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 font-medium mb-1">AI Task Assistant</p>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            I can help manage your tasks and boost productivity. Try asking me to create a task or organize your work.
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default ChatStateIndicator;
