# Data Structure Optimization: 6-Slot Parking System

## Optimal JSON Payload Design

### API Response Structure (Optimized untuk bandwidth)
```json
{
  "slots": [
    { "n": 1, "s": "a", "t": 1699123456 },
    { "n": 2, "s": "o", "t": 1699123457 },
    { "n": 3, "s": "a", "t": 1699123458 },
    { "n": 4, "s": "m", "t": 1699123459 },
    { "n": 5, "s": "a", "t": 1699123460 },
    { "n": 6, "s": "o", "t": 1699123461 }
  ],
  "updated": 1699123461
}
```

### Reasoning untuk Short Keys:
- `n` = slot_number (1 char vs 11 chars = 90% reduction)
- `s` = status ('a'=available, 'o'=occupied, 'm'=maintenance)
- `t` = timestamp (Unix timestamp)

### Bandwidth Analysis:
```
Standard naming: ~180 bytes per response
Optimized naming: ~95 bytes per response
Bandwidth saved: 47% per request

Monthly impact (polling 30s):
- 51,840 requests × 85 bytes saved = 4.4MB saved/month
- Negligible untuk modern internet, significant untuk ESP32 data usage
```

## State Management Strategy

### Client-Side State Structure
```typescript
interface AppState {
  slots: ParkingSlot[];
  lastUpdate: Date;
  isLoading: boolean;
  error?: string;
}

// Normalisasi data untuk O(1) access
interface NormalizedSlots {
  byId: { [key: number]: ParkingSlot };
  allIds: number[];
}
```

### Update Strategy
```typescript
// Optimistic updates untuk better UX
const updateSlotStatus = async (slotNumber: number, status: string) => {
  // 1. Immediate UI update
  setSlots(prev => prev.map(slot =>
    slot.slot_number === slotNumber
      ? { ...slot, status, last_updated: new Date().toISOString() }
      : slot
  ));

  // 2. API call (dengan rollback pada failure)
  try {
    await api.updateSlot(slotNumber, status);
  } catch (error) {
    // Rollback optimistic update
    fetchLatestData();
  }
};
```

## Database Query Optimization

### Single Query Strategy
```sql
-- MVP: Simple select all (6 records = minimal overhead)
SELECT slot_number, status, last_updated
FROM parking_slots
ORDER BY slot_number;

-- Future optimization: Add indexing
CREATE INDEX idx_parking_slots_updated ON parking_slots(last_updated);
```