# Components Documentation

Dokumentasi untuk semua komponen UI dalam parking system.

## EntryGate

**File**: `components/EntryGate.tsx`

**Deskripsi**: Komponen untuk menampilkan status pintu masuk (entry gate) dengan sensor ultrasonic yang mendeteksi keberadaan mobil di palang pintu.

**Props**:
```typescript
interface EntryGateProps {
  distance: number        // Jarak dari sensor ultrasonic (cm)
  isConnected: boolean    // Status koneksi real-time
  lastUpdate: string      // Timestamp update terakhir
}
```

**Features**:
- Real-time sensor monitoring
- Visual status indicator (SIAP/MOBIL TERDETEKSI/OFFLINE)
- Connection status indicator
- Distance display dari sensor ultrasonic
- Auto-update timestamp

**Usage**:
```tsx
import EntryGate from '@/components/EntryGate'

<EntryGate
  distance={50}
  isConnected={true}
  lastUpdate="2025-10-18T10:30:00Z"
/>
```

**Status Logic**:
- `distance < 100cm`: MOBIL TERDETEKSI (biru)
- `distance >= 100cm`: SIAP (hijau)
- `!isConnected`: OFFLINE (abu-abu)

---

## ParkingSlot

**File**: `components/ParkingSlot.tsx`

**Deskripsi**: Komponen untuk menampilkan individual parking slot dengan status real-time.

**Props**:
```typescript
interface ParkingSlotProps {
  slot: ParkingSlot
  isConnected: boolean
}
```

**Features**:
- Status visual (TERISI/KOSONG/MAINTENANCE)
- Distance sensor display
- Real-time update indicator
- Connection status indicator

**Usage**:
```tsx
import ParkingSlot from '@/components/ParkingSlot'

<ParkingSlot
  slot={slotData}
  isConnected={true}
/>
```

---

## ParkingGrid

**File**: `components/ParkingGrid.tsx`

**Deskripsi**: Component untuk menampilkan grid parking slots dengan layout 5 slot (3 + 2) dan statistics summary.

**Features**:
- Grid layout 5 parking slots (3 + 2)
- Simple driveway separator
- Real-time statistics summary
- Connection status monitoring
- Error handling dengan retry functionality

**Props**: None (self-contained component)

**Usage**:
```tsx
import ParkingGrid from '@/components/ParkingGrid'

export default function Home() {
  return <ParkingGrid />
}
```

**Layout**:
```
🚗 Smart Parking System
Real-time Monitoring • 5 Parking Slots

[Slot 1]  [Slot 2]  [Slot 3]

──────── DRIVE WAY ────────

[Slot 4]  [Slot 5]

[Available] [Occupied] [Maintenance] [Total]
```

**Note**: Component ini fokus hanya pada parking slots. Entry gate dihandle di page level (app/page.tsx) untuk separation of concerns.

---

## ParkingGate

**File**: `components/ParkingGate.tsx`

**Deskripsi**: Komponen advanced gate control dengan vehicle detection dan access control simulation (tidak digunakan di MVP, tersedia untuk future enhancement).

**Features**:
- Gate barrier animation
- Traffic light simulation
- Vehicle detection
- Access control system
- Statistics dashboard

**Note**: Component ini tersedia tapi tidak digunakan di layout MVP saat ini. Dibuat untuk future enhancement jika diperlukan fitur access control yang lebih kompleks.
