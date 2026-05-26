"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").then(
        (reg) => console.log("[SW] Registered:", reg.scope),
        (err) => console.error("[SW] Registration failed:", err)
      );
    }
  }, []);
  return null;
}
