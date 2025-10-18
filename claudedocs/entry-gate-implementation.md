# Implementasi Entry Gate dengan Sensor Ultrasonic

## Overview
Dokumentasi implementasi pintu masuk (entry gate) dengan sensor ultrasonic untuk mendeteksi keberadaan mobil di palang pintu parking system.

## Arsitektur Komponen

### 1. Database Schema

#### Tabel: `entry_gate`
```sql
CREATE TABLE entry_gate (
  id SERIAL PRIMARY KEY,
  distance INTEGER NOT NULL,
  is_vehicle_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial data
INSERT INTO entry_gate (distance, is_vehicle_detected)
VALUES (0, false);

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE entry_gate;
```

**Field Description:**
- `id`: Primary key (auto-increment)
- `distance`: Jarak dalam cm dari sensor ultrasonic (0-400 cm)
- `is_vehicle_detected`: Flag boolean untuk deteksi mobil (true jika distance < 100cm)
- `created_at`: Timestamp untuk tracking update terakhir

### 2. TypeScript Interfaces

**File**: `lib/supabase.ts`

```typescript
export interface EntryGateData {
  id: number
  distance: number
  is_vehicle_detected: boolean
  created_at: string
}
```

### 3. API Functions

**File**: `lib/supabase.ts`

```typescript
// Fetch latest entry gate data
export const getEntryGateData = async (): Promise<EntryGateData | null>

// Subscribe to real-time updates
export const subscribeToEntryGateChanges = (
  callback: (data: EntryGateData) => void
)
```

### 4. Custom Hook

**File**: `hooks/useEntryGateData.tsx`

```typescript
export const useEntryGateData = (): UseEntryGateDataReturn
```

**Return Values:**
- `gateData`: Data sensor terkini
- `isLoading`: Loading state
- `isConnected`: Connection status
- `error`: Error message (jika ada)
- `refetch`: Function untuk manual refresh

### 5. UI Component

**File**: `components/EntryGate.tsx`

**Props:**
```typescript
interface EntryGateProps {
  distance: number        // Jarak dari sensor (cm)
  isConnected: boolean    // Status koneksi
  lastUpdate: string      // Timestamp update terakhir
}
```

**Visual States:**
- **SIAP** (hijau): Tidak ada mobil terdeteksi
- **MOBIL TERDETEKSI** (biru): Ada mobil di sensor (distance < 100cm)
- **OFFLINE** (abu-abu): Koneksi terputus

## Layout Integration

### Posisi di Page Level (app/page.tsx)

```
┌──────────────┬───────────────────────────────┐
│              │  🚗 Smart Parking System      │
│  [EntryGate] │  ─────────────────────────    │
│   (Kiri)     │  [Slot1] [Slot2] [Slot3]      │
│   Auto Width │  ───── DRIVE WAY ─────        │
│   Auto Height│  [Slot4] [Slot5]              │
│              │  [Statistics Cards]           │
└──────────────┴───────────────────────────────┘
```

**Konfigurasi:**
- Entry Gate: Sebelah kiri (standalone component)
- ParkingGrid: Sebelah kanan (fokus pada slots)
- Responsive: Mobile akan stack vertical

### Separation of Concerns
- **app/page.tsx**: Handle layout dan entry gate data
- **ParkingGrid.tsx**: Fokus hanya pada parking slots
- **EntryGate.tsx**: Reusable sensor display component

## Penggunaan di ESP32/Arduino

### Sample Code untuk Update Data

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Supabase configuration
const char* supabaseUrl = "YOUR_SUPABASE_URL";
const char* supabaseKey = "YOUR_ANON_KEY";

// Ultrasonic sensor pins
const int trigPin = 5;
const int echoPin = 18;

void updateEntryGate(int distance) {
  HTTPClient http;

  String url = String(supabaseUrl) + "/rest/v1/entry_gate?id=eq.1";
  http.begin(url);

  http.addHeader("apikey", supabaseKey);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=representation");

  bool isVehicleDetected = (distance > 0 && distance < 100);

  String payload = "{\"distance\":" + String(distance) +
                   ",\"is_vehicle_detected\":" +
                   (isVehicleDetected ? "true" : "false") + "}";

  int httpCode = http.PATCH(payload);

  if (httpCode > 0) {
    Serial.println("Entry gate updated successfully");
  }

  http.end();
}

void loop() {
  // Read ultrasonic sensor
  long duration, distance;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  // Update database
  updateEntryGate(distance);

  delay(1000); // Update setiap 1 detik
}
```

## Testing

### Manual Testing via Supabase SQL Editor

```sql
-- Simulate mobil terdeteksi
UPDATE entry_gate
SET distance = 50,
    is_vehicle_detected = true,
    created_at = NOW()
WHERE id = 1;

-- Simulate tidak ada mobil
UPDATE entry_gate
SET distance = 200,
    is_vehicle_detected = false,
    created_at = NOW()
WHERE id = 1;
```

## Perubahan dari Request Awal

### 1. Slot Count: 6 → 5
- `hooks/useParkingData.tsx:33`: Loop dari 6 menjadi 5
- `components/ParkingGrid.tsx:100`: slice(3,6) menjadi slice(3,5)
- `components/ParkingGrid.tsx:49`: Text "6 Parking Slots" → "5 Parking Slots"
- `components/ParkingGrid.tsx:150`: Total slots display 6 → 5

### 2. Layout Changes
- Entry label dipindah ke kiri
- Entry gate component ditambahkan di kanan driveway
- Exit tidak ditampilkan (as requested)

## File Structure

```
app/
└── page.tsx               # UPDATED: Layout dengan EntryGate + ParkingGrid

components/
├── EntryGate.tsx          # NEW: Entry gate sensor component
├── ParkingGrid.tsx        # UPDATED: Fokus pada slots (removed entry gate)
└── ParkingSlot.tsx        # UNCHANGED

hooks/
├── useEntryGateData.tsx   # NEW: Hook untuk entry gate data
└── useParkingData.tsx     # UPDATED: 5 slots

lib/
└── supabase.ts            # UPDATED: Entry gate types & functions

claudedocs/
└── entry-gate-implementation.md  # UPDATED: Dokumentasi ini
```

## Catatan Penting

1. **Database Setup Required**: Tabel `entry_gate` harus dibuat di Supabase
2. **Real-time Enabled**: Enable real-time updates untuk tabel `entry_gate`
3. **ESP32 Integration**: Gunakan sample code di atas untuk hardware integration
4. **Detection Threshold**: Mobil terdeteksi jika distance < 100cm
5. **Update Frequency**: Rekomendasi 1 detik untuk real-time responsiveness

## Next Steps

1. Buat tabel `entry_gate` di Supabase
2. Test real-time updates via SQL editor
3. Integrate dengan ESP32 + sensor ultrasonic
4. Monitor performance dan adjust threshold jika diperlukan
