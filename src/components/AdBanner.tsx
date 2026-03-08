import { Megaphone } from "lucide-react";

interface AdBannerProps {
  variant?: "inline" | "card";
  label?: string;
}

/**
 * Tasteful ad placeholder. Replace inner content with real ad SDK.
 * variant="inline" — slim horizontal banner between sections
 * variant="card" — larger card-style native ad
 */
export default function AdBanner({ variant = "inline", label = "광고" }: AdBannerProps) {
  if (variant === "card") {
    return (
      <div className="bg-gradient-to-r from-secondary to-muted rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Megaphone className="w-7 h-7 text-primary/40" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground/80 mb-0.5">나에게 맞는 추천</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              관심사 기반 맞춤 콘텐츠가 여기에 표시됩니다
            </p>
          </div>
        </div>
        <span className="absolute top-2 right-3 text-[9px] text-muted-foreground/50 font-medium">{label}</span>
      </div>
    );
  }

  return (
    <div className="bg-secondary/60 rounded-xl px-4 py-2.5 flex items-center gap-3 relative">
      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
        <Megaphone className="w-4 h-4 text-primary/30" />
      </div>
      <p className="text-xs text-muted-foreground flex-1">관심사 기반 맞춤 광고 영역</p>
      <span className="text-[9px] text-muted-foreground/40 font-medium">{label}</span>
    </div>
  );
}
