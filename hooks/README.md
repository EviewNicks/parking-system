# Hooks Documentation

Dokumentasi untuk custom React hooks yang digunakan dalam parking system.

## useEntryGateData

**File**: `hooks/useEntryGateData.tsx`

**Deskripsi**: Custom hook untuk mengambil dan subscribe real-time data dari entry gate sensor ultrasonic.

**Return Values**:
```typescript
interface UseEntryGateDataReturn {
  gateData: EntryGateData | null    // Data sensor terkini
  isLoading: boolean                 // Loading state
  isConnected: boolean               // Status koneksi real-time
  error: string | null               // Error message
  refetch: () => void                // Manual refresh function
}
```

**Features**:
- Fetch initial entry gate data dari Supabase
- Real-time subscription untuk sensor updates
- Auto-reconnect pada connection loss
- Error handling dengan retry functionality
- Fallback data jika database kosong

**Usage**:
```tsx
import { useEntryGateData } from '@/hooks/useEntryGateData'

function MyComponent() {
  const { gateData, isLoading, isConnected, error, refetch } = useEntryGateData()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      Distance: {gateData?.distance} cm
      Status: {gateData?.is_vehicle_detected ? 'Terdeteksi' : 'Kosong'}
    </div>
  )
}
```

**Database Table**: `entry_gate`

**Update Frequency**: Real-time via Supabase Realtime

---

## useParkingData

**File**: `hooks/useParkingData.tsx`

**Deskripsi**: Custom hook untuk mengambil dan subscribe real-time data dari 5 parking slots.

**Return Values**:
```typescript
interface UseParkingDataReturn {
  slots: ParkingSlot[]      // Array 5 parking slots
  isLoading: boolean        // Loading state
  isConnected: boolean      // Status koneksi real-time
  error: string | null      // Error message
  refetch: () => void       // Manual refresh function
}
```

**Features**:
- Fetch initial 5 parking slots dari Supabase
- Auto-create placeholder slots jika database kurang dari 5
- Real-time subscription untuk slot updates
- Connection status monitoring
- Error handling dengan retry capability

**Usage**:
```tsx
import { useParkingData } from '@/hooks/useParkingData'

function MyComponent() {
  const { slots, isLoading, isConnected, error, refetch } = useParkingData()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {slots.map(slot => (
        <div key={slot.id}>
          Slot {slot.slot}: {slot.status}
        </div>
      ))}
    </div>
  )
}
```

**Database Table**: `parkingg`

**Slot Configuration**: 5 slots (slot number 1-5)

**Update Frequency**: Real-time via Supabase Realtime

---

## Best Practices

### Error Handling
Kedua hooks memiliki built-in error handling:
```tsx
const { error, refetch } = useParkingData()

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  )
}
```

### Connection Monitoring
Monitor connection status untuk user feedback:
```tsx
const { isConnected } = useParkingData()

<div className={isConnected ? 'online' : 'offline'}>
  {isConnected ? 'Connected' : 'Disconnected'}
</div>
```

### Loading States
Handle loading states dengan proper UI:
```tsx
const { isLoading, slots } = useParkingData()

if (isLoading) {
  return <LoadingSpinner />
}

return <SlotGrid slots={slots} />
```

### Manual Refresh
Gunakan refetch untuk manual data refresh:
```tsx
const { refetch } = useParkingData()

<button onClick={refetch}>
  Refresh Data
</button>
```

## Dependencies

Kedua hooks menggunakan:
- `react` (useState, useEffect, useCallback)
- `@/lib/supabase` (Supabase functions dan types)

## Real-time Architecture

```
Supabase Database
    ↓ (Real-time Channel)
Custom Hook (useParkingData / useEntryGateData)
    ↓ (State Updates)
React Component
    ↓ (Re-render)
UI Update
```

Update terjadi otomatis ketika data berubah di database tanpa perlu polling manual.
