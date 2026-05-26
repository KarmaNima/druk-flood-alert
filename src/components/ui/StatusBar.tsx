"use client";

import { useState, useEffect } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { getTimeString } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

interface StatusBarProps {
  onLocationClick?: () => void;
}

export default function StatusBar({ onLocationClick }: StatusBarProps) {
  const [time, setTime] = useState("--:--");
  const { districtRisk, userLat, userLng } = useAppStore();

  useEffect(() => {
    setTime(getTimeString());
    const interval = setInterval(() => setTime(getTimeString()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const dotColor =
    districtRisk === "normal"
      ? "bg-safe shadow-safe-glow"
      : districtRisk === "warning"
      ? "bg-warn shadow-warn-glow"
      : "bg-danger shadow-danger-glow";

  return (
    <div className="h-11 bg-surface border-b border-border flex items-center justify-between px-5 flex-shrink-0 z-10">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-cond font-bold text-[13px] tracking-[2px] uppercase text-text2">
          Druk Flood Alert
        </span>
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      </div>
      
      {/* Location button */}
      <button
        onClick={onLocationClick}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-card hover:bg-card2 rounded-lg transition-colors mr-3"
        title="Change location"
      >
        <IconMapPin size={14} className="text-accent" />
        <span className="font-mono text-[9px] text-text2">
          {userLat.toFixed(3)}, {userLng.toFixed(3)}
        </span>
      </button>

      <span className="font-mono text-[10px] text-text2">{time}</span>
    </div>
  );
}
