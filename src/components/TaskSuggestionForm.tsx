
import { Tag, Calendar } from "lucide-react";
import { Task } from "../types";
import { format } from "date-fns";

interface TaskSuggestionFormProps {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskSuggestionForm = ({ task, onSave, onCancel }: TaskSuggestionFormProps) => {
  return (
    <div className="bg-[#121212] rounded-xl p-5 border border-gray-800 shadow-lg mb-4">
      <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-indigo-900/20 text-indigo-400 border border-indigo-800/30 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-1">
          <Tag size={12} />
          {task.field}
        </span>
        
        {task.deadline && (
          <span className="bg-blue-900/20 text-blue-400 border border-blue-800/30 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(task.deadline), "MMM d")}
          </span>
        )}
        
        <span className={`px-2.5 py-1 text-xs rounded-full
          ${task.priority === "high" ? "bg-red-900/20 text-red-400 border border-red-800/30" : 
           task.priority === "medium" ? "bg-yellow-900/20 text-yellow-400 border border-yellow-800/30" :
           "bg-green-900/20 text-green-400 border border-green-800/30"}`}>
          {task.priority} priority
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <button 
          onClick={onCancel} 
          className="px-3 py-1.5 text-sm rounded-md bg-transparent hover:bg-gray-800 text-gray-400 transition-colors"
        >
          Skip
        </button>
        <button 
          onClick={() => onSave(task)} 
          className="px-3 py-1.5 text-sm rounded-md bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskSuggestionForm;
