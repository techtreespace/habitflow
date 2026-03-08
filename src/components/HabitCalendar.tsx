import { useMemo } from "react";
import { formatDate, getLogs, logKey, Habit } from "@/lib/habits";

interface HabitCalendarProps {
  habit: Habit;
  refreshKey: number;
}

export default function HabitCalendar({ habit, refreshKey }: HabitCalendarProps) {
  const weeks = useMemo(() => {
    const logs = getLogs();
    const today = new Date();
    const cells: { date: string; done: boolean; isToday: boolean }[] = [];

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      cells.push({
        date: dateStr,
        done: !!logs[logKey(habit.id, dateStr)],
        isToday: i === 0,
      });
    }
    return cells;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit.id, refreshKey]);

  return (
    <div className="flex gap-1 flex-wrap">
      {weeks.map((cell) => (
        <div
          key={cell.date}
          className={`w-5 h-5 rounded-md transition-all ${
            cell.done
              ? "bg-success"
              : cell.isToday
              ? "bg-primary/20 ring-1 ring-primary"
              : "bg-muted"
          }`}
          title={cell.date}
        />
      ))}
    </div>
  );
}
