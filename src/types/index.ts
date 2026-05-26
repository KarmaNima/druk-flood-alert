// ─── Screen Navigation ───────────────────────────────────────────────────────
export type ScreenName = "home" | "flood" | "route" | "rescue" | "community";

// ─── Risk / Alert Levels ─────────────────────────────────────────────────────
export type RiskLevel = "normal" | "warning" | "danger";

// ─── Emergency Types ─────────────────────────────────────────────────────────
export type EmergencyType =
  | "flooding"
  | "trapped"
  | "medical"
  | "evacuation"
  | "property";

// ─── SOS Alert ───────────────────────────────────────────────────────────────
export interface SOSAlert {
  id: string;
  userId: string;
  type: EmergencyType;
  location: { lat: number; lng: number };
  timestamp: number;
  status: "active" | "acknowledged" | "resolved";
  notes?: string;
}

// ─── Flood Data ───────────────────────────────────────────────────────────────
export interface RiverStatus {
  name: string;
  level: number;       // meters
  maxLevel: number;
  rainfall: number;    // mm / 24h
  riskLevel: RiskLevel;
  updatedAt: string;
}

export interface FloodAlert {
  id: string;
  message: string;
  severity: RiskLevel;
  timestamp: string;
  source: string;
}

// ─── Shelter / Route ─────────────────────────────────────────────────────────
export interface Shelter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  walkMinutes: number;
  elevationGain: number;
  capacity: number;
  hasMedical: boolean;
  tag?: string;
}

// ─── Community ───────────────────────────────────────────────────────────────
export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  initials: string;
  colorClass: string;
}

export interface Volunteer {
  id: string;
  name: string;
  zone: string;
  onDuty: boolean;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  village: string;
  dzongkhag: string;
  emergencyContacts: string[];
}
