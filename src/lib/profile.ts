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
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function isScreenLocked(): boolean {
  try {
    return localStorage.getItem(LOCK_STATE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setScreenLocked(locked: boolean) {
  try {
    localStorage.setItem(LOCK_STATE_KEY, locked ? "true" : "false");
  } catch {
    // ignore
  }
}

export const AVATAR_EMOJIS = [
  "😊", "😎", "🤓", "🦊", "🐱", "🐶", "🌸", "🌟", "🎯", "🔥", "🍀", "🦋",
];
