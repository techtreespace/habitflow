import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, CalendarDays, Plus } from "lucide-react";
import { getHabits, deleteHabit, Habit } from "@/lib/habits";
import { getProfile, isScreenLocked, setScreenLocked } from "@/lib/profile";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import StatsBar from "@/components/StatsBar";
import HabitDetail from "@/components/HabitDetail";
import BottomNav, { TabType } from "@/components/BottomNav";
import StatsPage from "@/components/StatsPage";
import CalendarPage from "@/components/CalendarPage";
import CommunityPage from "@/components/CommunityPage";
import AdBanner from "@/components/AdBanner";
import ProfilePage from "@/components/ProfilePage";
import LockScreen from "@/components/LockScreen";
import TodoSection from "@/components/TodoSection";
import { useNotifications } from "@/hooks/useNotifications";
import { useWeather } from "@/hooks/useWeather";
import { toast } from "sonner";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [locked, setLocked] = useState(() => {
    const profile = getProfile();
    return profile.screenLockEnabled && isScreenLocked();
  });

  const habits = getHabits();
  const today = new Date();
  const dayOfWeek = today.getDay();

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const { requestPermission } = useNotifications(refreshKey);
  const weather = useWeather();

  useEffect(() => {
    const hasReminder = habits.some((h) => h.reminderTime);
    if (hasReminder && "Notification" in window && Notification.permission === "default") {
      requestPermission().then((granted) => {
        if (granted) toast.success("알림이 활성화되었습니다! 🔔");
      });
    }
  }, [habits, requestPermission]);

  const handleLockScreen = () => {
    setScreenLocked(true);
    setLocked(true);
  };

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

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
      case "community":
        return <CommunityPage />;
      case "profile":
        return <ProfilePage onLockScreen={handleLockScreen} />;
      default:
        return (
          <>
            {/* Add habit button - subtle, in section header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-muted-foreground">오늘의 습관</p>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> 습관 추가
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5"
              key={refreshKey}
            >
              <StatsBar refreshKey={refreshKey} />
            </motion.div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayHabits.length > 0 ? (
                  todayHabits.map((habit, i) => (
                    <div key={habit.id}>
                      <div onClick={() => setSelectedHabit(habit)}>
                        <HabitCard habit={habit} date={today} onToggle={refresh} onDelete={handleDelete} />
                      </div>
                      {/* Ad after 2nd habit */}
                      {i === 1 && todayHabits.length > 2 && (
                        <div className="mt-3">
                          <AdBanner variant="inline" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <span className="text-5xl mb-4 block">🌱</span>
                    <h2 className="text-lg font-bold mb-2">좋은 습관을 시작하세요</h2>
                    <p className="text-muted-foreground text-sm mb-4">위 버튼을 눌러 첫 번째 습관을 만들어보세요</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Card-style ad after habit list */}
            {todayHabits.length > 0 && (
              <div className="mt-5">
                <AdBanner variant="card" />
              </div>
            )}

            {habits.length > todayHabits.length && (
              <div className="mt-8">
                <p className="text-sm font-medium text-muted-foreground mb-3">다른 습관</p>
                <div className="space-y-3">
                  {habits
                    .filter((h) => !h.activeDays.includes(dayOfWeek))
                    .map((habit) => (
                      <div key={habit.id} onClick={() => setSelectedHabit(habit)} className="opacity-50">
                        <HabitCard habit={habit} date={today} onToggle={refresh} onDelete={handleDelete} />
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight">HabitFlow</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <p className="text-sm font-medium">{monthDay}</p>
          </div>
        </motion.div>

        <div key={activeTab}>{renderTab()}</div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AddHabitDialog open={showAdd} onClose={() => setShowAdd(false)} onAdded={refresh} />

      <AnimatePresence>
        {selectedHabit && (
          <HabitDetail habit={selectedHabit} onClose={() => setSelectedHabit(null)} refreshKey={refreshKey} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
