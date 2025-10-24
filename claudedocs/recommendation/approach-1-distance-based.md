# Approach 1: Distance-Based Parking Recommendation

## Overview

Sistem rekomendasi parkir sederhana berbasis perhitungan jarak Euclidean untuk menemukan slot parkir tersedia yang paling dekat dengan pintu masuk.

**Status**: Recommended untuk MVP
**Complexity**: Low
**Dependencies**: Zero external libraries
**Cost**: Free (pure algorithmic)

---

## 🎯 Core Concept

### Prinsip Dasar
Merekomendasikan slot parkir berdasarkan kriteria:
1. **Status**: Hanya slot dengan status `available`
2. **Distance**: Jarak terpendek dari pintu masuk ke slot
3. **Real-time**: Calculation setiap kali user request

### Mathematical Foundation

**Euclidean Distance Formula**:
```
d = √((x₂ - x₁)² + (y₂ - y₁)²)

Dimana:
- (x₁, y₁) = Koordinat entrance
- (x₂, y₂) = Koordinat parking slot
- d = Jarak dalam satuan unit (meter/grid units)
```

**Contoh Perhitungan**:
```
Entrance: (0, 0)
Slot 1: (2, 3)

Distance = √((2-0)² + (3-0)²)
         = √(4 + 9)
         = √13
         = 3.61 units
```

---

## 🏗️ Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  [Request Recommendation Button] → [Display Result]     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              API Endpoint: /api/recommend               │
│  GET request → Calculate distances → Return nearest     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│            Distance Calculation Engine                  │
│  1. Query available slots from Supabase                 │
│  2. Calculate distance untuk setiap slot                │
│  3. Sort ascending by distance                          │
│  4. Return top recommendation                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Database: parkingg                │
│  Columns: slot_number, status, coordinate_x, coordinate_y│
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User clicks "Cari Parkir Terdekat"
   ↓
2. Frontend calls GET /api/recommend
   ↓
3. API queries Supabase: SELECT * WHERE status='available'
   ↓
4. Calculate distance untuk setiap available slot
   ↓
5. Sort slots by distance (ascending)
   ↓
6. Return slot dengan distance terkecil
   ↓
7. Display recommendation: "Slot 3 - 5.2m dari entrance"
```

---

## 💾 Database Schema Enhancement

### Current Schema
```sql
CREATE TABLE parkingg (
  id SERIAL PRIMARY KEY,
  slot_number INTEGER,
  status VARCHAR(20),  -- 'available', 'occupied', 'maintenance'
  updated_at TIMESTAMP
);
```

### Enhanced Schema (Required)
```sql
ALTER TABLE parkingg
ADD COLUMN coordinate_x FLOAT,
ADD COLUMN coordinate_y FLOAT;

-- Optional: Pre-computed distance untuk optimization
ALTER TABLE parkingg
ADD COLUMN distance_from_entrance FLOAT;
```

### Coordinate System Setup

Anda perlu define coordinate system berdasarkan physical layout parkir Anda.

**Option 1: Linear Layout** (6 slots dalam 1 baris)
```
Entrance (0,0) ────────────────────────────────
              ↓
        [1]   [2]   [3]   [4]   [5]   [6]
       (2,0) (4,0) (6,0) (8,0) (10,0)(12,0)
```

**SQL Insert Example**:
```sql
UPDATE parkingg SET coordinate_x = 2, coordinate_y = 0 WHERE slot_number = 1;
UPDATE parkingg SET coordinate_x = 4, coordinate_y = 0 WHERE slot_number = 2;
UPDATE parkingg SET coordinate_x = 6, coordinate_y = 0 WHERE slot_number = 3;
UPDATE parkingg SET coordinate_x = 8, coordinate_y = 0 WHERE slot_number = 4;
UPDATE parkingg SET coordinate_x = 10, coordinate_y = 0 WHERE slot_number = 5;
UPDATE parkingg SET coordinate_x = 12, coordinate_y = 0 WHERE slot_number = 6;
```

**Option 2: Grid Layout** (2x3 grid)
```
Entrance (0,0)
     ↓
  [1]     [2]     [3]
 (2,2)   (6,2)   (10,2)

  [4]     [5]     [6]
 (2,6)   (6,6)   (10,6)
