
import { Task, ChatMessage } from "./types";

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "FAQs_Interview",
    description: "Prepare FAQ documents for the upcoming interview",
    priority: "low",
    tags: ["feature request"],
    column: "not-started",
    createdBy: "user",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-2",
    title: "Resume_College",
    description: "Update college resume with recent projects",
    priority: "medium",
    tags: ["design"],
    column: "not-started",
    createdBy: "user",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "task-3",
    title: "Rethink system internship Post",
    description: "Draft and review internship posting for the system team",
    priority: "high",
    tags: ["research"],
    column: "in-progress",
    createdBy: "user",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "task-4",
    title: "Modern design",
    description: "Create modern design concepts for the homepage",
    priority: "medium",
    tags: ["design"],
    column: "done",
    createdBy: "bot",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "task-5",
    title: "Singapore post",
    description: "Write blog post about Singapore tech scene",
    priority: "medium",
    tags: ["feature request"],
    column: "done",
    createdBy: "user",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "task-6",
    title: "Ghibli Art Post",
    description: "Design Studio Ghibli inspired artwork for social media",
    priority: "low",
    tags: ["design"],
    column: "done",
    createdBy: "bot",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "task-7",
    title: "Report + Clearance certificate",
    description: "Complete quarterly report and obtain clearance certificate",
    priority: "high",
    tags: ["research"],
    column: "done",
    createdBy: "user",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    text: "Hello! I'm CreodoBot. How can I help you manage your tasks today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg-2",
    text: "Hi CreodoBot, I need help with planning my Instagram reel workflow.",
    sender: "user",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "msg-3",
    text: "I'll help you plan your Instagram reel workflow! Here are the key tasks I'm adding to your board:\n\n1. Storyboard concept\n2. Shoot footage\n3. Edit in Lightroom\n4. Schedule post",
    sender: "bot",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: "msg-4",
    text: "That looks good, but can you add one more task for music selection?",
    sender: "user",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: "msg-5",
    text: "Absolutely! I've added 'Select background music' to your workflow. Based on the nature of these tasks, I've set most as medium priority and tagged them with 'design'. Is there anything else you'd like me to adjust?",
    sender: "bot",
    timestamp: new Date(Date.now() - 3200000).toISOString(),
  }
];
