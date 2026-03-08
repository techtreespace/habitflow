import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { addHabit, EMOJI_OPTIONS } from "@/lib/habits";

interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function AddHabitDialog({ open, onClose, onAdded }: AddHabitDialogProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏃");
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (day: number) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    addHabit({ name: name.trim(), emoji, color: "primary", activeDays });
    setName("");
    setEmoji("🏃");
    setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    onAdded();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-4 z-50 bg-card rounded-2xl p-6 shadow-xl max-w-md mx-auto"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">새 습관 만들기</h2>
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

              <motion.button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 transition-all"
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="w-5 h-5 inline mr-1 -mt-0.5" />
                습관 추가
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
