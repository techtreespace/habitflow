import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Habit } from "@/lib/habits";
import HabitCard from "./HabitCard";
import TodoSection from "./TodoSection";

type SubTab = "habits" | "todos";

interface TodayTabsProps {
  todayHabits: Habit[];
  today: Date;
  refresh: () => void;
  handleDelete: (id: string) => void;
  handleEdit: (habit: Habit) => void;
  setSelectedHabit: (habit: Habit) => void;
  setShowAdd: (show: boolean) => void;
  refreshKey: number;
}

export default function TodayTabs({
  todayHabits,
  today,
  refresh,
  handleDelete,
  handleEdit,
  setSelectedHabit,
  setShowAdd,
  refreshKey,
}: TodayTabsProps) {
  const [subTab, setSubTab] = useState<SubTab>("habits");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-4">
        <div className="flex gap-1 p-0.5 bg-muted/50 rounded-lg flex-1">
          <button
            onClick={() => setSubTab("habits")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              subTab === "habits"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            습관 {todayHabits.length > 0 && <span className="text-muted-foreground ml-0.5">({todayHabits.length})</span>}
          </button>
          <button
            onClick={() => setSubTab("todos")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              subTab === "todos"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            할 일
          </button>
        </div>
        {subTab === "habits" && (
          <button
            onClick={() => setShowAdd(true)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {subTab === "habits" ? (
          <motion.div
            key="habits"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {todayHabits.length > 0 ? (
              <div className="space-y-2">
                {todayHabits.map((habit) => (
                  <div key={habit.id} onClick={() => setSelectedHabit(habit)}>
                    <HabitCard habit={habit} date={today} onToggle={refresh} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="text-4xl mb-3 block">🌱</span>
                <h2 className="text-base font-bold mb-1">좋은 습관을 시작하세요</h2>
                <p className="text-muted-foreground text-xs">+ 버튼을 눌러 첫 번째 습관을 만들어보세요</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="todos"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            <TodoSection refreshKey={refreshKey} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
