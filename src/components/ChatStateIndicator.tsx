
import React from "react";

interface ChatStateIndicatorProps {
  isLoading: boolean;
  isEmpty: boolean;
}

const ChatStateIndicator = ({ isLoading, isEmpty }: ChatStateIndicatorProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Connecting to AI assistant...</p>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-400">
          Start chatting with your AI assistant!
        </p>
      </div>
    );
  }
  
  return null;
};

export default ChatStateIndicator;
