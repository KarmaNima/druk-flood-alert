import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ScreenName,
  RiskLevel,
  EmergencyType,
  RiverStatus,
  FloodAlert,
  Shelter,
  EmergencyContact,
  Volunteer,
} from "@/types";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_RIVERS: RiverStatus[] = [
  { name: "Punakha Tsangchu", level: 2.4, maxLevel: 5.0, rainfall: 18, riskLevel: "normal", updatedAt: "14:32" },
  { name: "Mo Chhu", level: 3.1, maxLevel: 5.0, rainfall: 42, riskLevel: "warning", updatedAt: "14:28" },
  { name: "Pho Chhu", level: 1.8, maxLevel: 5.0, rainfall: 11, riskLevel: "normal", updatedAt: "14:30" },
];

const MOCK_FLOOD_ALERTS: FloodAlert[] = [
  { id: "1", message: "Mo Chhu water levels rising. Monitoring in progress. No evacuation needed yet.", severity: "warning", timestamp: "14:20", source: "NCHM" },
  { id: "2", message: "Heavy rainfall forecast tonight in Punakha valley. Residents near river banks advised to stay alert.", severity: "warning", timestamp: "11:45", source: "NCHM" },
  { id: "3", message: "All clear for Wangdue Phodrang. Road access restored on Highway 1.", severity: "normal", timestamp: "08:00", source: "MoIC" },
  { id: "4", message: "Glacial lake outburst watch lifted for Lunana. Situation stable.", severity: "normal", timestamp: "Yesterday", source: "DGNFM" },
];

const MOCK_SHELTERS: Shelter[] = [
  { id: "1", name: "Punakha Dzong", lat: 27.612, lng: 89.879, distanceKm: 1.2, walkMinutes: 18, elevationGain: 52, capacity: 500, hasMedical: false, tag: "CLOSEST" },
  { id: "2", name: "Punakha High School", lat: 27.608, lng: 89.870, distanceKm: 1.8, walkMinutes: 26, elevationGain: 38, capacity: 300, hasMedical: false },
  { id: "3", name: "Wangdue Army Camp", lat: 27.620, lng: 89.890, distanceKm: 2.4, walkMinutes: 34, elevationGain: 71, capacity: 800, hasMedical: true },
];

const MOCK_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Rescue HQ", role: "Punakha District · 24/7 Active", phone: "+975-1-113", initials: "RH", colorClass: "red" },
  { id: "2", name: "Dawa (Father)", role: "Family · +975 17 XXXXXX", phone: "+97517000001", initials: "DW", colorClass: "blue" },
  { id: "3", name: "Sonam (Mother)", role: "Family · +975 17 XXXXXX", phone: "+97517000002", initials: "SM", colorClass: "amber" },
  { id: "4", name: "Volunteer Team A", role: "3 members · Punakha Zone", phone: "+97517000003", initials: "VT", colorClass: "green" },
];

const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: "1", name: "Tenzin W.", zone: "Punakha Central", onDuty: true },
  { id: "2", name: "Karma D.", zone: "Khuruthang", onDuty: true },
  { id: "3", name: "Pema L.", zone: "Wangdue East", onDuty: false },
  { id: "4", name: "Ugyen T.", zone: "Lobeysa", onDuty: true },
];

// ─── Store State ──────────────────────────────────────────────────────────────
interface AppState {
  // Navigation
  activeScreen: ScreenName;
  setActiveScreen: (screen: ScreenName) => void;

  // SOS
  sosActive: boolean;
  sosAlertSent: boolean;
  setSosAlertSent: (val: boolean) => void;
  resetSos: () => void;

  // Area info
  areaName: string;
  districtRisk: RiskLevel;

  // Flood data
  rivers: RiverStatus[];
  floodAlerts: FloodAlert[];

  // Route — user location is customizable
  shelters: Shelter[];
  userLat: number;
  userLng: number;
  setUserLocation: (lat: number, lng: number) => void;

  // Rescue
  selectedEmergencyType: EmergencyType;
  rescueNotes: string;
  setSelectedEmergencyType: (t: EmergencyType) => void;
  setRescueNotes: (n: string) => void;

  // Community
  contacts: EmergencyContact[];
  volunteers: Volunteer[];
  notifiedIds: Set<string>;
  markNotified: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeScreen: "home",
      setActiveScreen: (screen) => set({ activeScreen: screen }),

      sosActive: false,
      sosAlertSent: false,
      setSosAlertSent: (val) => set({ sosAlertSent: val }),
      resetSos: () => set({ sosActive: false, sosAlertSent: false }),

      areaName: "Punakha / Wangdue",
      districtRisk: "normal",

      rivers: MOCK_RIVERS,
      floodAlerts: MOCK_FLOOD_ALERTS,

      shelters: MOCK_SHELTERS,
      userLat: 27.601,
      userLng: 89.865,
      setUserLocation: (lat, lng) => set({ userLat: lat, userLng: lng }),

      selectedEmergencyType: "flooding",
      rescueNotes: "",
      setSelectedEmergencyType: (t) => set({ selectedEmergencyType: t }),
      setRescueNotes: (n) => set({ rescueNotes: n }),

      contacts: MOCK_CONTACTS,
      volunteers: MOCK_VOLUNTEERS,
      notifiedIds: new Set(),
      markNotified: (id) =>
        set((state) => ({ notifiedIds: new Set([...state.notifiedIds, id]) })),
    }),
    {
      name: "druk-flood-alert-store",
      partialize: (state) => ({
        areaName: state.areaName,
        selectedEmergencyType: state.selectedEmergencyType,
        userLat: state.userLat,
        userLng: state.userLng,
      }),
    }
  )
);