```

**SQL Insert Example**:
```sql
UPDATE parkingg SET coordinate_x = 2, coordinate_y = 2 WHERE slot_number = 1;
UPDATE parkingg SET coordinate_x = 6, coordinate_y = 2 WHERE slot_number = 2;
UPDATE parkingg SET coordinate_x = 10, coordinate_y = 2 WHERE slot_number = 3;
UPDATE parkingg SET coordinate_x = 2, coordinate_y = 6 WHERE slot_number = 4;
UPDATE parkingg SET coordinate_x = 6, coordinate_y = 6 WHERE slot_number = 5;
UPDATE parkingg SET coordinate_x = 10, coordinate_y = 6 WHERE slot_number = 6;
```

**Entrance Coordinate Constant**:
```typescript
// app/lib/constants.ts
export const ENTRANCE_COORDINATE = {
  x: 0,
  y: 0
};
```

---

## 💻 Implementation Code

### 1. Distance Calculation Utility

**File**: `app/lib/distance.ts`

```typescript
/**
 * Calculate Euclidean distance antara dua koordinat
 * @param x1 - X coordinate point 1
 * @param y1 - Y coordinate point 1
 * @param x2 - X coordinate point 2
 * @param y2 - Y coordinate point 2
 * @returns Distance dalam satuan yang sama dengan input coordinates
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
 * Calculate distance dari entrance ke parking slot
 * @param entranceX - Entrance X coordinate
 * @param entranceY - Entrance Y coordinate
 * @param slotX - Slot X coordinate
 * @param slotY - Slot Y coordinate
 * @returns Distance rounded ke 2 decimal places
 */
export function getSlotDistance(
  entranceX: number,
  entranceY: number,
  slotX: number,
  slotY: number
): number {
  const distance = calculateDistance(entranceX, entranceY, slotX, slotY);
  return Math.round(distance * 100) / 100; // Round to 2 decimals
}
```

### 2. TypeScript Types

**File**: `app/types/parking.ts`

```typescript
export interface ParkingSlot {
  id: number;
  slot_number: number;
  status: 'available' | 'occupied' | 'maintenance';
  coordinate_x: number;
  coordinate_y: number;
  updated_at: string;
}

export interface ParkingSlotWithDistance extends ParkingSlot {
  distance: number;
}

