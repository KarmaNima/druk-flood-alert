"use client";

import { IconBuilding, IconSchool, IconShield } from "@tabler/icons-react";
import Map from "@/components/ui/Map";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const SHELTER_ICONS = [IconBuilding, IconSchool, IconShield];
const SHELTER_COLORS = ["bg-accent/15 text-blue-400", "bg-safe/12 text-green-400", "bg-warn/12 text-amber-400"];

export default function RouteScreen() {
  const { shelters, userLat, userLng } = useAppStore();

  const stats = [
    { label: "Distance", value: "1.2km", color: "text-safe" },
    { label: "Walk ETA", value: "18 min", color: "text-text" },
    { label: "Elevation", value: "+52m", color: "text-accent" },
  ];

  return (
    <div>
      <div className="px-5 pt-5 pb-4 border-b border-border mb-4">
        <h2 className="font-cond font-bold text-[22px] tracking-wide uppercase">Safe Route</h2>
        <p className="font-mono text-[11px] text-text2 mt-1">Nearest safe shelters · High ground</p>
      </div>

      {/* Real Google Maps */}
      <div className="px-5 mb-4">
        <Map
          center={{ lat: userLat, lng: userLng }}
          userLocation={[userLat, userLng]}
          shelters={shelters}
          zoom={13}
          height="h-[280px]"
          interactive={true}
        />
      </div>

      {/* Stats row */}
      <div className="px-5 mb-4 grid grid-cols-3 gap-2.5">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={cn("font-cond font-bold text-[18px]", color)}>{value}</p>
            <p className="font-mono text-[9px] text-text3 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Shelters */}
      <div className="px-5">
        <p className="font-mono text-[10px] text-text3 tracking-[2px] uppercase mb-3">Safe Shelters Nearby</p>
        <div className="flex flex-col gap-2">
          {shelters.map((shelter, i) => {
            const Icon = SHELTER_ICONS[i] ?? IconBuilding;
            const colorCls = SHELTER_COLORS[i] ?? SHELTER_COLORS[0];
            return (
              <div key={shelter.id} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", colorCls)}>
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cond font-semibold text-[14px] text-text">{shelter.name}</p>
                  <p className="text-[11px] text-text3 mt-0.5">
                    {shelter.distanceKm}km · +{shelter.elevationGain}m elevation · Cap: {shelter.capacity}
                    {shelter.hasMedical && " · Medical"}
                  </p>
                </div>
                {shelter.tag && (
                  <span className="font-mono text-[10px] text-safe shrink-0">{shelter.tag}</span>
                )}
                {!shelter.tag && (
                  <span className="font-mono text-[10px] text-text3 shrink-0">{shelter.distanceKm}km</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
