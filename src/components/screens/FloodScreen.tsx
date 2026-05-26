"use client";

import { motion } from "framer-motion";
import { IconFlood, IconCloudRain, IconChecks, IconAlertTriangle, IconAlertCircle } from "@tabler/icons-react";
import { useAppStore } from "@/store/appStore";
import { cn, formatWaterPercent } from "@/lib/utils";
import type { RiskLevel } from "@/types";

function riskColor(level: RiskLevel) {
  if (level === "normal") return { text: "text-safe", bar: "from-green-800 to-safe" };
  if (level === "warning") return { text: "text-warn", bar: "from-amber-800 to-warn" };
  return { text: "text-danger", bar: "from-red-900 to-danger" };
}

export default function FloodScreen() {
  const { rivers, floodAlerts } = useAppStore();
  const overallRisk: RiskLevel = rivers.some((r) => r.riskLevel === "danger")
    ? "danger"
    : rivers.some((r) => r.riskLevel === "warning")
    ? "warning"
    : "normal";
  const mainRiver = rivers[0];
  const pct = formatWaterPercent(mainRiver.level, mainRiver.maxLevel);

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border mb-4">
        <h2 className="font-cond font-bold text-[22px] tracking-wide uppercase">Flood Monitor</h2>
        <p className="font-mono text-[11px] text-text2 mt-1">Last updated: 14:32 BT · Auto-refresh 5 min</p>
      </div>

      {/* Overall risk banner */}
      <div className={cn("mx-5 mb-4 px-4 py-3 rounded-xl border flex items-center justify-between",
        overallRisk === "normal" ? "bg-safe/10 border-safe/30" : "bg-warn/10 border-warn/30"
      )}>
        <div>
          <p className={cn("font-cond font-bold text-[16px] tracking-[2px] uppercase",
            overallRisk === "normal" ? "text-safe" : "text-warn"
          )}>
            {overallRisk === "normal" ? "Normal" : "Watch Active"}
          </p>
          <p className="text-[11px] text-text3 mt-0.5">
            {overallRisk === "normal" ? "No immediate flood risk" : "Monitor conditions closely"}
          </p>
        </div>
        {overallRisk === "normal" ? (
          <IconChecks size={24} className="text-safe" />
        ) : (
          <IconAlertTriangle size={24} className="text-warn" />
        )}
      </div>

      {/* Water level viz */}
      <div className="mx-5 mb-4 bg-card border border-border rounded-xl p-4">
        <p className="font-mono text-[10px] text-text3 tracking-widest uppercase mb-2.5">
          {mainRiver.name} — Water Level
        </p>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1.5">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", riskColor(mainRiver.riskLevel).bar)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-text3">
          <span>0m</span>
          <span className={riskColor(mainRiver.riskLevel).text}>{mainRiver.level}m current</span>
          <span>3.5m warn</span>
          <span>{mainRiver.maxLevel}m max</span>
        </div>
      </div>

      {/* River cards */}
      <div className="px-5 flex flex-col gap-2.5 mb-5">
        {rivers.map((river) => {
          const c = riskColor(river.riskLevel);
          return (
            <div key={river.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <IconFlood size={14} className={c.text} />
                <p className="font-cond font-bold text-[15px] tracking-wide">{river.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Level", value: `${river.level}m`, color: c.text },
                  { label: "Rainfall", value: `${river.rainfall}mm`, color: "text-text" },
                  { label: "Status", value: river.riskLevel.charAt(0).toUpperCase() + river.riskLevel.slice(1), color: c.text },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="font-mono text-[9px] text-text3 tracking-widest uppercase mb-0.5">{label}</p>
                    <p className={cn("font-cond font-semibold text-[16px]", color)}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert feed */}
      <div className="px-5 mb-2">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">Recent Alerts</p>
        <div className="flex flex-col">
          {floodAlerts.map((alert, i) => (
            <div key={alert.id} className={cn("flex items-start gap-3 py-3", i < floodAlerts.length - 1 && "border-b border-border")}>
              <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                alert.severity === "warning" ? "bg-warn/12 text-amber-400" : "bg-safe/12 text-green-400"
              )}>
                {alert.severity === "warning"
                  ? <IconAlertTriangle size={14} />
                  : <IconChecks size={14} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-text2 leading-snug">{alert.message}</p>
                <p className="font-mono text-[10px] text-text3 mt-1">{alert.source}</p>
              </div>
              <span className="font-mono text-[10px] text-text3 flex-shrink-0">{alert.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
