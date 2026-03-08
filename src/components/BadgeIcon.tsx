import { BadgeType, ALL_BADGES, HabitTierInfo, MasterBadgeInfo } from "@/lib/membership";

interface BadgeIconProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeMap = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function BadgeIcon({ type, size = "sm", showLabel = false }: BadgeIconProps) {
  const badge = ALL_BADGES.find((b) => b.type === type);
  if (!badge) return null;
  const isPro = type === "pro";

  return (
    <div className="flex items-center gap-1">
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center ${
          isPro ? "bg-gradient-to-br from-accent to-accent/70 shadow-sm" : "bg-primary/10"
        }`}
        title={badge.description}
      >
        {badge.emoji}
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${isPro ? "text-accent" : "text-muted-foreground"}`}>
          {badge.label}
        </span>
      )}
    </div>
  );
}

/** Small inline Pro badge */
export function ProBadgeInline({ isPro }: { isPro: boolean }) {
  if (!isPro) return null;
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-bold">
      👑 PRO
    </span>
  );
}

/** Per-habit tier badge - compact inline display */
export function HabitTierBadge({ tier, size = "sm" }: { tier: HabitTierInfo; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1";
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md bg-muted/60 ${sizeClass} font-medium ${tier.color}`}>
      {tier.emoji} {tier.label}
    </span>
  );
}

/** Master badge display */
export function MasterBadge({ badge }: { badge: MasterBadgeInfo }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-accent/15 to-primary/15 border border-accent/20">
      <span className="text-base">{badge.emoji}</span>
      <span className="text-xs font-bold text-accent">{badge.label}</span>
    </div>
  );
}
