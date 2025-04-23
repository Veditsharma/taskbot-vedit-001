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
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
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
