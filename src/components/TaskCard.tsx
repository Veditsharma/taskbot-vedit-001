
import { useState } from "react";
import { Task } from "../types";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Edit, Tag } from "lucide-react";
import { format } from "date-fns";
import TaskEditDialog from "./TaskEditDialog";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    return "bg-gray-800 text-gray-300 border border-gray-600";
  };

  return (
    <>
      <div className="task-card group">
        <div className="flex justify-between items-start">
          <h4 className="font-medium mb-2">{task.title}</h4>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-400"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className={getPriorityClass(task.priority)}>
            {task.priority}
          </Badge>

          {task.field && (
            <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-700">
              <Tag className="w-3 h-3 mr-1" />
              {task.field}
            </Badge>
          )}

          {task.deadline && (
            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(task.deadline), "MMM d")}
            </Badge>
          )}

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

      <TaskEditDialog
        task={task}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={onUpdate}
      />
    </>
  );
};

export default TaskCard;
