import { motion } from "framer-motion";
import { Users, Crown, Lock, MessageCircle, Heart, TrendingUp } from "lucide-react";

const GROUPS = [
  {
    emoji: "🏃",
    name: "매일 운동 챌린지",
    members: 1243,
    desc: "함께 운동하는 습관을 만들어요",
    active: true,
  },
  {
    emoji: "📚",
    name: "독서 모임",
    members: 876,
    desc: "하루 20분 독서 챌린지",
    active: true,
  },
  {
    emoji: "🧘",
    name: "마음 챙김",
    members: 654,
    desc: "명상과 감사일기 습관",
    active: true,
  },
  {
    emoji: "😴",
    name: "수면 관리",
    members: 521,
    desc: "11시 전 취침 도전",
    active: false,
  },
  {
    emoji: "💧",
    name: "건강한 하루",
    members: 1087,
    desc: "물 마시기 & 건강 식단",
    active: false,
  },
];

const FEED = [
  { user: "🦊", name: "운동매니아", text: "오늘도 30분 달리기 완료! 🔥 42일 연속 달성!", likes: 23, time: "2시간 전" },
  { user: "🌸", name: "책벌레", text: "이번 달 5권째 읽는 중 📖 추천: 아토믹 해빗", likes: 15, time: "3시간 전" },
  { user: "🎯", name: "갓생러", text: "명상 100일 돌파했어요! 마음이 정말 편안해졌어요 🧘", likes: 41, time: "5시간 전" },
];

export default function CommunityPage() {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">커뮤니티</h2>

      {/* Groups */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">인기 습관 그룹</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {GROUPS.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-sm min-w-[160px] shrink-0"
            >
              <span className="text-3xl block mb-2">{group.emoji}</span>
              <p className="text-sm font-semibold truncate">{group.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{group.desc}</p>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{group.members.toLocaleString()}명</span>
              </div>
              <button
                className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  group.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {group.active ? "참여하기" : "곧 오픈"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">습관 피드</h3>
        <div className="space-y-3">
          {FEED.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{post.user}</span>
                <div>
                  <p className="text-sm font-semibold">{post.name}</p>
                  <p className="text-[10px] text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-3">{post.text}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">댓글</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium teaser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold">Pro 커뮤니티 기능</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">나와 비슷한 사용자 달성률 비교</p>
            <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">그룹 채팅 & 응원 메시지</p>
            <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">1:1 습관 버디 매칭</p>
            <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
          </div>
        </div>
        <button className="mt-4 w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm">
          Pro 업그레이드 →
        </button>
      </motion.div>
    </div>
  );
}
