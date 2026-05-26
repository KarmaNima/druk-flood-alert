"use client";

import { useState, useEffect } from "react";
import { IconFlood, IconAlertTriangle } from "@tabler/icons-react";
import SOSButton from "@/components/emergency/SOSButton";
import AlertOverlay from "@/components/emergency/AlertOverlay";
import { useAppStore } from "@/store/appStore";
import { getFirebaseStatusMessage, sendSOSAlert } from "@/lib/alerts";

export default function HomeScreen() {
  const { sosAlertSent, setSosAlertSent } = useAppStore();
  const [firebaseStatus, setFirebaseStatus] = useState("");

  useEffect(() => {
    setFirebaseStatus(getFirebaseStatusMessage());
  }, []);

  const handleSOSActivate = async () => {
    setSosAlertSent(true);
    await sendSOSAlert("flooding", "");
  };

  const stats = [
    { label: "Rivers Monitored", value: "3", icon: "🌊" },
    { label: "Volunteers Active", value: "12", icon: "👥" },
    { label: "Shelters Ready", value: "8", icon: "🏠" },
  ];

  const actions = [
    { label: "View Safe Route", emoji: "🗺️", key: "route" },
    { label: "Find Shelter", emoji: "🏃", key: "shelter" },
    { label: "View Alerts", emoji: "🔔", key: "alerts" },
  ];

  return (
    <div className="pb-24">
      {/* Status Banner */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <h1 className="font-cond font-bold text-[28px] tracking-wide uppercase text-text">
          Druk Flood Alert
        </h1>
        <p className="font-mono text-[10px] text-text3 mt-2 tracking-widest uppercase">
          {firebaseStatus}
        </p>
        {firebaseStatus.includes("DEMO") && (
          <p className="font-mono text-[10px] text-warn/80 mt-1">
            📌 Add Firebase credentials to .env.local for live features
          </p>
        )}
      </div>

      {/* Risk Status */}
      <div className="px-5 pt-4 pb-3">
        <div className="bg-gradient-to-r from-safe/10 to-safe/5 border border-safe/20 rounded-xl p-4 flex items-start gap-3">
          <IconFlood className="text-safe flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-cond font-bold text-safe text-[14px] tracking-wide">
              Current Risk: NORMAL
            </p>
            <p className="font-mono text-[11px] text-text2 mt-1">
              All rivers within safe levels • No evacuation needed
            </p>
          </div>
        </div>
      </div>

      {/* SOS Button Section */}
      <div className="px-5 py-6 border-b border-border">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-4">
          Emergency Response
        </p>
        <SOSButton onActivate={handleSOSActivate} />
        <p className="font-mono text-[10px] text-text3 mt-3 text-center">
          Hold for 3 seconds to trigger emergency response
        </p>
      </div>

      {/* Stats Grid */}
      <div className="px-5 py-5 border-b border-border">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">
          Current Status
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {stats.map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-3 text-center hover:bg-card2 transition-colors"
            >
              <p className="text-[20px] mb-1">{icon}</p>
              <p className="font-cond font-bold text-[18px] text-text">{value}</p>
              <p className="font-mono text-[9px] text-text3 uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-5 border-b border-border">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">
          Quick Actions
        </p>
        <div className="space-y-2">
          {actions.map(({ label, emoji, key }) => (
            <button
              key={key}
              className="w-full bg-card hover:bg-card2 border border-border rounded-lg px-4 py-3 flex items-center gap-3 transition-colors group"
            >
              <span className="text-[18px]">{emoji}</span>
              <span className="font-cond font-semibold text-[14px] text-text flex-1 text-left">
                {label}
              </span>
              <span className="text-text3 group-hover:text-text transition-colors">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alert Overlay */}
      <AlertOverlay
        visible={sosAlertSent}
        onDismiss={() => setSosAlertSent(false)}
      />

      {/* Info Box */}
      <div className="px-5 py-5">
        <div className="bg-border/30 rounded-xl p-4 flex gap-3">
          <IconAlertTriangle className="text-text2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-cond text-[12px] font-semibold text-text mb-1">
              How to Use
            </p>
            <p className="font-mono text-[11px] text-text2 leading-relaxed">
              1. Check current risk status above<br />
              2. Hold SOS button in emergency<br />
              3. Use location picker to set position<br />
              4. View safe routes and shelters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
