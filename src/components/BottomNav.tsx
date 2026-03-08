import { motion } from "framer-motion";
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
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 h-16">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Insert FAB after second tab
          if (index === 2) {
            return (
              <div key="fab-group" className="contents">
                {/* FAB */}
                <motion.button
                  onClick={onAdd}
                  className="w-12 h-12 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-6 h-6" />
                </motion.button>

                {/* This tab */}
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 transition-colors"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-3 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
