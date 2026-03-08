import { Home, BarChart3, CalendarDays, Compass, Plus, User } from "lucide-react";

export type TabType = "today" | "stats" | "calendar" | "discover" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAdd: () => void;
}

const leftTabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: "today", label: "오늘", icon: Home },
  { id: "stats", label: "통계", icon: BarChart3 },
];

const rightTabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: "calendar", label: "캘린더", icon: CalendarDays },
  { id: "discover", label: "추천", icon: Compass },
];

function NavButton({ tab, isActive, onClick }: { tab: typeof leftTabs[0]; isActive: boolean; onClick: () => void }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
        {tab.label}
      </span>
      {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
    </button>
  );
}

export default function BottomNav({ activeTab, onTabChange, onAdd }: BottomNavProps) {
  const isProfileActive = activeTab === "profile";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16">
        {leftTabs.map((tab) => (
          <NavButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
        ))}

        {/* Center FAB */}
        <button onClick={onAdd} className="flex items-center justify-center">
          <div className="w-12 h-12 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-90 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
        </button>

        {rightTabs.map((tab) => (
          <NavButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
        ))}

        {/* Profile */}
        <button
          onClick={() => onTabChange("profile")}
          className="relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
        >
          <User className={`w-5 h-5 ${isProfileActive ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-[10px] font-medium ${isProfileActive ? "text-primary" : "text-muted-foreground"}`}>
            MY
          </span>
          {isProfileActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
        </button>
      </div>
    </div>
  );
}
