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
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-white">{task.title}</h4>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
              className="text-gray-400 hover:text-white"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-400 mb-3">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`priority-${task.priority}`}>
            {task.priority}
          </Badge>

          {task.field && (
            <Badge variant="outline" className="field-tag">
              {task.field}
            </Badge>
          )}

          {task.deadline && (
            <Badge variant="outline" className="date-tag">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(task.deadline), "MMM d")}
            </Badge>
          )}
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
