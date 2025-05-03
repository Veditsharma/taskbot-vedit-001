
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Task } from "../types";

interface ChatQuickActionsProps {
  taskTitle: string;
  taskDescription: string;
  onAddTask: () => void;
  onRemove: () => void;
}

const ChatQuickActions = ({ 
  taskTitle,
  taskDescription,
  onAddTask, 
  onRemove 
}: ChatQuickActionsProps) => {
  return (
    <div className="flex flex-col gap-2 mt-3 mb-5 mx-1">
      <Button 
        onClick={onAddTask}
        className="bg-yellow-200 hover:bg-yellow-300 text-black text-base font-medium py-6 w-full"
      >
        <PlusCircle size={18} className="mr-2" /> Add task
      </Button>
      
      <Button 
        onClick={onRemove}
        variant="outline"
        className="bg-red-200 hover:bg-red-300 border-none text-black text-base font-medium py-6 w-full"
      >
        <X size={18} className="mr-2" /> Remove
      </Button>
    </div>
  );
};

export default ChatQuickActions;
