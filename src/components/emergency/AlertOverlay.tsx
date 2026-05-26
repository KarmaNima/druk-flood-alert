"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheck, IconX, IconChevronDown } from "@tabler/icons-react";

interface AlertOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

const ITEMS = [
  "Family notified via SMS",
  "Rescue team alerted",
  "Volunteers informed",
  "Location broadcast active",
];

export default function AlertOverlay({ visible, onDismiss }: AlertOverlayProps) {
  const [expanded, setExpanded] = useState(true);
  const [shownItems, setShownItems] = useState<number>(0);

  // Show items only when expanded
  useEffect(() => {
    if (visible && expanded) {
      setShownItems(0);
      ITEMS.forEach((_, i) => {
        setTimeout(() => setShownItems(i + 1), 500 + i * 320);
      });
    }
  }, [visible, expanded]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay backdrop */}
          {expanded && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Alert card - PROPERLY CENTERED */}
          <motion.div
            className="fixed z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              expanded
                ? {
                    opacity: 1,
                    scale: 1,
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    x: "-50%",
                    y: "-50%",
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    top: "auto",
                    left: "auto",
                    right: "20px",
                    bottom: "120px",
                    x: 0,
                    y: 0,
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className={`rounded-2xl border border-border2 shadow-2xl ${
                expanded
                  ? "w-full max-w-sm bg-surface p-6 sm:p-8"
                  : "w-72 bg-card p-4"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header with toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-safe/10 border-2 border-safe flex items-center justify-center flex-shrink-0"
                    animate={expanded ? { scale: 1 } : { scale: 0.8 }}
                  >
                    <IconCheck size={20} className="text-safe" />
                  </motion.div>
                  <motion.h2
                    className="font-cond font-bold text-safe whitespace-nowrap"
                    animate={{ fontSize: expanded ? "18px" : "14px" }}
                  >
                    {expanded ? "Emergency Sent" : "SOS Active"}
                  </motion.h2>
                </div>

                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 hover:bg-card2 rounded-lg transition-colors flex-shrink-0"
                >
                  <motion.div
                    animate={{ rotate: expanded ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconChevronDown size={18} className="text-text2" />
                  </motion.div>
                </button>
              </div>

              {/* Content — only show when expanded */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="font-mono text-[11px] text-text3 mb-4 tracking-wider uppercase">
                      Sharing your location...
                    </p>

                    {/* Status items */}
                    <div className="space-y-2 mb-6">
                      {ITEMS.map((item, i) => (
                        <AnimatePresence key={i}>
                          {shownItems > i && (
                            <motion.div
                              className="flex items-start gap-2.5 text-sm text-text2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-safe flex-shrink-0 mt-1.5" />
                              <span className="text-[13px] leading-relaxed">{item}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}
                    </div>

                    {/* ETA block */}
                    <motion.div
                      className="w-full bg-safe/10 border border-safe/20 rounded-xl p-4 text-center mb-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      <div className="font-mono text-[36px] font-bold text-safe leading-none">
                        12
                      </div>
                      <div className="font-cond text-[11px] text-text3 tracking-[2px] uppercase mt-2">
                        Est. Response · Minutes
                      </div>
                    </motion.div>

                    <p className="font-cond text-[14px] text-text2 text-center mb-5 tracking-wide leading-relaxed">
                      Stay calm. Help is on the way.
                    </p>

                    {/* Dismiss button */}
                    <button
                      className="w-full px-4 py-3 bg-safe/10 hover:bg-safe/20 border border-safe rounded-lg text-safe font-cond text-[12px] tracking-[1.5px] uppercase transition-colors font-semibold"
                      onClick={onDismiss}
                    >
                      Dismiss & Continue
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed view — just shows live indicator */}
              {!expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2.5 h-2.5 bg-safe rounded-full flex-shrink-0"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="font-cond text-[12px] text-safe font-semibold">Live</span>
                  </div>
                  <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-card2 rounded transition-colors flex-shrink-0"
                  >
                    <IconX size={16} className="text-text3" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
