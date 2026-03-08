import { motion } from "framer-motion";
import { Crown, Users, Sparkles, Lock } from "lucide-react";
import { addHabit, getHabits } from "@/lib/habits";
import { toast } from "sonner";

interface DiscoverPageProps {
  onAdded: () => void;
}

const RECOMMENDED_HABITS = [
  { emoji: "🏃", name: "30분 운동하기", activeDays: [1, 2, 3, 4, 5], desc: "사용자 78%가 추가" },
  { emoji: "💧", name: "물 8잔 마시기", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 65%가 추가" },
  { emoji: "📚", name: "독서 20분", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 54%가 추가" },
  { emoji: "🧘", name: "명상 10분", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 47%가 추가" },
  { emoji: "😴", name: "11시 전 취침", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 42%가 추가" },
  { emoji: "✍️", name: "일기 쓰기", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 38%가 추가" },
  { emoji: "🥗", name: "건강한 식사", activeDays: [1, 2, 3, 4, 5], desc: "사용자 35%가 추가" },
  { emoji: "🧹", name: "정리 정돈 10분", activeDays: [0, 1, 2, 3, 4, 5, 6], desc: "사용자 30%가 추가" },
];

export default function DiscoverPage({ onAdded }: DiscoverPageProps) {
  const existingNames = getHabits().map((h) => h.name);

  const handleAddRecommended = (rec: typeof RECOMMENDED_HABITS[0]) => {
    if (existingNames.includes(rec.name)) {
      toast.info("이미 추가된 습관이에요!");
      return;
    }
    addHabit({ name: rec.name, emoji: rec.emoji, color: "primary", activeDays: rec.activeDays });
    toast.success(`${rec.emoji} ${rec.name} 추가됨!`);
    onAdded();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">추천 습관</h2>

      {/* Recommended habits */}
      <div className="space-y-2">
        {RECOMMENDED_HABITS.map((rec, i) => {
          const alreadyAdded = existingNames.includes(rec.name);
          return (
            <motion.div
              key={rec.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl p-4 shadow-sm flex items-center gap-3"
            >
              <span className="text-2xl">{rec.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{rec.name}</p>
                <p className="text-[11px] text-muted-foreground">{rec.desc}</p>
              </div>
              <button
                onClick={() => handleAddRecommended(rec)}
                disabled={alreadyAdded}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  alreadyAdded
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {alreadyAdded ? "추가됨" : "+ 추가"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Premium features teaser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold">Pro에서 더 많은 기능을</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">커뮤니티 비교</p>
              <p className="text-xs text-muted-foreground">비슷한 습관의 다른 사용자 달성률과 비교</p>
            </div>
            <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">AI 맞춤 분석</p>
              <p className="text-xs text-muted-foreground">나의 패턴을 분석하고 최적의 습관 계획 제안</p>
            </div>
            <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
              <span className="text-sm">☁️</span>
            </div>
            <div>
              <p className="text-sm font-medium">클라우드 동기화</p>
              <p className="text-xs text-muted-foreground">모든 기기에서 습관 데이터 백업 & 동기화</p>
            </div>
            <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          </div>
        </div>

        <button className="mt-4 w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm">
          Pro 업그레이드 →
        </button>
      </motion.div>
    </div>
  );
}
