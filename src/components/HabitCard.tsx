import { motion } from "framer-motion";
import { Check, Flame, Trash2, Bell } from "lucide-react";
import { Habit, getStreak, isHabitDone, toggleHabitLog, formatDate } from "@/lib/habits";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit;
  date: Date;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, date, onToggle, onDelete }: HabitCardProps) {
  const dateStr = formatDate(date);
  const done = isHabitDone(habit.id, dateStr);
  const streak = getStreak(habit.id);
  const [showDelete, setShowDelete] = useState(false);

  const handleToggle = () => {
    toggleHabitLog(habit.id, dateStr);
    onToggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative"
      onContextMenu={(e) => {
        e.preventDefault();
        setShowDelete(!showDelete);
      }}
    >
      <motion.div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          done ? "bg-success-light" : "bg-card"
        } shadow-sm`}
        whileTap={{ scale: 0.98 }}
      >
        {/* Check button */}
        <motion.button
          onClick={handleToggle}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 transition-all ${
            done
              ? "bg-success text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground"
          }`}
          whileTap={{ scale: 0.85 }}
        >
          {done ? <Check className="w-4.5 h-4.5" strokeWidth={3} /> : <span className="text-sm">{habit.emoji}</span>}
        </motion.button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${done ? "line-through opacity-60" : ""}`}>
            {habit.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {streak > 0 && (
              <div className="flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-streak" />
                <span className="text-[11px] font-medium text-streak">{streak}일</span>
              </div>
            )}
            {habit.reminderTime && (
              <div className="flex items-center gap-0.5">
                <Bell className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{habit.reminderTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Emoji badge */}
        <span className="text-lg">{habit.emoji}</span>
      </motion.div>

      {/* Delete overlay */}
      {showDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-destructive/90 rounded-xl flex items-center justify-center gap-3"
        >
          <button
            onClick={() => onDelete(habit.id)}
            className="flex items-center gap-1.5 text-destructive-foreground text-sm font-medium px-3 py-1.5 rounded-lg bg-destructive-foreground/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> 삭제
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="text-destructive-foreground/80 text-sm font-medium px-3 py-1.5 rounded-lg"
          >
            취소
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
