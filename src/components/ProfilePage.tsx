import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProfile,
  saveProfile,
  AVATAR_EMOJIS,
  UserProfile,
} from "@/lib/profile";
import { getProStatus, ALL_BADGES, getEarnedBadges, PRO_FEATURES, getAllHabitBadges, getEarnedMasterBadge, HABIT_TIERS } from "@/lib/membership";
import { getHabits, getStreak } from "@/lib/habits";
import { ProBadgeInline } from "@/components/BadgeIcon";
import {
  ChevronRight,
  Lock,
  LogIn,
  Crown,
  Shield,
  Mail,
  UserCircle,
  Palette,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  onLockScreen: () => void;
}

const AVATAR_FRAMES = [
  { id: "none", label: "없음", ring: "" },
  { id: "gold", label: "골드", ring: "ring-2 ring-accent shadow-md shadow-accent/20" },
  { id: "green", label: "그린", ring: "ring-2 ring-success shadow-md shadow-success/20" },
  { id: "rainbow", label: "레인보우", ring: "ring-2 ring-primary shadow-md shadow-primary/20" },
];

const NICKNAME_COLORS = [
  { id: "default", label: "기본", class: "text-foreground" },
  { id: "accent", label: "골드", class: "text-accent" },
  { id: "primary", label: "그린", class: "text-primary" },
  { id: "destructive", label: "레드", class: "text-destructive" },
];

