
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
        <div key={msg.id}>
          <div 
            className={`rounded-2xl p-4 ${
              msg.sender === "user" 
                ? "bg-[#191919] ml-auto max-w-[85%]" 
                : "bg-[#121212] max-w-[85%]"
            }`}
          >
            {msg.isTyping ? (
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            ) : (
              <>
                <p className="text-gray-200 whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), "h:mm a")}
                </p>
              </>
            )}
          </div>
          
          {msg.taskSuggestions && msg.taskSuggestions.length > 0 && (
            <div className="mt-3 ml-2">
              <p className="text-xs text-gray-400 mb-2">
                {msg.taskSuggestions.length === 1 ? "Suggested task:" : "Suggested tasks:"}
              </p>
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
