export interface Mood {
  id: string;
  name: string;
  emoji: string;
  timestamp: string;
  intensity: number;
  note?: string;
}

export interface Snack {
  id: string;
  name: string;
  description: string;
  mood: string[];
  image?: string;
}

export interface MoodEntry {
  id: string;
  moodId: string;
  timestamp: string;
  note?: string;
  snacks: string[];
}

export type ColorScheme = 'light' | 'dark';

export interface UserPreferences {
  theme: ColorScheme;
  notifications: boolean;
  dailyReminder: string;
} 