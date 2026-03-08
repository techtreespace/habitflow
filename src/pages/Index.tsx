import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, CalendarDays } from "lucide-react";
import { getHabits, deleteHabit, Habit } from "@/lib/habits";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import StatsBar from "@/components/StatsBar";
import HabitDetail from "@/components/HabitDetail";
import BottomNav, { TabType } from "@/components/BottomNav";
import StatsPage from "@/components/StatsPage";
import CalendarPage from "@/components/CalendarPage";
import DiscoverPage from "@/components/DiscoverPage";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const habits = getHabits();
  const today = new Date();
  const dayOfWeek = today.getDay();

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const { requestPermission } = useNotifications(refreshKey);

  useEffect(() => {
    const hasReminder = habits.some((h) => h.reminderTime);
    if (hasReminder && "Notification" in window && Notification.permission === "default") {
      requestPermission().then((granted) => {
        if (granted) toast.success("알림이 활성화되었습니다! 🔔");
      });
    }
  }, [habits, requestPermission]);

  const todayHabits = habits.filter((h) => h.activeDays.includes(dayOfWeek));

  const handleDelete = (id: string) => {
    deleteHabit(id);
    refresh();
  };

  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const monthDay = `${today.getMonth() + 1}월 ${today.getDate()}일 ${dayNames[dayOfWeek]}`;

  const renderTab = () => {
    switch (activeTab) {
      case "stats":
        return <StatsPage refreshKey={refreshKey} />;
      case "calendar":
        return <CalendarPage refreshKey={refreshKey} />;
      case "discover":
        return <DiscoverPage onAdded={refresh} />;
      default:
        return (
          <>
            {/* Stats summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
              key={refreshKey}
            >
              <StatsBar refreshKey={refreshKey} />
            </motion.div>

            {/* Habit List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayHabits.length > 0 ? (
                  todayHabits.map((habit) => (
                    <div key={habit.id} onClick={() => setSelectedHabit(habit)}>
                      <HabitCard
                        habit={habit}
                        date={today}
                        onToggle={refresh}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <span className="text-5xl mb-4 block">🌱</span>
                    <h2 className="text-lg font-bold mb-2">좋은 습관을 시작하세요</h2>
                    <p className="text-muted-foreground text-sm">
                      아래 + 버튼을 눌러 첫 번째 습관을 만들어보세요
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other habits */}
            {habits.length > todayHabits.length && (
              <div className="mt-8">
                <p className="text-sm font-medium text-muted-foreground mb-3">다른 습관</p>
                <div className="space-y-3">
                  {habits
                    .filter((h) => !h.activeDays.includes(dayOfWeek))
                    .map((habit) => (
                      <div key={habit.id} onClick={() => setSelectedHabit(habit)} className="opacity-50">
                        <HabitCard
                          habit={habit}
                          date={today}
                          onToggle={refresh}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight">HabitFlow</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <p className="text-sm font-medium">{monthDay}</p>
          </div>
        </motion.div>

        {/* Tab content */}
        <div key={activeTab}>
          {renderTab()}
        </div>
      </div>

      {/* Bottom navigation with integrated FAB */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAdd={() => setShowAdd(true)} />

      {/* Add dialog */}
      <AddHabitDialog open={showAdd} onClose={() => setShowAdd(false)} onAdded={refresh} />

      {/* Detail view */}
      <AnimatePresence>
        {selectedHabit && (
          <HabitDetail
            habit={selectedHabit}
            onClose={() => setSelectedHabit(null)}
            refreshKey={refreshKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
