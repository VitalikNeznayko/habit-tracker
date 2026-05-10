export type Habit = {
  id: string;
  title: string;
  description?: string | null;
  todayCompleted: boolean;
  currentStreak: number;
  longestStreak: number;
  progressPercent: number;
  checkinDays: string[];
};

export type Habits = {
  id: string;
  title: string;
  description?: string | null;
  todayCompleted: boolean;
  currentStreak: number;
};

export type Cell = {
  date: Date;
  key: string;
  inRange: boolean;
  isToday: boolean;
  completed: boolean;
};