export interface RecommendationResponse {
  success: boolean;
  data?: {
    slot: ParkingSlotWithDistance;
    message: string;
  };
  error?: string;
}
```

### 3. API Route Implementation

**File**: `app/api/recommend/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSlotDistance } from '@/lib/distance';
import { ENTRANCE_COORDINATE } from '@/lib/constants';
import { ParkingSlot, ParkingSlotWithDistance, RecommendationResponse } from '@/types/parking';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 1. Query available parking slots
    const { data: availableSlots, error } = await supabase
      .from('parkingg')
      .select('*')
      .eq('status', 'available');

    if (error) {
      return NextResponse.json<RecommendationResponse>(
        { success: false, error: 'Database query failed' },
        { status: 500 }
      );
    }

    // 2. Check jika ada available slots
    if (!availableSlots || availableSlots.length === 0) {
      return NextResponse.json<RecommendationResponse>(
        { success: false, error: 'No available parking slots' },
        { status: 404 }
      );
    }

    // 3. Calculate distance untuk setiap slot
    const slotsWithDistance: ParkingSlotWithDistance[] = availableSlots.map(
      (slot: ParkingSlot) => ({
        ...slot,
        distance: getSlotDistance(
          ENTRANCE_COORDINATE.x,
          ENTRANCE_COORDINATE.y,
          slot.coordinate_x,
          slot.coordinate_y
        ),
      })
    );

    // 4. Sort by distance (ascending)
    slotsWithDistance.sort((a, b) => a.distance - b.distance);

    // 5. Get nearest slot (first element after sorting)
    const recommendedSlot = slotsWithDistance[0];

    // 6. Return recommendation
    return NextResponse.json<RecommendationResponse>({
      success: true,
      data: {
        slot: recommendedSlot,
        message: `Slot ${recommendedSlot.slot_number} tersedia - ${recommendedSlot.distance}m dari pintu masuk`,
      },
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json<RecommendationResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. Frontend Component

**File**: `app/components/ParkingRecommendation.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ParkingSlotWithDistance } from '@/types/parking';

export default function ParkingRecommendation() {
  const [recommendation, setRecommendation] = useState<ParkingSlotWithDistance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend');
      const data = await response.json();

      if (data.success) {
        setRecommendation(data.data.slot);
      } else {
        setError(data.error || 'Tidak ada slot tersedia');
      }
    } catch (err) {
      setError('Gagal mengambil rekomendasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Rekomendasi Parkir</h2>

      <button
        onClick={getRecommendation}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Mencari...' : 'Cari Parkir Terdekat'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="mt-4 p-6 bg-green-100 border-2 border-green-500 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-green-800">
                Slot {recommendation.slot_number}
              </h3>
              <p className="text-green-700">
                {recommendation.distance}m dari pintu masuk
              </p>
            </div>
            <div className="text-4xl">🅿️</div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Implementation Steps

### Phase 1: Database Setup
1. **Add coordinate columns** ke table `parkingg`
2. **Define physical layout** parkir Anda (linear/grid)
3. **Populate coordinates** untuk setiap slot berdasarkan physical layout
4. **Test queries** untuk memastikan data correct

### Phase 2: Backend Development
1. **Create utility functions** untuk distance calculation (`app/lib/distance.ts`)
2. **Define TypeScript types** (`app/types/parking.ts`)
3. **Create API endpoint** (`app/api/recommend/route.ts`)
4. **Test API** dengan Postman/Thunder Client

### Phase 3: Frontend Integration
1. **Create recommendation component** (`app/components/ParkingRecommendation.tsx`)
2. **Add component** ke main page
3. **Style component** sesuai design system
4. **Test user flow** end-to-end

### Phase 4: Testing & Optimization
1. **Test dengan berbagai scenarios**:
   - All slots available
   - Some slots occupied
   - No slots available
2. **Measure performance** (API response time)
3. **Add error handling** untuk edge cases
4. **Add loading states** untuk better UX

---

## 📊 Performance Characteristics

### Time Complexity
- **Query**: O(n) - Supabase query untuk available slots
- **Distance Calculation**: O(n) - Calculate untuk setiap slot
- **Sorting**: O(n log n) - JavaScript sort algorithm
- **Overall**: O(n log n) dimana n = jumlah available slots

### Actual Performance (6 Slots)
- **Database Query**: ~50-100ms (Supabase network latency)
- **Calculation + Sorting**: <1ms (negligible untuk 6 items)
- **Total API Response**: ~50-150ms (dominated by network)

### Scalability
- **Works well untuk**: 6-100 slots
- **Performance degradation**: Minimal sampai 1000+ slots
- **Bottleneck**: Supabase query, bukan calculation

---

## ✅ Advantages

1. **Zero Dependencies**: No external AI/ML libraries needed
2. **Fast**: Real-time calculation (<1ms untuk 6 slots)
3. **Deterministic**: Same input always gives same output
4. **Easy to Debug**: Simple logic, easy to trace issues
5. **Cost Efficient**: Zero additional costs beyond Supabase free tier
6. **Testable**: Easy to write unit tests untuk distance calculation
7. **Maintainable**: Simple code, easy untuk future developers

---

## ⚠️ Limitations

1. **Straight-Line Distance**: Tidak consider actual driving path
2. **No Obstacle Avoidance**: Assumes direct line-of-sight
3. **Single Entrance**: Designed untuk 1 entrance point (can be extended)
4. **No Personalization**: Tidak consider user preferences
5. **No Learning**: Tidak adapt dari user behavior
6. **Coordinate Accuracy**: Requires accurate physical layout mapping

---

## 🔄 When to Upgrade

### Upgrade to Approach 2 (Pathfinding) jika:
- Physical layout has obstacles (pillars, walls, barriers)
- One-way traffic flow rules exist
- Multiple entrance points dengan different optimal paths
- User feedback shows distance ≠ perceived convenience

### Upgrade to Approach 3 (AI-Enhanced) jika:
- Want personalized recommendations
- Have historical parking data untuk predictive analytics
- Need multi-factor optimization (distance + time + preferences)
- Want to predict future availability

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// app/lib/distance.test.ts
import { calculateDistance, getSlotDistance } from './distance';

describe('Distance Calculation', () => {
  test('calculates distance correctly', () => {
    expect(calculateDistance(0, 0, 3, 4)).toBe(5);
  });

  test('calculates distance with decimals', () => {
    expect(getSlotDistance(0, 0, 2, 3)).toBe(3.61);
  });

  test('handles same point', () => {
    expect(calculateDistance(5, 5, 5, 5)).toBe(0);
  });
});
```

### Integration Tests
```typescript
// Test API endpoint
describe('GET /api/recommend', () => {
  test('returns nearest available slot', async () => {
    const response = await fetch('/api/recommend');
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.slot).toHaveProperty('slot_number');
    expect(data.data.slot.distance).toBeGreaterThanOrEqual(0);
  });

  test('handles no available slots', async () => {
    // Set all slots to occupied in test database
    const response = await fetch('/api/recommend');
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('No available parking slots');
  });
});
```

### Manual Testing Checklist
- [ ] API returns correct nearest slot when multiple available
- [ ] API handles no available slots gracefully
- [ ] Frontend displays recommendation correctly
- [ ] Loading state shows during API call
- [ ] Error messages display properly
- [ ] Recommendation updates after slot status changes

---

## 📈 Future Enhancements

### Easy Improvements
1. **Multiple Entrances**: Support array of entrance coordinates
2. **Weighted Distance**: Consider slot size, accessibility features
3. **Real-time Updates**: Auto-refresh recommendation setiap polling cycle
4. **Visual Map**: Show recommended slot on parking lot map

### Medium Complexity
1. **Top N Recommendations**: Return 3 best options instead of 1
2. **Alternative Routes**: Consider different paths to same slot
3. **Time-based Optimization**: Factor in peak hours data

### Advanced Features
1. **Predictive Availability**: ML model untuk predict slot availability
2. **User Preferences**: Learn user parking habits
3. **Navigation Integration**: Turn-by-turn directions to slot

---

## 📚 References

- [Euclidean Distance Formula](https://en.wikipedia.org/wiki/Euclidean_distance)
- Research paper: "A Lightweight Deep Learning and Sorting-Based Smart Parking System" (2025)
- Next.js API Routes Documentation
- Supabase Query Documentation

---

**Document Version**: 1.0
**Last Updated**: 2025-10-18
**Author**: SuperClaude Framework
**Status**: Ready for Implementation
