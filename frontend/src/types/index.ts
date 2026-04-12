export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Thread {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

export interface ToolStep {
  id: string;
  name: string;
  description: string;
  status: 'done' | 'active' | 'pending';
  result?: string;
}

export interface ExtractedParams {
  location: string;
  duration: number;
  travelers: number;
  budget: string;
  focus: string[];
  thread_id: string;
}

export interface ItineraryDay {
  day: number;
  label: string;
  items: string[];
}

export interface User {
  name: string;
  email: string;
  initials: string;
}
