import { Home, BarChart3, CalendarDays, Compass, Plus } from "lucide-react";

export type TabType = "today" | "stats" | "calendar" | "discover";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAdd: () => void;
}

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: "today", label: "오늘", icon: Home },
  { id: "stats", label: "통계", icon: BarChart3 },
  { id: "calendar", label: "캘린더", icon: CalendarDays },
  { id: "discover", label: "추천", icon: Compass },
];

export default function BottomNav({ activeTab, onTabChange, onAdd }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Render FAB in center (3rd column)
          if (index === 2) {
            return (
              <>
                <button
                  key="fab"
                  onClick={onAdd}
                  className="flex items-center justify-center"
                >
                  <div className="w-12 h-12 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-90 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                </button>

                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {tab.label}
                  </span>
                  {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
                </button>
              </>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
