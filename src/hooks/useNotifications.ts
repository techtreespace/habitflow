import { useEffect, useRef, useCallback } from "react";
import { getHabits, formatDate, isHabitDone } from "@/lib/habits";

const NOTIFICATION_PERMISSION_KEY = "habitflow_notif_permission";

export function useNotifications(refreshKey: number) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const requestPermission = useCallback(async () => {
    try {
      if (typeof Notification === "undefined") return false;
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") return false;
      const result = await Notification.requestPermission();
      try { localStorage.setItem(NOTIFICATION_PERMISSION_KEY, result); } catch {}
      return result === "granted";
    } catch {
      return false;
    }
  }, []);

  const scheduleNotifications = useCallback(() => {
    // Clear existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    try { if (typeof Notification === "undefined" || Notification.permission !== "granted") return; } catch { return; }

    const habits = getHabits();
    const now = new Date();
    const today = now.getDay();
    const todayStr = formatDate(now);

    habits.forEach((habit) => {
      if (!habit.reminderTime) return;
      if (!habit.activeDays.includes(today)) return;
      if (isHabitDone(habit.id, todayStr)) return;

      const [hours, minutes] = habit.reminderTime.split(":").map(Number);
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);

      const delay = reminderDate.getTime() - now.getTime();
      if (delay <= 0) return; // Already passed

      const timer = setTimeout(() => {
        // Re-check if still not done
        if (!isHabitDone(habit.id, todayStr)) {
          new Notification(`${habit.emoji} ${habit.name}`, {
            body: "오늘의 습관을 완료할 시간이에요!",
            icon: "/favicon.ico",
            tag: habit.id,
          });
        }
      }, delay);

      timersRef.current.push(timer);
    });
  }, []);

  useEffect(() => {
    scheduleNotifications();
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [refreshKey, scheduleNotifications]);

  return { requestPermission, scheduleNotifications };
}
