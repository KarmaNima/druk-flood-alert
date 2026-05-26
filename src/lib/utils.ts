import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColors(level: RiskLevel) {
  switch (level) {
    case "normal":
      return {
        text: "text-safe",
        bg: "bg-safe/10",
        border: "border-safe/30",
        dot: "bg-safe shadow-safe-glow",
        label: "AREA SAFE",
        sub: "Water level normal · No immediate threat",
      };
    case "warning":
      return {
        text: "text-warn",
        bg: "bg-warn/10",
        border: "border-warn/30",
        dot: "bg-warn shadow-warn-glow",
        label: "FLOOD WATCH",
        sub: "River levels rising · Stay alert",
      };
    case "danger":
      return {
        text: "text-danger",
        bg: "bg-danger/10",
        border: "border-danger/30",
        dot: "bg-danger shadow-danger-glow",
        label: "DANGER — EVACUATE",
        sub: "Immediate threat · Follow safe routes",
      };
  }
}

export function formatWaterPercent(level: number, max: number) {
  return Math.round((level / max) * 100);
}

export function getTimeString() {
  return new Date().toLocaleTimeString("en-BT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getDateString() {
  return new Date().toLocaleDateString("en-BT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
