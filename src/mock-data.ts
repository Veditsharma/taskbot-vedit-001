
import { Task, ChatMessage } from './types';

// Sample tasks for the board
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new landing page',
    priority: 'high',
    tags: ['design', 'homepage'],
    column: 'in-progress',
    createdBy: 'user',
    createdAt: '2023-04-01T10:00:00Z',
    deadline: '2023-04-10T00:00:00Z',
    field: 'Design'
  },
  {
    id: 'task-2',
    title: 'Fix payment integration',
    description: 'Resolve issues with Stripe payment processing',
    priority: 'high',
    tags: ['feature'],
    column: 'not-started',
    createdBy: 'user',
    createdAt: '2023-04-02T14:30:00Z',
    deadline: '2023-04-15T00:00:00Z',
    field: 'Development'
  },
  {
    id: 'task-3',
    title: 'Create social media strategy',
    description: 'Plan content calendar for next month',
    priority: 'medium',
    tags: ['research', 'marketing'],
    column: 'not-started',
    createdBy: 'bot',
    createdAt: '2023-04-03T09:15:00Z',
    field: 'Marketing'
  },
  {
    id: 'task-4',
    title: 'Update user documentation',
    description: 'Add new features to the help section',
    priority: 'low',
    tags: ['documentation'],
    column: 'done',
    createdBy: 'user',
    createdAt: '2023-03-28T11:45:00Z',
    deadline: '2023-04-05T00:00:00Z',
    field: 'Content'
  },
  {
    id: 'task-5',
    title: 'Research competitor features',
    description: 'Analyze competitors and create comparison report',
    priority: 'medium',
    tags: ['research'],
    column: 'done',
    createdBy: 'bot',
    createdAt: '2023-03-25T13:20:00Z',
    field: 'Research'
  }
];

// Sample chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hello! I\'m CreodoBot, your productivity assistant. How can I help you today?',
    sender: 'bot',
    timestamp: '2023-04-05T09:00:00Z'
  },
  {
    id: 'msg-2',
    text: 'Hi! I need to organize my tasks for the week.',
    sender: 'user',
    timestamp: '2023-04-05T09:01:30Z'
  },
  {
    id: 'msg-3',
    text: 'Sure, I can help with that. What specific tasks do you need to organize?',
    sender: 'bot',
    timestamp: '2023-04-05T09:01:45Z'
  },
  {
    id: 'msg-4',
    text: 'I need to prepare a presentation for Monday and finish the quarterly report.',
    sender: 'user',
    timestamp: '2023-04-05T09:02:30Z'
  }
];
