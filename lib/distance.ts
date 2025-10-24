/**
 * Distance calculation utilities for parking recommendation system
 */

/**
 * Calculate Euclidean distance between two coordinates
 * @param x1 - X coordinate of point 1
 * @param y1 - Y coordinate of point 1
 * @param x2 - X coordinate of point 2
 * @param y2 - Y coordinate of point 2
 * @returns Distance in the same units as input coordinates
 */
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance from entrance to parking slot
 * @param entranceX - Entrance X coordinate
 * @param entranceY - Entrance Y coordinate
 * @param slotX - Slot X coordinate
 * @param slotY - Slot Y coordinate
 * @returns Distance rounded to 2 decimal places
 */
export function getSlotDistance(
  entranceX: number,
  entranceY: number,
  slotX: number,
  slotY: number
): number {
  const distance = calculateDistance(entranceX, entranceY, slotX, slotY);
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate distance using entrance coordinate constant
 * @param slotX - Slot X coordinate
 * @param slotY - Slot Y coordinate
 * @returns Distance rounded to 2 decimal places
 */
export function getDistanceFromEntrance(
  slotX: number,
  slotY: number
): number {
  // Import entrance coordinate to avoid circular dependency
  const entranceX = 0; // From ENTRANCE_COORDINATE
  const entranceY = 0; // From ENTRANCE_COORDINATE

  return getSlotDistance(entranceX, entranceY, slotX, slotY);
}

/**
 * Sort parking slots by distance from entrance (ascending)
 * @param slots - Array of parking slots with distance property
 * @returns Sorted array by distance (nearest first)
 */
export function sortByDistance<T extends { distance: number }>(
  slots: T[]
): T[] {
  return [...slots].sort((a, b) => a.distance - b.distance);
}

/**
 * Validate coordinate values
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns True if coordinates are valid
 */
export function isValidCoordinate(x: number, y: number): boolean {
  return typeof x === 'number' && typeof y === 'number' &&
         !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
}

/**
 * Calculate distances for multiple slots and return with distance added
 * @param slots - Array of slots with coordinates
 * @param entranceX - Entrance X coordinate
 * @param entranceY - Entrance Y coordinate
 * @returns Array of slots with calculated distances
 */
export function calculateDistancesForSlots<T extends {
  coordinate_x: number;
  coordinate_y: number;
}>(
  slots: T[],
  entranceX: number,
  entranceY: number
): (T & { distance: number })[] {
  return slots.map(slot => {
    if (!isValidCoordinate(slot.coordinate_x, slot.coordinate_y)) {
      console.warn(`Invalid coordinates for slot:`, slot);
      return { ...slot, distance: Infinity };
    }

    const distance = getSlotDistance(
      entranceX,
      entranceY,
      slot.coordinate_x,
      slot.coordinate_y
    );

    return { ...slot, distance };
  });
}