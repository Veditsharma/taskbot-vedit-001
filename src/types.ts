
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  column: "not-started" | "in-progress" | "done";
  createdBy: "user" | "bot";
  createdAt: string;
  deadline?: string;
  field?: string; // Added field/category
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  taskSuggestions?: Task[]; // Added task suggestions
  isTyping?: boolean; // Added for typing indicator
}

export interface Column {
  id: "not-started" | "in-progress" | "done";
  title: string;
}

export const COLUMNS: Column[] = [
  { id: "not-started", title: "Not Started" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

export const FIELD_OPTIONS = [
  "Design",
  "Development",
  "Marketing",
  "Research",
  "LinkedIn",
  "Content",
  "Personal",
  "Health",
  "Other"
];
