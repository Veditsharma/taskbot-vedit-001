
import React from "react";
import { MessageSquare } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="p-4 border-b border-gray-800 bg-[#121212] flex items-center gap-3">
      <div className="bg-primary/20 p-2 rounded-full">
        <MessageSquare size={18} className="text-primary" />
      </div>
      <div>
        <h2 className="font-semibold text-white">AI Task Assistant</h2>
        <p className="text-xs text-gray-400">
          Powered by Google Gemini AI
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
