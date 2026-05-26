"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconGps, IconX } from "@tabler/icons-react";
import { useAppStore } from "@/store/appStore";
import { getCurrentLocation } from "@/lib/alerts";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_LOCATIONS = [
  { name: "Punakha (Default)", lat: 27.601, lng: 89.865 },
  { name: "Thimphu", lat: 27.514, lng: 89.641 },
  { name: "Paro", lat: 27.405, lng: 89.393 },
  { name: "Wangdue Phodrang", lat: 27.628, lng: 90.329 },
  { name: "Trongsa", lat: 27.278, lng: 90.502 },
  { name: "Bumthang", lat: 27.516, lng: 90.722 },
];

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { setUserLocation, userLat, userLng } = useAppStore();
  const [lat, setLat] = useState(userLat.toString());
  const [lng, setLng] = useState(userLng.toString());
  const [loading, setLoading] = useState(false);

  async function handleGetCurrentLocation() {
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        setLat(coords.latitude.toFixed(6));
        setLng(coords.longitude.toFixed(6));
      } else {
        alert("Could not get location. Make sure location permission is enabled.");
      }
    } catch (err) {
      alert("Error getting location. Please enter coordinates manually.");
    }
    setLoading(false);
  }

  function handleSave() {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      alert("Invalid coordinates");
      return;
    }
    setUserLocation(parsedLat, parsedLng);
    onClose();
  }

  function selectPreset(preset: (typeof PRESET_LOCATIONS)[0]) {
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
    setUserLocation(preset.lat, preset.lng);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full bg-surface border-t border-border2 rounded-t-2xl pointer-events-auto max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface border-b border-border flex items-center justify-between px-5 py-4">
                <h3 className="font-cond font-bold text-[18px] tracking-wide uppercase">
                  Set Location
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-card rounded-lg transition-colors"
                >
                  <IconX size={20} className="text-text2" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Get current location */}
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={loading}
                  className="w-full bg-accent hover:bg-blue-600 disabled:opacity-60 text-white font-cond py-3 rounded-xl tracking-wide uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <IconGps size={18} />
                  {loading ? "Getting Location..." : "Use Current GPS"}
                </button>

                {/* Coordinate input */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-text3 tracking-widest uppercase">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step={0.000001}
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2 text-text font-mono text-sm focus:border-accent outline-none transition-colors"
                    placeholder="27.601"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-text3 tracking-widest uppercase">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step={0.000001}
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2 text-text font-mono text-sm focus:border-accent outline-none transition-colors"
                    placeholder="89.865"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-safe hover:bg-green-600 text-white font-cond py-3 rounded-xl tracking-wide uppercase transition-colors"
                >
                  Save Location
                </button>

                {/* Preset locations */}
                <div>
                  <p className="font-mono text-[10px] text-text3 tracking-widest uppercase mb-3">
                    Quick Select
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_LOCATIONS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        className="bg-card hover:bg-card2 border border-border hover:border-border2 rounded-xl px-3 py-2.5 text-center transition-colors"
                      >
                        <p className="font-cond text-[12px] font-semibold text-text">
                          {preset.name}
                        </p>
                        <p className="font-mono text-[9px] text-text3 mt-1">
                          {preset.lat.toFixed(3)}, {preset.lng.toFixed(3)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
