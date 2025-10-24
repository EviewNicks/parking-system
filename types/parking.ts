/**
 * TypeScript types for parking recommendation system
 */

// Enhanced parking slot interface with coordinates
export interface ParkingSlot {
  id: number;
  slot: number;
  status: "terisi" | "kosong" | "maintenance";
  coordinate_x: number;
  coordinate_y: number;
  jarak?: number; // Distance from ultrasonic sensor (existing field)
  created_at: string;
}

// Parking slot with calculated distance from entrance
export interface ParkingSlotWithDistance extends ParkingSlot {
  distance: number; // Calculated Euclidean distance from entrance
}

// API response types
export interface RecommendationResponse {
  success: boolean;
  data?: {
    slot: ParkingSlotWithDistance;
    message: string;
    alternatives?: ParkingSlotWithDistance[]; // Optional: other available slots
    total_available?: number; // Total available slots count
  };
  error?: string;
}

export interface UserPreferences {
  needs_ev_charging?: boolean;
  needs_disabled_access?: boolean;
  preferred_zone?: string;
  vehicle_size?: "small" | "medium" | "large";
}

// Error types for better error handling
export interface ParkingError {
  code:
    | "DATABASE_ERROR"
    | "NO_AVAILABLE_SLOTS"
    | "INTERNAL_ERROR"
    | "INVALID_COORDINATES";
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

// Utility type for API responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

// Coordinate type
export interface Coordinate {
  x: number;
  y: number;
}

// Parking layout information
export interface ParkingLayout {
  entrance: Coordinate;
  slots: Record<number, Coordinate>;
  grid_size: { rows: number; cols: number };
}

// Statistics interface for dashboard
export interface ParkingStatistics {
  total_slots: number;
  available_slots: number;
  occupied_slots: number;
  maintenance_slots: number;
  nearest_available_slot?: ParkingSlotWithDistance;
}

// Real-time update types
export interface ParkingUpdate {
  slot: ParkingSlot;
  timestamp: string;
  update_type: "status_change" | "coordinate_update";
}
