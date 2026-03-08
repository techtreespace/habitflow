export interface UserProfile {
  nickname: string;
  email: string;
  avatarEmoji: string;
  screenLockEnabled: boolean;
  screenLockPin: string;
}

const PROFILE_KEY = "habitflow_profile";
const LOCK_STATE_KEY = "habitflow_locked";

const DEFAULT_PROFILE: UserProfile = {
  nickname: "",
  email: "",
  avatarEmoji: "😊",
  screenLockEnabled: false,
  screenLockPin: "",
};

export function getProfile(): UserProfile {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isScreenLocked(): boolean {
  return localStorage.getItem(LOCK_STATE_KEY) === "true";
}

export function setScreenLocked(locked: boolean) {
  localStorage.setItem(LOCK_STATE_KEY, locked ? "true" : "false");
}

export const AVATAR_EMOJIS = [
  "😊", "😎", "🤓", "🦊", "🐱", "🐶", "🌸", "🌟", "🎯", "🔥", "🍀", "🦋",
];
