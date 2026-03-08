/**
 * Badge & Pro membership system (frontend-only for now)
 * When backend is connected, this will sync with server data.
 */

export type BadgeType = "pro" | "streak7" | "streak30" | "streak100" | "helper" | "early_adopter";

export interface Badge {
  type: BadgeType;
  label: string;
  emoji: string;
  description: string;
  earned: boolean;
}

export const ALL_BADGES: Omit<Badge, "earned">[] = [
  { type: "pro", label: "Pro", emoji: "👑", description: "Pro 멤버십 가입" },
  { type: "streak7", label: "7일 연속", emoji: "🔥", description: "7일 연속 습관 달성" },
  { type: "streak30", label: "30일 연속", emoji: "💎", description: "30일 연속 습관 달성" },
  { type: "streak100", label: "100일 마스터", emoji: "🏆", description: "100일 연속 습관 달성" },
  { type: "helper", label: "도우미", emoji: "🤝", description: "커뮤니티에서 10명 이상 응원" },
  { type: "early_adopter", label: "얼리어답터", emoji: "🌟", description: "초기 가입 사용자" },
];

export interface ProStatus {
  isPro: boolean;
  subscribedAt?: string;
}

const PRO_KEY = "habitflow_pro";

export function getProStatus(): ProStatus {
  const raw = localStorage.getItem(PRO_KEY);
  return raw ? JSON.parse(raw) : { isPro: false };
}

export function setProStatus(status: ProStatus) {
  localStorage.setItem(PRO_KEY, JSON.stringify(status));
}

/** Check which activity badges are earned based on habit data */
export function getEarnedBadges(): BadgeType[] {
  const earned: BadgeType[] = [];
  const pro = getProStatus();
  if (pro.isPro) earned.push("pro");

  // Check streaks from habit data
  try {
    const { getHabits, getStreak } = require("@/lib/habits");
    const habits = getHabits();
    let maxStreak = 0;
    habits.forEach((h: any) => {
      maxStreak = Math.max(maxStreak, getStreak(h.id));
    });
    if (maxStreak >= 7) earned.push("streak7");
    if (maxStreak >= 30) earned.push("streak30");
    if (maxStreak >= 100) earned.push("streak100");
  } catch {
    // ignore
  }

  // Early adopter: if user has been using for > 0 days
  earned.push("early_adopter");

  return earned;
}

/** Pro features list */
export const PRO_FEATURES = {
  community: "커뮤니티 전체 기능 (글쓰기, 좋아요, 댓글)",
  profileCustom: "프로필 꾸미기 (아바타 프레임, 배경, 닉네임 색상)",
  advancedStats: "고급 통계 & AI 분석",
  adFree: "광고 제거",
  cloudSync: "클라우드 동기화 & 백업",
  badges: "Pro 배지 & 활동 배지 표시",
} as const;
