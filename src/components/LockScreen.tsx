import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { getProfile, setScreenLocked } from "@/lib/profile";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const profile = getProfile();

  const handleSubmit = () => {
    if (pin === profile.screenLockPin) {
      setScreenLocked(false);
      onUnlock();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length >= 6) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === profile.screenLockPin.length) {
      setTimeout(() => {
        if (newPin === profile.screenLockPin) {
          setScreenLocked(false);
          onUnlock();
        } else {
          setError(true);
          setPin("");
          setTimeout(() => setError(false), 1000);
        }
      }, 100);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Lock className="w-10 h-10 text-primary mb-4" />
      <h2 className="text-xl font-bold mb-2">잠금 해제</h2>
      <p className="text-sm text-muted-foreground mb-8">PIN을 입력하세요</p>

      {/* PIN dots */}
      <div className="flex gap-3 mb-10">
        {Array.from({ length: getProfile().screenLockPin.length }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors ${
              i < pin.length
                ? error
                  ? "bg-destructive"
                  : "bg-primary"
                : "bg-muted"
            }`}
            animate={error ? { x: [0, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map((key) => {
          if (key === "") return <div key="empty" />;
          return (
            <button
              key={key}
              onClick={() => (key === "←" ? handleDelete() : handleKeyPress(key))}
              className="h-14 rounded-2xl bg-card text-lg font-semibold shadow-sm active:bg-muted transition-colors"
            >
              {key}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
