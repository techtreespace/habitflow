import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHabits, getLogs, logKey, formatDate } from "@/lib/habits";

interface CalendarPageProps {
  refreshKey: number;
}

export default function CalendarPage({ refreshKey }: CalendarPageProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { year, month, days, monthLabel } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = target.getFullYear();
    const month = target.getMonth();
    const monthLabel = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const habits = getHabits();
    const logs = getLogs();

    const days: { day: number; rate: number; isToday: boolean }[] = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, rate: -1, isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = formatDate(date);
      const todayStr = formatDate(now);

      let total = 0;
      let done = 0;
      habits.forEach((h) => {
        if (h.activeDays.includes(date.getDay())) {
          total++;
          if (logs[logKey(h.id, dateStr)]) done++;
        }
      });

      days.push({
        day: d,
        rate: total > 0 ? done / total : -1,
        isToday: dateStr === todayStr,
      });
    }

    return { year, month, days, monthLabel };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthOffset, refreshKey]);

  const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="space-y-5">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((o) => o - 1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-bold">{monthLabel}</h2>
        <button
          onClick={() => setMonthOffset((o) => Math.min(o + 1, 0))}
          disabled={monthOffset >= 0}
          className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((cell, i) => {
            if (cell.day === 0) return <div key={i} />;

            const bgColor =
              cell.rate < 0
                ? "bg-muted/50"
                : cell.rate >= 1
                ? "bg-success"
                : cell.rate >= 0.5
                ? "bg-success/50"
                : cell.rate > 0
                ? "bg-accent/40"
                : "bg-destructive/20";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${bgColor} ${
                  cell.isToday ? "ring-2 ring-primary" : ""
                }`}
              >
                {cell.day}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success" /> 100%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success/50" /> 50%+
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-accent/40" /> 일부
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive/20" /> 0%
          </div>
        </div>
      </div>
    </div>
  );
}
