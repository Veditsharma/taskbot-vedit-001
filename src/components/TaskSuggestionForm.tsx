
import { Tag, Calendar } from "lucide-react";
import { Task } from "../types";

interface TaskSuggestionFormProps {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskSuggestionForm = ({ task, onSave, onCancel }: TaskSuggestionFormProps) => {
  return (
    <div className="task-suggestion-card">
      <h3 className="task-suggestion-title">{task.title}</h3>
      <p className="task-suggestion-description">{task.description}</p>
      
      <div className="task-suggestion-tags">
        <span className="tag-development">
          <Tag size={18} />
          {task.field}
        </span>
        <span className="tag-date">
          <Calendar size={18} />
          {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }) : 'No deadline'}
        </span>
        <span className="tag-priority-high">
          {task.priority}
        </span>
      </div>

      <div className="task-suggestion-actions">
        <button onClick={() => onSave(task)} className="btn-add-task">
          Add task
        </button>
        <button onClick={onCancel} className="btn-remove">
          Remove
        </button>
      </div>
    </div>
  );
};

export default TaskSuggestionForm;
