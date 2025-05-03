
import { format } from "date-fns";
import { ChatMessage, Task } from "../types";
import TaskSuggestionForm from "./TaskSuggestionForm";

interface ChatMessageListProps {
  messages: ChatMessage[];
  onAddTask: (task: Task) => void;
  onRejectTask: (messageId: string) => void;
}

const ChatMessageList = ({ messages, onAddTask, onRejectTask }: ChatMessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="space-y-4">
          <div className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
            {msg.isTyping ? (
              <div className="flex space-x-1">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            ) : (
              <>
                <p className="text-gray-200">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), "h:mm a")}
                </p>
              </>
            )}
          </div>
          
          {msg.taskSuggestions && msg.taskSuggestions.length > 0 && (
            <div className="space-y-4">
              {msg.taskSuggestions.map((task) => (
                <TaskSuggestionForm
                  key={task.id}
                  task={task}
                  onSave={onAddTask}
                  onCancel={() => onRejectTask(msg.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;
