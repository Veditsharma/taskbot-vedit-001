
import { format } from "date-fns";
import { ChatMessage, Task } from "../types";
import TaskSuggestionForm from "./TaskSuggestionForm";
import ChatQuickActions from "./ChatQuickActions";

interface ChatMessageListProps {
  messages: ChatMessage[];
  onAddTask: (task: Task) => void;
  onRejectTask: (messageId: string) => void;
  onTaskFromConversation?: (title: string, description: string) => void;
  onRemoveQuickActions?: (messageId: string) => void;
}

const ChatMessageList = ({ 
  messages, 
  onAddTask, 
  onRejectTask,
  onTaskFromConversation,
  onRemoveQuickActions
}: ChatMessageListProps) => {
  // Helper function to detect conversation ending phrases
  const isConversationEnding = (text: string): boolean => {
    const endingPhrases = [
      "okay", "ok", "cool", "thanks", "thank you", 
      "got it", "understood", "makes sense", "clear",
      "great", "perfect", "excellent", "done", "sounds good",
      "alright", "fine"
    ];
    
    const lowerText = text.toLowerCase().trim();
    return endingPhrases.some(phrase => 
      lowerText === phrase || 
      lowerText.startsWith(`${phrase} `) || 
      lowerText.endsWith(` ${phrase}`) ||
      lowerText.includes(` ${phrase} `)
    );
  };

  // Find last user message to check if it's a conversation ender
  const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === "user");
  const lastUserMessage = lastUserMessageIndex !== -1 
    ? messages[messages.length - 1 - lastUserMessageIndex] 
    : null;
  
  // Only show quick actions after a conversation ending message from user with no pending task suggestions
  const showQuickActions = lastUserMessage && 
    isConversationEnding(lastUserMessage.text) &&
    !messages.some(msg => msg.taskSuggestions && msg.taskSuggestions.length > 0);

  // If we have a conversation about a task, use it for quick actions
  const lastMeaningfulBotMessage = messages
    .filter(m => m.sender === "bot" && !m.isTyping && m.text.length > 20)
    .pop();
    
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
          
          {/* Show quick actions if this is the last user message and it's a conversation ender */}
          {showQuickActions && msg.id === lastUserMessage?.id && lastMeaningfulBotMessage && onTaskFromConversation && onRemoveQuickActions && (
            <ChatQuickActions
              taskTitle={lastMeaningfulBotMessage.text.split('.')[0].trim()}
              taskDescription={lastMeaningfulBotMessage.text}
              onAddTask={() => onTaskFromConversation(
                lastMeaningfulBotMessage.text.split('.')[0].trim(),
                lastMeaningfulBotMessage.text
              )}
              onRemove={() => onRemoveQuickActions(msg.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;
