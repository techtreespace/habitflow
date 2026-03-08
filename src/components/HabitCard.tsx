import { motion } from "framer-motion";
import { Check, Flame, Trash2 } from "lucide-react";
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
        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
          done ? "bg-success-light" : "bg-card"
        } shadow-sm`}
        whileTap={{ scale: 0.98 }}
      >
        {/* Check button */}
        <motion.button
          onClick={handleToggle}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all ${
            done
              ? "bg-success text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground"
          }`}
          whileTap={{ scale: 0.85 }}
        >
          {done ? <Check className="w-6 h-6" strokeWidth={3} /> : habit.emoji}
        </motion.button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base truncate ${done ? "line-through opacity-60" : ""}`}>
            {habit.name}
          </p>
          {streak > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-streak" />
              <span className="text-xs font-medium text-streak">{streak}일 연속</span>
            </div>
          )}
        </div>

        {/* Emoji badge */}
        <span className="text-2xl">{habit.emoji}</span>
      </motion.div>

      {/* Delete overlay */}
      {showDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-destructive/90 rounded-2xl flex items-center justify-center gap-4"
        >
          <button
            onClick={() => onDelete(habit.id)}
            className="flex items-center gap-2 text-destructive-foreground font-medium px-4 py-2 rounded-xl bg-destructive-foreground/20"
          >
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="text-destructive-foreground/80 font-medium px-4 py-2 rounded-xl"
          >
            취소
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
