import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Habit, getCompletionRate } from "@/lib/habits";
import HabitCalendar from "./HabitCalendar";

interface HabitDetailProps {
  habit: Habit;
  onClose: () => void;
  refreshKey: number;
}

export default function HabitDetail({ habit, onClose, refreshKey }: HabitDetailProps) {
  const rate = getCompletionRate(habit.id, 30);
  const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="max-w-md mx-auto p-6">
        <button onClick={onClose} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ChevronLeft className="w-5 h-5" /> 돌아가기
        </button>

        <div className="text-center mb-8">
          <span className="text-5xl mb-3 block">{habit.emoji}</span>
          <h2 className="text-xl font-bold">{habit.name}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {habit.activeDays.map((d) => DAY_LABELS[d]).join(", ")} 반복
          </p>
        </div>

        {/* Completion ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${rate * 2.64} ${264 - rate * 2.64}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{rate}%</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">최근 30일 달성률</p>

        {/* Mini calendar */}
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-medium mb-3">최근 28일</p>
          <HabitCalendar habit={habit} refreshKey={refreshKey} />
        </div>
      </div>
    </motion.div>
  );
}
