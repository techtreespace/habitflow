import { BadgeType, ALL_BADGES } from "@/lib/membership";

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
          isPro
            ? "bg-gradient-to-br from-accent to-accent/70 shadow-sm"
            : "bg-primary/10"
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

interface ProBadgeInlineProps {
  isPro: boolean;
}

/** Small inline Pro badge for next to usernames */
export function ProBadgeInline({ isPro }: ProBadgeInlineProps) {
  if (!isPro) return null;
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-bold">
      👑 PRO
    </span>
  );
}
