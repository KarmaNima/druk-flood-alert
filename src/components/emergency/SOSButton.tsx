"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SOSButtonProps {
  onActivate: () => void;
}

const HOLD_MS = 3000;
const CIRCUMFERENCE = 535;

export default function SOSButton({ onActivate }: SOSButtonProps) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [hint, setHint] = useState("PRESS & HOLD 3 SECONDS");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const startHold = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setHolding(true);
    setHint("KEEP HOLDING...");
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const p = Math.min((Date.now() - startRef.current) / HOLD_MS, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(intervalRef.current!);
        setHolding(false);
        setProgress(0);
        setHint("PRESS & HOLD 3 SECONDS");
        onActivate();
      }
    }, 30);
  }, [onActivate]);

  const cancelHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHolding(false);
    setProgress(0);
    setHint("PRESS & HOLD 3 SECONDS");
  }, []);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4 py-5">
      {/* Outer pulsing rings */}
      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        <AnimatePresence>
          {!holding && (
            <>
              <motion.div
                className="absolute inset-[-16px] rounded-full bg-danger/10"
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-[-8px] rounded-full bg-danger/8"
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* SVG ring progress */}
        <svg
          className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90"
          viewBox="0 0 172 172"
        >
          <circle className="fill-none stroke-danger/15" strokeWidth={3} cx={86} cy={86} r={84} />
          <circle
            className="fill-none stroke-danger"
            strokeWidth={3}
            strokeLinecap="round"
            cx={86}
            cy={86}
            r={84}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              filter: "drop-shadow(0 0 4px #ef4444)",
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>

        {/* Main button */}
        <motion.button
          className="w-[160px] h-[160px] rounded-full flex flex-col items-center justify-center gap-1 z-10 select-none touch-none"
          style={{
            background: "radial-gradient(circle at 40% 35%, #7f1d1d, #450a0a)",
            boxShadow: holding
              ? "0 0 60px rgba(239,68,68,0.5), 0 0 100px rgba(239,68,68,0.2), inset 0 2px 4px rgba(0,0,0,0.5)"
              : "0 0 40px rgba(239,68,68,0.3), 0 0 80px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          animate={{ scale: holding ? 0.96 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
        >
          <span
            className="font-cond font-black text-[42px] tracking-[4px] leading-none text-red-300"
            style={{ textShadow: "0 0 20px rgba(239,68,68,0.8)" }}
          >
            SOS
          </span>
          <span className="font-mono text-[9px] text-red-300/60 tracking-[2px] uppercase">
            Hold to Activate
          </span>
        </motion.button>
      </div>

      <p className="font-mono text-[10px] text-text3 tracking-[1.5px] uppercase">{hint}</p>
    </div>
  );
}
