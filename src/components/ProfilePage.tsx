import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProfile,
  saveProfile,
  AVATAR_EMOJIS,
  UserProfile,
} from "@/lib/profile";
import {
  ChevronRight,
  Lock,
  LogIn,
  Crown,
  Shield,
  Mail,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  onLockScreen: () => void;
}

export default function ProfilePage({ onLockScreen }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(getProfile);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");

  const update = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  return (
    <div className="space-y-5">
      {/* Avatar & Name */}
      <div className="bg-card rounded-2xl p-6 shadow-sm text-center">
        <button
          onClick={() => setEditSection(editSection === "avatar" ? null : "avatar")}
          className="text-5xl mb-3 block mx-auto hover:scale-110 transition-transform"
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

        <p className="text-lg font-bold">{profile.nickname || "닉네임을 설정하세요"}</p>
        <p className="text-sm text-muted-foreground">{profile.email || "이메일 미설정"}</p>
      </div>

      {/* Profile Info */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-sm font-semibold text-muted-foreground px-4 pt-4 pb-2">내 정보</h3>

        {/* Nickname */}
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
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 pb-3"
            >
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

        {/* Email */}
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
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 pb-3"
            >
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

        {/* Screen Lock toggle */}
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
          <div
            className={`w-10 h-6 rounded-full relative transition-colors ${
              profile.screenLockEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all ${
                profile.screenLockEnabled ? "left-[18px]" : "left-0.5"
              }`}
            />
          </div>
        </button>
        <AnimatePresence>
          {editSection === "lock" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 pb-3"
            >
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

        {/* Lock now */}
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

      {/* Account / Login placeholder */}
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
            <p className="text-sm font-medium">Pro 업그레이드</p>
            <p className="text-xs text-muted-foreground">클라우드 동기화, AI 분석, 커뮤니티</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
