# App Pages Documentation

Dokumentasi untuk Next.js App Router pages.

## page.tsx (Home Page)

**File**: `app/page.tsx`

**Deskripsi**: Main page yang menghandle layout aplikasi parking system dengan EntryGate dan ParkingGrid dalam layout side-by-side.

**Architecture**: Client Component (uses hooks)

### Layout Structure

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

### Responsive Behavior

**Desktop (lg breakpoint and above)**:
- Flexbox row layout
- EntryGate: Auto width di kiri
- ParkingGrid: Flex-1 di kanan
- Gap: 1.5rem (6 in Tailwind)

**Mobile (below lg breakpoint)**:
- Flexbox column layout (stacked)
- EntryGate: Full width di atas
- ParkingGrid: Full width di bawah
- Gap: 1.5rem (6 in Tailwind)

### Component Imports

```tsx
import ParkingGrid from '@/components/ParkingGrid'
import EntryGate from '@/components/EntryGate'
import { useEntryGateData } from '@/hooks/useEntryGateData'
```

### Data Flow

1. **useEntryGateData Hook**: Fetch dan subscribe entry gate sensor data
2. **Loading State**: Tampilkan skeleton loader saat data loading
3. **EntryGate Component**: Receive props (distance, isConnected, lastUpdate)
4. **ParkingGrid Component**: Self-contained, handle sendiri slot data

### Separation of Concerns

**app/page.tsx Responsibilities**:
- Layout orchestration
- Entry gate data management
- Responsive layout handling
- Background styling

**ParkingGrid Responsibilities**:
- Parking slots display
- Slot data management
- Statistics calculation
- Internal layout (grid + driveway)

**EntryGate Responsibilities**:
- Sensor visualization
- Status indicator
- Distance display

### Styling

**Container**:
- Full viewport height: `min-h-screen`
- Gradient background: `from-slate-700 to-slate-900`
- Padding: `py-8 px-4`

**Inner Container**:
- Max width: `max-w-7xl`
- Centered: `mx-auto`

**Layout Container**:
- Flex direction: `flex-col lg:flex-row`
- Alignment: `items-start`
- Gap: `gap-6`

### Code Example

```tsx
'use client'

import ParkingGrid from '@/components/ParkingGrid'
import EntryGate from '@/components/EntryGate'
import { useEntryGateData } from '@/hooks/useEntryGateData'

export default function Home() {
  const { gateData, isLoading, isConnected } = useEntryGateData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Entry Gate - Left */}
          <div className="w-full lg:w-auto flex-shrink-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : gateData ? (
              <EntryGate {...gateData} isConnected={isConnected} />
            ) : null}
          </div>

          {/* Parking Grid - Right */}
          <div className="flex-1 w-full">
            <ParkingGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Benefits of This Architecture

1. **Separation of Concerns**: Page handles layout, components handle functionality
2. **Reusability**: ParkingGrid can be used independently
3. **Flexibility**: Easy to reposition or remove EntryGate
4. **Maintainability**: Clear responsibilities for each component
5. **Testability**: Components can be tested in isolation

### Future Enhancements

- Add ExitGate component di sebelah kanan
- Implement exit sensor monitoring
- Add gate control actions (open/close)
- Implement multi-gate support
