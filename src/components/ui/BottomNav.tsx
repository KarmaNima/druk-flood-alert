"use client";

import { motion } from "framer-motion";
import {
  IconHome,
  IconFlood,
  IconRoute,
  IconAmbulance,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import type { ScreenName } from "@/types";

const NAV_ITEMS: { id: ScreenName; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: "home", label: "Home", Icon: IconHome },
  { id: "flood", label: "Flood", Icon: IconFlood },
  { id: "route", label: "Route", Icon: IconRoute },
  { id: "rescue", label: "Rescue", Icon: IconAmbulance },
  { id: "community", label: "Community", Icon: IconUsers },
];

export default function BottomNav() {
  const { activeScreen, setActiveScreen } = useAppStore();

  return (
    <nav className="h-[68px] bg-surface border-t border-border2 flex items-stretch z-20 flex-shrink-0">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activeScreen === id;
        return (
          <button
            key={id}
            onClick={() => setActiveScreen(id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors duration-150",
              active ? "text-text" : "text-text3"
            )}
          >
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-accent rounded-b"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <Icon size={20} />
            <span className="font-cond text-[10px] font-semibold tracking-widest uppercase">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
