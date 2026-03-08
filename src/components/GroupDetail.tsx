import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Trophy, MessageCircle, Heart, Send, Crown, Lock } from "lucide-react";

interface GroupInfo {
  emoji: string;
  name: string;
  members: number;
  desc: string;
  active: boolean;
}

interface GroupDetailProps {
  group: GroupInfo;
  onBack: () => void;
}

type SubTab = "feed" | "leaderboard" | "chat";

// Sample data
const SAMPLE_MEMBERS = [
  { avatar: "🦊", name: "운동매니아", streak: 42, rate: 95, tier: "🍎" },
  { avatar: "💪", name: "헬스왕", streak: 38, rate: 91, tier: "🍎" },
  { avatar: "🌸", name: "갓생러", streak: 27, rate: 85, tier: "🌸" },
  { avatar: "🎯", name: "목표달성", streak: 21, rate: 78, tier: "🌳" },
  { avatar: "🐻", name: "곰돌이", streak: 14, rate: 72, tier: "🌳" },
  { avatar: "🌈", name: "무지개", streak: 9, rate: 65, tier: "🌱" },
  { avatar: "⭐", name: "별이", streak: 5, rate: 55, tier: "🌱" },
];

const SAMPLE_FEED_ITEMS = [
  { avatar: "🦊", name: "운동매니아", text: "오늘도 5km 달리기 완료! 🏃‍♂️ 42일 연속 달성!", time: "30분 전", likes: 12 },
  { avatar: "💪", name: "헬스왕", text: "벤치프레스 새 기록! 80kg 달성 💪", time: "1시간 전", likes: 8 },
  { avatar: "🌸", name: "갓생러", text: "아침 6시 기상 27일째 ☀️ 습관이 되어가는 느낌", time: "2시간 전", likes: 15 },
  { avatar: "🎯", name: "목표달성", text: "플랭크 3분 성공! 저번주엔 2분도 힘들었는데 🎉", time: "3시간 전", likes: 6 },
  { avatar: "🐻", name: "곰돌이", text: "오늘 처음으로 요가 도전! 몸이 뻣뻣하지만 좋았어요 🧘", time: "5시간 전", likes: 9 },
];

const SAMPLE_CHAT = [
  { avatar: "🦊", name: "운동매니아", text: "다들 오늘 운동 했나요?", time: "10분 전" },
  { avatar: "💪", name: "헬스왕", text: "방금 끝났어요! 오늘 힘든 날이었지만 해냈습니다 💯", time: "8분 전" },
  { avatar: "🌸", name: "갓생러", text: "저도요! 같이 하니까 동기부여가 돼요 🙌", time: "5분 전" },
  { avatar: "🎯", name: "목표달성", text: "내일 아침 6시에 공원 러닝 하실 분?", time: "3분 전" },
  { avatar: "🐻", name: "곰돌이", text: "저 참여하고 싶어요! 🙋‍♂️", time: "1분 전" },
];

export default function GroupDetail({ group, onBack }: GroupDetailProps) {
  const [subTab, setSubTab] = useState<SubTab>("feed");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-2xl">{group.emoji}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold truncate">{group.name}</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{group.members.toLocaleString()}명</span>
            <span>·</span>
            <span>{group.desc}</span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 p-0.5 bg-muted/50 rounded-lg">
        {([
          { id: "feed" as SubTab, label: "달성 피드" },
          { id: "leaderboard" as SubTab, label: "리더보드" },
          { id: "chat" as SubTab, label: "게시판" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              subTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {subTab === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2.5"
          >
            {SAMPLE_FEED_ITEMS.map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-2">{item.text}</p>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-muted-foreground/50">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{item.likes}</span>
                    <Lock className="w-2.5 h-2.5 opacity-40" />
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground/50">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <Lock className="w-2.5 h-2.5 opacity-40" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {subTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            {/* Top 3 podium */}
            <div className="flex items-end justify-center gap-3 mb-4 pt-2">
              {[SAMPLE_MEMBERS[1], SAMPLE_MEMBERS[0], SAMPLE_MEMBERS[2]].map((m, i) => {
                const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                const height = rank === 1 ? "h-20" : rank === 2 ? "h-16" : "h-12";
                const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
                return (
                  <div key={rank} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{m.avatar}</span>
                    <span className="text-[10px] font-semibold truncate max-w-[60px]">{m.name}</span>
                    <div className={`w-16 ${height} rounded-t-lg bg-primary/10 flex flex-col items-center justify-center`}>
                      <span className="text-lg">{medal}</span>
                      <span className="text-[10px] font-bold text-primary">{m.streak}일</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full ranking */}
            {SAMPLE_MEMBERS.map((member, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                  i < 3 ? "bg-card shadow-sm" : "bg-card/50"
                }`}
              >
                <span className={`w-5 text-center text-xs font-bold ${
                  i === 0 ? "text-accent" : i < 3 ? "text-primary" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <span className="text-lg">{member.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate">{member.name}</span>
                    <span className="text-[10px]">{member.tier}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">🔥 {member.streak}일</span>
                    <span className="text-[10px] text-muted-foreground">달성률 {member.rate}%</span>
                  </div>
                </div>
                {i === 0 && <Crown className="w-4 h-4 text-accent shrink-0" />}
              </div>
            ))}
          </motion.div>
        )}

        {subTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="space-y-3 mb-4">
              {SAMPLE_CHAT.map((msg, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="text-lg shrink-0 mt-0.5">{msg.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-semibold">{msg.name}</span>
                      <span className="text-[9px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <div className="bg-card rounded-xl rounded-tl-sm px-3 py-2 text-sm shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input - locked */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex-1 flex items-center gap-2 px-2 text-muted-foreground/50">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">Pro 전용 기능입니다</span>
              </div>
              <button className="p-2 rounded-lg bg-primary/20 text-primary/40" disabled>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
