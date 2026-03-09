import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, CalendarDays } from "lucide-react";
import { getHabits, deleteHabit, Habit } from "@/lib/habits";
import { getProfile, isScreenLocked, setScreenLocked } from "@/lib/profile";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import EditHabitDialog from "@/components/EditHabitDialog";
import StatsBar from "@/components/StatsBar";
import HabitDetail from "@/components/HabitDetail";
import BottomNav, { TabType } from "@/components/BottomNav";
import AnalyticsPage from "@/components/AnalyticsPage";
import CommunityPage from "@/components/CommunityPage";
import AdBanner from "@/components/AdBanner";
import ProfilePage from "@/components/ProfilePage";
import LockScreen from "@/components/LockScreen";
import TodoSection from "@/components/TodoSection";
import TodayTabs from "@/components/TodayTabs";
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
      case "analytics":
        return <AnalyticsPage refreshKey={refreshKey} />;
      case "community":
        return <CommunityPage />;
      case "profile":
        return <ProfilePage onLockScreen={handleLockScreen} />;
      default:
        return (
          <>
            {/* Compact stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5"
              key={refreshKey}
            >
              <StatsBar refreshKey={refreshKey} />
            </motion.div>

            {/* Habits + Todos unified section */}
            <TodayTabs
              todayHabits={todayHabits}
              today={today}
              refresh={refresh}
              handleDelete={handleDelete}
              setSelectedHabit={setSelectedHabit}
              setShowAdd={setShowAdd}
              refreshKey={refreshKey}
            />

            {/* Single ad at the bottom */}
            <div className="mt-5">
              <AdBanner variant="inline" />
            </div>

            {/* Other habits (not today) */}
            {habits.length > todayHabits.length && (
              <div className="mt-6">
                <p className="text-xs font-medium text-muted-foreground mb-2">다른 요일 습관</p>
                <div className="space-y-2 opacity-40">
                  {habits
                    .filter((h) => !h.activeDays.includes(dayOfWeek))
                    .map((habit) => (
                      <div key={habit.id} onClick={() => setSelectedHabit(habit)}>
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
            {weather.loaded && (
              <span className="text-sm font-medium ml-1">
                {weather.emoji} {weather.temperature}°
              </span>
            )}
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
