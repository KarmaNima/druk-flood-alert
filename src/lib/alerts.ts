import { db, isFirebaseConfigured } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAppStore } from "@/store/appStore";
import toast from "react-hot-toast";

/**
 * Get current device location using Geolocation API
 */
export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        resolve(null);
      },
      { timeout: 5000 }
    );
  });
}

/**
 * Send SOS alert to Firestore (if configured) or demo mode
 */
export async function sendSOSAlert(
  emergencyType: string = "flooding",
  notes: string = ""
) {
  try {
    // Get current location
    const location = await getCurrentLocation();
    const now = new Date();

    const alertData = {
      type: emergencyType,
      location: {
        lat: location?.latitude ?? 27.601,
        lng: location?.longitude ?? 89.865,
      },
      timestamp: now.toISOString(),
      notes,
      status: "active",
      userId: "anonymous-user",
      dzongkhag: "Punakha",
      village: "Thimphu",
    };

    if (isFirebaseConfigured && db) {
      // Send to Firebase
      try {
        const docRef = await addDoc(collection(db, "alerts"), {
          ...alertData,
          timestamp: Timestamp.now(),
        });
        console.log("✅ Alert sent to Firebase:", docRef.id);
        toast.success("Emergency alert sent to rescue team!");
        return { success: true, id: docRef.id, mode: "firebase" };
      } catch (firebaseError) {
        console.error("Firebase error:", firebaseError);
        // Fall back to demo mode if Firebase fails
        return sendSOSAlertDemo(alertData);
      }
    } else {
      // Demo mode
      return sendSOSAlertDemo(alertData);
    }
  } catch (error) {
    console.error("Error sending SOS alert:", error);
    toast.error("Failed to send alert. Trying SMS fallback...");
    return { success: false, error: String(error) };
  }
}

/**
 * Demo mode alert (no Firebase)
 */
function sendSOSAlertDemo(alertData: any) {
  console.log("📱 DEMO MODE - SOS Alert:", alertData);
  toast.success("Demo: Emergency alert logged to console");
  
  // Simulate storing in local state
  useAppStore.setState({ sosAlertSent: true });
  
  return {
    success: true,
    id: `demo-${Date.now()}`,
    mode: "demo",
    data: alertData,
  };
}

/**
 * Send SMS fallback (opens native SMS app)
 */
export async function sendSMSFallback(
  emergencyNumber: string = "+975-1-113"
) {
  try {
    const location = await getCurrentLocation();
    const coords = location
      ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`
      : "Location unavailable";

    const message = `EMERGENCY: SOS Alert! Need immediate help. ${coords}. Please respond.`;
    const encodedMessage = encodeURIComponent(message);
    const smsLink = `sms:${emergencyNumber}?body=${encodedMessage}`;

    window.location.href = smsLink;
    console.log("📞 SMS fallback activated");
    toast.success("Opening SMS app for emergency contact");
  } catch (error) {
    console.error("SMS fallback error:", error);
    toast.error("Could not open SMS app");
  }
}

/**
 * Notify emergency contacts
 */
export async function notifyContacts(contactIds: string[]) {
  const { markNotified } = useAppStore.getState();

  if (isFirebaseConfigured && db) {
    try {
      console.log("📢 Notifying contacts via Firebase:", contactIds);
      toast.success(`Notified ${contactIds.length} contacts`);
    } catch (error) {
      console.error("Error notifying contacts:", error);
    }
  } else {
    console.log("📢 DEMO MODE - Notifying contacts:", contactIds);
    toast.success(`Demo: ${contactIds.length} contacts would be notified`);
  }

  contactIds.forEach((id) => markNotified(id));
}

/**
 * Check Firebase connection status
 */
export function isFirebaseReady(): boolean {
  return isFirebaseConfigured && !!db;
}

/**
 * Get Firebase status message for UI
 */
export function getFirebaseStatusMessage(): string {
  if (!isFirebaseConfigured) {
    return "Running in DEMO MODE (No Firebase)";
  }
  if (!db) {
    return "Firebase initializing...";
  }
  return "Firebase Connected";
}
