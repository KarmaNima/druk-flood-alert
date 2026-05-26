"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import StatusBar from "@/components/ui/StatusBar";
import BottomNav from "@/components/ui/BottomNav";
import LocationModal from "@/components/ui/LocationModal";
import HomeScreen from "@/components/screens/HomeScreen";
import FloodScreen from "@/components/screens/FloodScreen";
import RouteScreen from "@/components/screens/RouteScreen";
import RescueScreen from "@/components/screens/RescueScreen";
import CommunityScreen from "@/components/screens/CommunityScreen";

const SCREENS = {
  home: HomeScreen,
  flood: FloodScreen,
  route: RouteScreen,
  rescue: RescueScreen,
  community: CommunityScreen,
};

export default function AppShell() {
  const { activeScreen } = useAppStore();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const ActiveScreen = SCREENS[activeScreen];

  return (
    <>
      <div className="flex flex-col h-dvh max-w-[430px] mx-auto bg-bg overflow-hidden">
        <StatusBar onLocationClick={() => setShowLocationModal(true)} />

        {/* Screen area — scrollable per screen */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              <ActiveScreen />
            </motion.div>
          </AnimatePresence>
        </div>

        <BottomNav />
      </div>

      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </>
  );
}
