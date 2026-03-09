export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  // days of week: 0=Sun, 1=Mon, ... 6=Sat
  activeDays: number[];
  // HH:mm format, e.g. "08:00"
  reminderTime?: string;
}

export interface HabitLog {
  // key: "habitId:YYYY-MM-DD"
  [key: string]: boolean;
}

const HABITS_KEY = "habitflow_habits";
const LOGS_KEY = "habitflow_logs";

export function getHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch {
    // ignore
  }
}

export function getLogs(): HabitLog {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLogs(logs: HabitLog) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function logKey(habitId: string, date: string): string {
  return `${habitId}:${date}`;
}

export function toggleHabitLog(habitId: string, date: string): boolean {
  const logs = getLogs();
  const key = logKey(habitId, date);
  const newVal = !logs[key];
  if (newVal) {
    logs[key] = true;
  } else {
    delete logs[key];
  }
  saveLogs(logs);
  return newVal;
}

export function isHabitDone(habitId: string, date: string): boolean {
  return !!getLogs()[logKey(habitId, date)];
}

export function getStreak(habitId: string): number {
  const logs = getLogs();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    if (logs[logKey(habitId, dateStr)]) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      // today not done yet, check yesterday
      continue;
    }
  }
  return streak;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function addHabit(habit: Omit<Habit, "id" | "createdAt">): Habit {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
}

export function deleteHabit(id: string) {
  const habits = getHabits().filter((h) => h.id !== id);
  saveHabits(habits);
  // Also clean up logs
  const logs = getLogs();
  const newLogs: HabitLog = {};
  for (const key in logs) {
    if (!key.startsWith(id + ":")) {
      newLogs[key] = logs[key];
    }
  }
  saveLogs(newLogs);
}

export function updateHabit(id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) {
  const habits = getHabits().map((h) =>
    h.id === id ? { ...h, ...updates } : h
  );
  saveHabits(habits);
}

export const EMOJI_OPTIONS = ["🏃", "📚", "💧", "🧘", "✍️", "🎵", "💪", "🥗", "😴", "🧹", "💊", "🌿"];

export const COLOR_OPTIONS = [
  "primary",
  "accent", 
  "destructive",
  "streak",
  "success",
];

export function getCompletionRate(habitId: string, days: number = 30): number {
  const logs = getLogs();
  let completed = 0;
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (logs[logKey(habitId, formatDate(d))]) {
      completed++;
    }
  }
  return Math.round((completed / days) * 100);
}
