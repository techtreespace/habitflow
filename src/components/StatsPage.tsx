import { useMemo } from "react";
import { motion } from "framer-motion";
import { getHabits, getLogs, logKey, formatDate, getStreak, getCompletionRate } from "@/lib/habits";
import { TrendingUp, TrendingDown, Flame, Target, CalendarX, Crown } from "lucide-react";

interface StatsPageProps {
  refreshKey: number;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function StatsPage({ refreshKey }: StatsPageProps) {
  const data = useMemo(() => {
    const habits = getHabits();
    const logs = getLogs();

    if (habits.length === 0) return null;

    // Per-habit stats
    const habitStats = habits.map((h) => ({
      habit: h,
      streak: getStreak(h.id),
      rate30: getCompletionRate(h.id, 30),
      rate7: getCompletionRate(h.id, 7),
    }));

    // Overall completion rates
    const overall30 = habitStats.length > 0
      ? Math.round(habitStats.reduce((s, h) => s + h.rate30, 0) / habitStats.length)
      : 0;
    const overall7 = habitStats.length > 0
      ? Math.round(habitStats.reduce((s, h) => s + h.rate7, 0) / habitStats.length)
      : 0;

    // Failure pattern by day of week
    const dayFailures = Array(7).fill(0);
    const dayTotals = Array(7).fill(0);
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dow = d.getDay();
      const ds = formatDate(d);
      habits.forEach((h) => {
        if (h.activeDays.includes(dow)) {
          dayTotals[dow]++;
          if (!logs[logKey(h.id, ds)]) dayFailures[dow]++;
        }
      });
    }

    const dayRates = DAY_LABELS.map((label, i) => ({
      label,
      failRate: dayTotals[i] > 0 ? Math.round((dayFailures[i] / dayTotals[i]) * 100) : 0,
      successRate: dayTotals[i] > 0 ? Math.round(((dayTotals[i] - dayFailures[i]) / dayTotals[i]) * 100) : 0,
    }));

    const worstDay = dayRates.reduce((max, d) => d.failRate > max.failRate ? d : max, dayRates[0]);
    const bestDay = dayRates.reduce((max, d) => d.successRate > max.successRate ? d : max, dayRates[0]);

    // Best and worst habits
    const bestHabit = habitStats.reduce((best, h) => h.rate30 > best.rate30 ? h : best, habitStats[0]);
    const worstHabit = habitStats.reduce((worst, h) => h.rate30 < worst.rate30 ? h : worst, habitStats[0]);

    return { habitStats, overall30, overall7, dayRates, worstDay, bestDay, bestHabit, worstHabit };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (!data) {
    return (
      <div className="text-center py-20">
        <span className="text-4xl mb-3 block">📊</span>
        <p className="text-muted-foreground">습관을 추가하면 통계를 볼 수 있어요</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">전체 통계</h2>

      {/* Overall rates */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">주간 달성률</span>
          </div>
          <p className="text-3xl font-bold">{data.overall7}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">월간 달성률</span>
          </div>
          <p className="text-3xl font-bold">{data.overall30}%</p>
        </motion.div>
      </div>

      {/* Day pattern chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-4 shadow-sm"
      >
        <h3 className="text-sm font-semibold mb-3">요일별 달성률</h3>
        <div className="flex items-end gap-2 h-28">
          {data.dayRates.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative rounded-lg overflow-hidden bg-muted" style={{ height: "80px" }}>
                <motion.div
                  className={`absolute bottom-0 w-full rounded-lg ${
                    day.successRate >= 70
                      ? "bg-success"
                      : day.successRate >= 40
                      ? "bg-accent"
                      : "bg-destructive/60"
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(day.successRate, 5)}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>🏆 가장 잘하는 날: <strong className="text-foreground">{data.bestDay.label}요일</strong></span>
          <span>😅 어려운 날: <strong className="text-foreground">{data.worstDay.label}요일</strong></span>
        </div>
      </motion.div>

      {/* Per habit ranking */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-4 shadow-sm"
      >
        <h3 className="text-sm font-semibold mb-3">습관별 달성률 (30일)</h3>
        <div className="space-y-3">
          {data.habitStats
            .sort((a, b) => b.rate30 - a.rate30)
            .map((hs, i) => (
              <div key={hs.habit.id} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center">{hs.habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{hs.habit.name}</span>
                    <span className="text-sm font-bold">{hs.rate30}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${hs.rate30}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    />
                  </div>
                </div>
                {hs.streak > 0 && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Flame className="w-3 h-3 text-streak" />
                    <span className="text-xs font-medium text-streak">{hs.streak}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </motion.div>

      {/* Premium teaser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold">Pro 기능 미리보기</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          비슷한 습관을 가진 사용자들과 달성률을 비교하고, AI 기반 맞춤 분석을 받아보세요.
        </p>
        <div className="space-y-2 opacity-50 pointer-events-none select-none">
          <div className="bg-card/60 rounded-xl p-3 flex items-center gap-3">
            <span className="text-sm">🏃</span>
            <div className="flex-1">
              <p className="text-xs font-medium">운동하기 — 평균 달성률 비교</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full">
                  <div className="h-full w-[65%] bg-primary rounded-full" />
                </div>
                <span className="text-[10px] text-muted-foreground">나 65%</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full">
                  <div className="h-full w-[52%] bg-accent/60 rounded-full" />
                </div>
                <span className="text-[10px] text-muted-foreground">평균 52%</span>
              </div>
            </div>
          </div>
        </div>
        <button className="mt-3 w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm">
          Pro 업그레이드 →
        </button>
      </motion.div>
    </div>
  );
}
