/**
 * Constants for parking recommendation system
 */

// Entrance coordinate constant - represents EntryGate position (left side of parking area)
export const ENTRANCE_COORDINATE = {
  x: 1, // EntryGate X coordinate (left side position)
  y: 4  // EntryGate Y coordinate (vertical center)
} as const;

// Gate position alias for clarity
export const GATE_POSITION = {
  x: 1, // EntryGate physical position
  y: 4  // EntryGate physical position
} as const;

// Parking slot coordinate grid (2x3 layout but only 5 slots used)
export const PARKING_GRID = {
  // Row 1 (y=2)
  slot1: { x: 2, y: 2 },
  slot2: { x: 6, y: 2 },
  slot3: { x: 10, y: 2 },

  // Row 2 (y=6)
  slot4: { x: 2, y: 6 },
  slot5: { x: 6, y: 6 }
} as const;

// Distance calculation unit (meters per grid unit)
export const GRID_UNIT_IN_METERS = 1;

// API response messages
export const RECOMMENDATION_MESSAGES = {
  NO_AVAILABLE_SLOTS: 'Tidak ada slot parkir tersedia',
  DATABASE_ERROR: 'Terjadi kesalahan database',
  INTERNAL_ERROR: 'Terjadi kesalahan internal server',
  SUCCESS: (slotNumber: number, distance: number) =>
    `Slot ${slotNumber} tersedia - ${distance}m dari pintu masuk`
} as const;