
import { Task } from "../types";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
}

const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "priority-low";
      case "medium":
        return "priority-medium";
      case "high":
        return "priority-high";
      default:
        return "";
    }
  };

  const getTagClass = (tag: string) => {
    if (tag.includes("feature")) return "tag-feature";
    if (tag.includes("research")) return "tag-research";
    if (tag.includes("design")) return "tag-design";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="task-card group">
      <div className="flex justify-between">
        <h4 className="font-medium mb-2">{task.title}</h4>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-1 mt-2">
        <Badge variant="outline" className={getPriorityClass(task.priority)}>
          {task.priority}
        </Badge>
        
        {task.tags.map((tag, index) => (
          <Badge key={index} variant="outline" className={getTagClass(tag)}>
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        Added by {task.createdBy === "bot" ? "CreodoBot" : "You"}
      </div>
    </div>
  );
};

export default TaskCard;
