import { useMemo } from "react";
import { getHabits, getLogs, logKey, formatDate } from "@/lib/habits";
import { TrendingUp, CheckCircle2, Flame } from "lucide-react";

interface StatsBarProps {
  refreshKey: number;
}

export default function StatsBar({ refreshKey }: StatsBarProps) {
  const stats = useMemo(() => {
    const habits = getHabits();
    const logs = getLogs();
    const today = formatDate(new Date());

    const todayTotal = habits.length;
    const todayDone = habits.filter((h) => logs[logKey(h.id, today)]).length;

    let maxStreak = 0;
    habits.forEach((h) => {
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (logs[logKey(h.id, formatDate(d))]) {
          streak++;
        } else if (i > 0) {
          break;
        } else {
          continue;
        }
      }
      maxStreak = Math.max(maxStreak, streak);
    });

    // 7-day completion rate
    let total7 = 0;
    let done7 = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = formatDate(d);
      habits.forEach((h) => {
        total7++;
        if (logs[logKey(h.id, ds)]) done7++;
      });
    }

    return {
      todayDone,
      todayTotal,
      maxStreak,
      weekRate: total7 > 0 ? Math.round((done7 / total7) * 100) : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (stats.todayTotal === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2.5 shadow-sm">
      <div className="flex items-center gap-1.5 flex-1">
        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
        <span className="text-sm font-bold">{stats.todayDone}/{stats.todayTotal}</span>
        <span className="text-[10px] text-muted-foreground">오늘</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5 flex-1">
        <Flame className="w-4 h-4 text-streak shrink-0" />
        <span className="text-sm font-bold">{stats.maxStreak}</span>
        <span className="text-[10px] text-muted-foreground">연속</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5 flex-1">
        <TrendingUp className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-bold">{stats.weekRate}%</span>
        <span className="text-[10px] text-muted-foreground">주간</span>
      </div>
    </div>
  );
}
