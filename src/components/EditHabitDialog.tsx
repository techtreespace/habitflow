import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Bell, BellOff } from "lucide-react";
import { updateHabit, EMOJI_OPTIONS, Habit } from "@/lib/habits";

interface EditHabitDialogProps {
  open: boolean;
  habit: Habit | null;
  onClose: () => void;
  onUpdated: () => void;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function EditHabitDialog({ open, habit, onClose, onUpdated }: EditHabitDialogProps) {
  const [name, setName] = useState(habit?.name || "");
  const [emoji, setEmoji] = useState(habit?.emoji || "🏃");
  const [activeDays, setActiveDays] = useState<number[]>(habit?.activeDays || []);
  const [reminderEnabled, setReminderEnabled] = useState(!!habit?.reminderTime);
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || "08:00");

  const toggleDay = (day: number) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!habit || !name.trim()) return;
    updateHabit(habit.id, {
      name: name.trim(),
      emoji,
      activeDays,
      reminderTime: reminderEnabled ? reminderTime : undefined,
    });
    onUpdated();
    onClose();
  };

  // Reset form when habit changes
  useState(() => {
    if (habit) {
      setName(habit.name);
      setEmoji(habit.emoji);
      setActiveDays(habit.activeDays);
      setReminderEnabled(!!habit.reminderTime);
      setReminderTime(habit.reminderTime || "08:00");
    }
  });

  return (
    <AnimatePresence>
      {open && habit && (
        <>
          <motion.div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-4 z-50 bg-card rounded-2xl p-6 shadow-xl max-w-md mx-auto max-h-[85vh] overflow-y-auto"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">습관 수정</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Emoji selector */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">아이콘</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                        emoji === e
                          ? "bg-primary/15 ring-2 ring-primary scale-110"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">습관 이름</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 30분 운동하기"
                  className="w-full px-4 py-3 rounded-xl bg-muted border-none outline-none text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Active days */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">반복 요일</label>
                <div className="flex gap-2">
                  {DAY_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeDays.includes(i)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">알림 설정</label>
                  <button
                    onClick={() => setReminderEnabled(!reminderEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      reminderEnabled
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {reminderEnabled ? (
                      <><Bell className="w-3.5 h-3.5" /> 켜짐</>
                    ) : (
                      <><BellOff className="w-3.5 h-3.5" /> 꺼짐</>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {reminderEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border-none outline-none text-foreground focus:ring-2 focus:ring-primary transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        설정한 시간에 브라우저 알림을 받습니다 (앱이 열려있을 때)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 transition-all"
                whileTap={{ scale: 0.97 }}
              >
                <Save className="w-5 h-5 inline mr-1 -mt-0.5" />
                저장하기
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}