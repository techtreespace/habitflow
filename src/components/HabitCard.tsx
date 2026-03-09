import { motion } from "framer-motion";
import { Check, Flame, Trash2, Bell, Settings } from "lucide-react";
import { Habit, getStreak, isHabitDone, toggleHabitLog, formatDate } from "@/lib/habits";
import { getHabitTier } from "@/lib/membership";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit;
  date: Date;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onEdit?: (habit: Habit) => void;
}

export default function HabitCard({ habit, date, onToggle, onDelete, onEdit }: HabitCardProps) {
  const dateStr = formatDate(date);
  const done = isHabitDone(habit.id, dateStr);
  const streak = getStreak(habit.id);
  const tier = getHabitTier(streak);
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

        {/* Tier badge and settings */}
        <div className="flex items-center gap-2">
          <span className="text-base" title={`${tier.label} (${streak}일 연속)`}>{tier.emoji}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDelete(!showDelete);
            }}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-60 hover:opacity-100"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Action overlay */}
      {showDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-3 border"
        >
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
                setShowDelete(false);
              }}
              className="flex items-center gap-1.5 text-primary text-sm font-medium px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" /> 수정
            </button>
          )}
          <button
            onClick={() => onDelete(habit.id)}
            className="flex items-center gap-1.5 text-destructive text-sm font-medium px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> 삭제
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            취소
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
