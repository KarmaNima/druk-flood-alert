"use client";

import { useState } from "react";
import { IconSend } from "@tabler/icons-react";
import { useAppStore } from "@/store/appStore";
import { sendSOSAlert } from "@/lib/alerts";
import toast from "react-hot-toast";

const EMERGENCY_TYPES = [
  { id: "flooding", label: "Flooding", emoji: "🌊", color: "border-safe" },
  {
    id: "trapped",
    label: "Trapped/Stuck",
    emoji: "🚨",
    color: "border-warn",
  },
  { id: "medical", label: "Medical Help", emoji: "🏥", color: "border-danger" },
  {
    id: "evacuation",
    label: "Evacuation",
    emoji: "🚁",
    color: "border-accent",
  },
  {
    id: "property",
    label: "Property Damage",
    emoji: "🏚️",
    color: "border-text2",
  },
];

export default function RescueScreen() {
  const { selectedEmergencyType, setSelectedEmergencyType, rescueNotes, setRescueNotes, userLat, userLng } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmergencyType) {
      toast.error("Please select emergency type");
      return;
    }

    setLoading(true);
    try {
      await sendSOSAlert(selectedEmergencyType, rescueNotes);
      setRescueNotes("");
      toast.success("Rescue request submitted!");
    } catch (error) {
      toast.error("Failed to submit request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="px-5 pt-5 pb-4 border-b border-border mb-4">
        <h2 className="font-cond font-bold text-[22px] tracking-wide uppercase">
          Request Help
        </h2>
        <p className="font-mono text-[11px] text-text2 mt-1">
          Choose emergency type and describe situation
        </p>
      </div>

      {/* Emergency Type Selector */}
      <div className="px-5 mb-6">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">
          What's the emergency?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {EMERGENCY_TYPES.map(({ id, label, emoji, color }) => (
            <button
              key={id}
              onClick={() => setSelectedEmergencyType(id as any)}
              className={`bg-card hover:bg-card2 border-2 rounded-xl p-4 text-center transition-all ${
                selectedEmergencyType === id
                  ? `border-safe bg-safe/5`
                  : `border-border ${color}`
              }`}
            >
              <p className="text-[28px] mb-2">{emoji}</p>
              <p className="font-cond font-semibold text-[13px] text-text">
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Field */}
      <div className="px-5 mb-6">
        <label className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-2 block">
          Additional Details (Optional)
        </label>
        <textarea
          value={rescueNotes}
          onChange={(e) => setRescueNotes(e.target.value)}
          placeholder="Describe the situation, number of people affected, etc..."
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text font-mono text-[13px] focus:border-safe outline-none transition-colors resize-none h-28"
        />
      </div>

      {/* Location Info */}
      <div className="px-5 mb-6">
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <p className="font-cond text-[12px] font-semibold text-accent mb-2">
            📍 Current Location
          </p>
          <p className="font-mono text-[11px] text-text2">
            Latitude: {userLat.toFixed(6)}
          </p>
          <p className="font-mono text-[11px] text-text2">
            Longitude: {userLng.toFixed(6)}
          </p>
          <p className="font-mono text-[10px] text-text3 mt-2">
            Location will be shared with rescue team
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-5">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-safe hover:bg-green-600 disabled:opacity-50 text-white font-cond py-3.5 rounded-xl tracking-wide uppercase flex items-center justify-center gap-2 transition-colors"
        >
          <IconSend size={18} />
          {loading ? "Submitting..." : "Submit Rescue Request"}
        </button>
        <p className="font-mono text-[10px] text-text3 text-center mt-3">
          Your location will be shared with rescue coordinators
        </p>
      </div>

      {/* Help Section */}
      <div className="px-5 mt-8 pb-4">
        <div className="bg-border/20 rounded-xl p-4">
          <p className="font-cond text-[12px] font-semibold text-text mb-2">
            📞 Emergency Contact
          </p>
          <p className="font-mono text-[11px] text-text2 mb-3">
            Rescue HQ: <span className="text-safe">+975-1-113</span>
          </p>
          <p className="font-mono text-[10px] text-text3">
            If SMS is unavailable, call or visit nearest police station
          </p>
        </div>
      </div>
    </div>
  );
}
