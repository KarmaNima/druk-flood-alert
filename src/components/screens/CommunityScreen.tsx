"use client";

import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const AVATAR_COLORS: Record<string, string> = {
  red: "bg-danger/12 text-red-400",
  blue: "bg-accent/12 text-blue-400",
  amber: "bg-warn/12 text-amber-400",
  green: "bg-safe/12 text-green-400",
};

export default function CommunityScreen() {
  const { contacts, volunteers, notifiedIds, markNotified } = useAppStore();

  function handleNotify(id: string, name: string) {
    if (notifiedIds.has(id)) return;
    markNotified(id);
    toast.success(`${name} notified`, { icon: "📲" });
    // In production: call Firebase Cloud Function to send push/SMS
  }

  return (
    <div>
      <div className="px-5 pt-5 pb-4 border-b border-border mb-4">
        <h2 className="font-cond font-bold text-[22px] tracking-wide uppercase">Community</h2>
        <p className="font-mono text-[11px] text-text2 mt-1">Emergency contacts · Volunteer network</p>
      </div>

      <div className="px-5">
        {/* Emergency contacts */}
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">Emergency Contacts</p>
        <div className="flex flex-col gap-2 mb-6">
          {contacts.map((contact) => {
            const notified = notifiedIds.has(contact.id);
            return (
              <div key={contact.id} className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-cond font-bold text-[14px] flex-shrink-0",
                  AVATAR_COLORS[contact.colorClass] ?? AVATAR_COLORS.blue
                )}>
                  {contact.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cond font-semibold text-[14px] text-text">{contact.name}</p>
                  <p className="text-[11px] text-text3 mt-0.5">{contact.role}</p>
                </div>
                <button
                  onClick={() => handleNotify(contact.id, contact.name)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg border font-cond text-[12px] font-semibold tracking-wide uppercase transition-all",
                    notified
                      ? "bg-safe/10 border-safe text-safe"
                      : "bg-transparent border-border2 text-text2 hover:bg-accent/10 hover:border-accent hover:text-blue-400"
                  )}
                >
                  {notified ? "Sent ✓" : "Notify"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-5" />

        {/* Volunteers */}
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">Nearby Volunteers</p>
        <div className="grid grid-cols-2 gap-2.5 pb-4">
          {volunteers.map((vol) => (
            <div key={vol.id} className="bg-card border border-border rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", vol.onDuty ? "bg-safe shadow-safe-glow" : "bg-text3")} />
                <span className={cn(
                  "font-mono text-[9px] tracking-widest uppercase",
                  vol.onDuty ? "text-safe" : "text-text3"
                )}>
                  {vol.onDuty ? "On Duty" : "Off Duty"}
                </span>
              </div>
              <p className="font-cond font-semibold text-[13px] text-text">{vol.name}</p>
              <p className="text-[11px] text-text3 mt-0.5">{vol.zone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