export default function ProfilePage({ onLockScreen }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(getProfile);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const proStatus = getProStatus();

  const update = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const earnedBadgeTypes = useMemo(() => {
    const earned: string[] = [];
    if (proStatus.isPro) earned.push("pro");
    const habits = getHabits();
    let maxStreak = 0;
    habits.forEach((h) => {
      maxStreak = Math.max(maxStreak, getStreak(h.id));
    });
    if (maxStreak >= 7) earned.push("streak7");
    if (maxStreak >= 30) earned.push("streak30");
    if (maxStreak >= 100) earned.push("streak100");
    earned.push("early_adopter");
    return earned;
  }, [proStatus.isPro]);

  const selectedFrame = AVATAR_FRAMES.find((f) => f.id === (profile as any).avatarFrame) || AVATAR_FRAMES[0];
  const selectedNickColor = NICKNAME_COLORS.find((c) => c.id === (profile as any).nickColor) || NICKNAME_COLORS[0];

  return (
    <div className="space-y-5">
      {/* Avatar & Name */}
      <div className="bg-card rounded-2xl p-6 shadow-sm text-center">
        <button
          onClick={() => setEditSection(editSection === "avatar" ? null : "avatar")}
          className={`text-5xl mb-3 block mx-auto hover:scale-110 transition-transform w-20 h-20 rounded-full flex items-center justify-center ${selectedFrame.ring}`}
        >
          {profile.avatarEmoji}
        </button>

        <AnimatePresence>
          {editSection === "avatar" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex flex-wrap justify-center gap-2 py-2">
                {AVATAR_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      update({ avatarEmoji: e });
                      setEditSection(null);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      profile.avatarEmoji === e
                        ? "bg-primary/15 ring-2 ring-primary scale-110"
                        : "bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2">
          <p className={`text-lg font-bold ${selectedNickColor.class}`}>
            {profile.nickname || "닉네임을 설정하세요"}
          </p>
          <ProBadgeInline isPro={proStatus.isPro} />
        </div>
        <p className="text-sm text-muted-foreground">{profile.email || "이메일 미설정"}</p>

        {/* Earned badges row */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {ALL_BADGES.filter((b) => earnedBadgeTypes.includes(b.type)).map((badge) => (
            <div
              key={badge.type}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm"
              title={badge.description}
            >
              {badge.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Per-habit Badges */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Award className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-muted-foreground">습관 배지</h3>
        </div>

        {/* Master badge */}
        {(() => {
          const master = getEarnedMasterBadge();
          return master ? (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                <span className="text-xl">{master.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-accent">{master.label}</p>
                  <p className="text-[10px] text-muted-foreground">{master.description}</p>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Per-habit badges */}
        <div className="px-4 pb-4 space-y-2">
          {getAllHabitBadges().map((hb) => {
            const progress = hb.nextTier
              ? Math.min(100, Math.round(((hb.streak - hb.tier.minStreak) / (hb.nextTier.minStreak - hb.tier.minStreak)) * 100))
              : 100;
            return (
              <div key={hb.habit.id} className="flex items-center gap-3 py-2">
                <span className="text-xl w-8 text-center">{hb.tier.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold truncate">{hb.habit.emoji} {hb.habit.name}</span>
                    <span className={`text-[10px] font-bold ${hb.tier.color}`}>{hb.tier.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {hb.streak}일 연속
                    {hb.nextTier && ` · 다음: ${hb.nextTier.emoji} ${hb.nextTier.label} (${hb.nextTier.minStreak}일)`}
                    {!hb.nextTier && " · 최고 등급 달성! 🎉"}
                  </p>
                </div>
              </div>
            );
          })}
          {getAllHabitBadges().length === 0 && (
            <p className="text-xs text-muted-foreground/60 text-center py-4">습관을 추가하면 배지를 모을 수 있어요</p>
          )}
        </div>

        {/* Tier guide */}
        <div className="px-4 pb-4">
          <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">등급 안내</p>
          <div className="flex gap-1.5 flex-wrap">
            {HABIT_TIERS.map((t) => (
              <span key={t.tier} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50">
                {t.emoji} {t.label} ({t.minStreak}일+)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Customization - Pro only */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground">프로필 꾸미기</h3>
          {!proStatus.isPro && <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />}
        </div>

        {/* Avatar frame */}
        <button
          onClick={() => proStatus.isPro ? setEditSection(editSection === "frame" ? null : "frame") : toast.info("Pro 전용 기능이에요 👑")}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">아바타 프레임</p>
            <p className="text-xs text-muted-foreground">{selectedFrame.label}</p>
          </div>
          {!proStatus.isPro && <Lock className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {editSection === "frame" && proStatus.isPro && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3">
              <div className="flex gap-2">
                {AVATAR_FRAMES.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => update({ ...profile, avatarFrame: frame.id } as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedFrame.id === frame.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {frame.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nickname color */}
        <button
          onClick={() => proStatus.isPro ? setEditSection(editSection === "nickcolor" ? null : "nickcolor") : toast.info("Pro 전용 기능이에요 👑")}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <Palette className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">닉네임 색상</p>
            <p className={`text-xs ${selectedNickColor.class}`}>{selectedNickColor.label}</p>
          </div>
          {!proStatus.isPro && <Lock className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {editSection === "nickcolor" && proStatus.isPro && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3">
              <div className="flex gap-2">
                {NICKNAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => update({ ...profile, nickColor: color.id } as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedNickColor.id === color.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Info */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-sm font-semibold text-muted-foreground px-4 pt-4 pb-2">내 정보</h3>

        <button
          onClick={() => setEditSection(editSection === "nickname" ? null : "nickname")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <UserCircle className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">닉네임</p>
            <p className="text-xs text-muted-foreground">{profile.nickname || "미설정"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <AnimatePresence>
          {editSection === "nickname" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3">
              <input
                value={profile.nickname}
                onChange={(e) => update({ nickname: e.target.value })}
                placeholder="닉네임 입력"
                maxLength={20}
                className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setEditSection(editSection === "email" ? null : "email")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <Mail className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">이메일</p>
            <p className="text-xs text-muted-foreground">{profile.email || "미설정"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <AnimatePresence>
          {editSection === "email" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="이메일 입력"
                maxLength={100}
                className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-sm font-semibold text-muted-foreground px-4 pt-4 pb-2">보안</h3>

        <button
          onClick={() => setEditSection(editSection === "lock" ? null : "lock")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <Shield className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">화면 잠금</p>
            <p className="text-xs text-muted-foreground">
              {profile.screenLockEnabled ? "활성화 · PIN 설정됨" : "비활성화"}
            </p>
          </div>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${profile.screenLockEnabled ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all ${profile.screenLockEnabled ? "left-[18px]" : "left-0.5"}`} />
          </div>
        </button>
        <AnimatePresence>
          {editSection === "lock" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-3">
              <div className="space-y-2">
                <input
                  type="password"
                  inputMode="numeric"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="4~6자리 PIN 입력"
                  maxLength={6}
                  className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  {profile.screenLockEnabled ? (
                    <button
                      onClick={() => {
                        update({ screenLockEnabled: false, screenLockPin: "" });
                        setPinInput("");
                        setEditSection(null);
                        toast.success("화면 잠금이 해제되었습니다");
                      }}
                      className="flex-1 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium"
                    >
                      잠금 해제
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (pinInput.length < 4) {
                          toast.error("최소 4자리 PIN을 입력하세요");
                          return;
                        }
                        update({ screenLockEnabled: true, screenLockPin: pinInput });
                        setPinInput("");
                        setEditSection(null);
                        toast.success("화면 잠금이 설정되었습니다");
                      }}
                      className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                    >
                      잠금 설정
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {profile.screenLockEnabled && (
          <button
            onClick={onLockScreen}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <Lock className="w-5 h-5 text-accent" />
            <p className="text-sm font-medium">지금 잠금</p>
          </button>
        )}
      </div>

      {/* Account / Login */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-sm font-semibold text-muted-foreground px-4 pt-4 pb-2">계정</h3>

        <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
          <LogIn className="w-5 h-5 text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">로그인 / 회원가입</p>
            <p className="text-xs text-muted-foreground">데이터 백업 및 동기화</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
          <Crown className="w-5 h-5 text-accent" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">
              {proStatus.isPro ? "Pro 멤버십 관리" : "Pro 업그레이드"}
            </p>
            <p className="text-xs text-muted-foreground">
              {proStatus.isPro ? "현재 Pro 멤버입니다 👑" : "커뮤니티, 꾸미기, AI 분석"}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
