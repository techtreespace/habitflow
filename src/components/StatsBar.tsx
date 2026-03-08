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
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
        <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
        <p className="text-2xl font-bold">{stats.todayDone}/{stats.todayTotal}</p>
        <p className="text-xs text-muted-foreground">오늘</p>
      </div>
      <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
        <Flame className="w-5 h-5 mx-auto mb-1 text-streak" />
        <p className="text-2xl font-bold">{stats.maxStreak}</p>
        <p className="text-xs text-muted-foreground">최대 연속</p>
      </div>
      <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
        <p className="text-2xl font-bold">{stats.weekRate}%</p>
        <p className="text-xs text-muted-foreground">주간 달성</p>
      </div>
    </div>
  );
}
