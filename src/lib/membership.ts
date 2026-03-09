/**
 * Badge & Pro membership system
 * 
 * Per-habit badges: 5 tiers (씨앗→새싹→나무→꽃→열매) based on streak
 * Master badges: composite criteria (overall rate + individual gold count)
 */

import { getHabits, getStreak, getCompletionRate, Habit } from "@/lib/habits";

// ── Habit Badge Tiers ──────────────────────────────────

export type HabitTier = "seed" | "sprout" | "tree" | "flower" | "fruit";

export interface HabitTierInfo {
  tier: HabitTier;
  label: string;
  emoji: string;
  minStreak: number;
  color: string; // tailwind token
}

export const HABIT_TIERS: HabitTierInfo[] = [
  { tier: "seed",   label: "씨앗",  emoji: "🌰", minStreak: 0,   color: "text-muted-foreground" },
  { tier: "sprout", label: "새싹",  emoji: "🌱", minStreak: 7,   color: "text-success" },
  { tier: "tree",   label: "나무",  emoji: "🌳", minStreak: 14,  color: "text-success" },
  { tier: "flower", label: "꽃",    emoji: "🌸", minStreak: 30,  color: "text-primary" },
  { tier: "fruit",  label: "열매",  emoji: "🍎", minStreak: 60,  color: "text-accent" },
];

export function getHabitTier(streak: number): HabitTierInfo {
  // Return highest matching tier
  for (let i = HABIT_TIERS.length - 1; i >= 0; i--) {
    if (streak >= HABIT_TIERS[i].minStreak) return HABIT_TIERS[i];
  }
  return HABIT_TIERS[0];
}

export function getNextTier(currentTier: HabitTier): HabitTierInfo | null {
  const idx = HABIT_TIERS.findIndex((t) => t.tier === currentTier);
  return idx < HABIT_TIERS.length - 1 ? HABIT_TIERS[idx + 1] : null;
}

export interface HabitBadgeInfo {
  habit: Habit;
  streak: number;
  tier: HabitTierInfo;
  nextTier: HabitTierInfo | null;
  rate30: number;
}

export function getAllHabitBadges(): HabitBadgeInfo[] {
  const habits = getHabits();
  return habits.map((habit) => {
    const streak = getStreak(habit.id);
    const tier = getHabitTier(streak);
    const nextTier = getNextTier(tier.tier);
    const rate30 = getCompletionRate(habit.id, 30);
    return { habit, streak, tier, nextTier, rate30 };
  });
}

// ── Master Badges ──────────────────────────────────────

export type MasterTier = "bronze_master" | "silver_master" | "gold_master" | "grand_master";

export interface MasterBadgeInfo {
  tier: MasterTier;
  label: string;
  emoji: string;
  description: string;
}

export const MASTER_BADGES: MasterBadgeInfo[] = [
  { tier: "bronze_master", label: "브론즈 마스터", emoji: "🥉", description: "평균 달성률 60%+ & 나무 배지 1개+" },
  { tier: "silver_master", label: "실버 마스터",   emoji: "🥈", description: "평균 달성률 70%+ & 꽃 배지 1개+" },
  { tier: "gold_master",   label: "골드 마스터",   emoji: "🥇", description: "평균 달성률 80%+ & 열매 배지 2개+" },
  { tier: "grand_master",  label: "그랜드 마스터", emoji: "💎", description: "평균 달성률 90%+ & 열매 배지 3개+" },
];

export function getEarnedMasterBadge(): MasterBadgeInfo | null {
  const badges = getAllHabitBadges();
  if (badges.length === 0) return null;

  const avgRate = Math.round(badges.reduce((s, b) => s + b.rate30, 0) / badges.length);
  const fruitCount = badges.filter((b) => b.tier.tier === "fruit").length;
  const flowerCount = badges.filter((b) => b.tier.tier === "flower" || b.tier.tier === "fruit").length;
  const treeCount = badges.filter((b) => ["tree", "flower", "fruit"].includes(b.tier.tier)).length;

  if (avgRate >= 90 && fruitCount >= 3) return MASTER_BADGES[3]; // grand
  if (avgRate >= 80 && fruitCount >= 2) return MASTER_BADGES[2]; // gold
  if (avgRate >= 70 && flowerCount >= 1) return MASTER_BADGES[1]; // silver
  if (avgRate >= 60 && treeCount >= 1) return MASTER_BADGES[0]; // bronze
  return null;
}

// ── Pro Membership (unchanged) ─────────────────────────

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

export function getEarnedBadges(): BadgeType[] {
  const earned: BadgeType[] = [];
  const pro = getProStatus();
  if (pro.isPro) earned.push("pro");

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
}

export const PRO_FEATURES = {
  community: "커뮤니티 전체 기능 (글쓰기, 좋아요, 댓글)",
  profileCustom: "프로필 꾸미기 (아바타 프레임, 배경, 닉네임 색상)",
  advancedStats: "고급 통계 & AI 분석",
  cloudSync: "클라우드 동기화 & 백업",
  badges: "Pro 배지 & 활동 배지 표시",
} as const;
