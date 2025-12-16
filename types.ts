export enum AppState {
  DASHBOARD = 'DASHBOARD',
  LESSONS = 'LESSONS',
  PROGRESS = 'PROGRESS',
  PROFILE = 'PROFILE',
  RESOURCES = 'RESOURCES',
  SESSION = 'SESSION',
  FLASHCARDS = 'FLASHCARDS',
  SUMMARY = 'SUMMARY'
}

export enum TopicCategory {
  DAILY_LIFE = 'Daily Life',
  JUSTICE_LAW = 'Justice & Law',
  TECHNOLOGY = 'Technology',
  POLITICS = 'Politics',
  HOBBIES = 'Hobbies',
  BUSINESS = 'Business',
  TRAVEL = 'Travel'
}

export interface TopicContent {
  id: string;
  category: TopicCategory;
  title: string;
  description: string;
  imageUrl: string;
  videoPlaceholder: string;
  textContent: string;
  newsQuery: string;
  level?: string;
  progress?: number;
  totalSteps?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: TopicCategory;
}

export interface SessionResult {
  durationSeconds: number;
  score?: number; // 0-100
  feedback?: string;
  canGraduate: boolean; // > 30 mins
}