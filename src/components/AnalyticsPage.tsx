import { useState } from "react";
import { motion } from "framer-motion";
import StatsPage from "./StatsPage";
import CalendarPage from "./CalendarPage";

type SubTab = "stats" | "calendar";

interface AnalyticsPageProps {
  refreshKey: number;
}

export default function AnalyticsPage({ refreshKey }: AnalyticsPageProps) {
  const [subTab, setSubTab] = useState<SubTab>("stats");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">분석</h2>

      {/* Sub-tab switcher */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
        {([
          { id: "stats" as SubTab, label: "통계" },
          { id: "calendar" as SubTab, label: "캘린더" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              subTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={subTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {subTab === "stats" ? (
          <StatsPage refreshKey={refreshKey} />
        ) : (
          <CalendarPage refreshKey={refreshKey} />
        )}
      </motion.div>
    </div>
  );
}
