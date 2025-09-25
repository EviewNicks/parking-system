# Frontend Architecture Analysis: MVP Parking Display

## Framework Decision Matrix

### Option 1: Next.js (SELECTED)
**Reasoning:**
- ✅ Built-in API routes untuk backend logic
- ✅ Server-side rendering untuk performance
- ✅ Easy deployment dengan Vercel (free tier)
- ✅ TypeScript support untuk type safety
- ✅ Minimal configuration overhead

**MVP Implementation:**
```typescript
// pages/index.tsx - Simple display component
interface ParkingSlot {
  id: number;
  slot_number: number;
  status: 'available' | 'occupied' | 'maintenance';
  last_updated: string;
}

// Polling strategy implementation
useEffect(() => {
  const interval = setInterval(fetchSlotStatus, 30000);
  return () => clearInterval(interval);
}, []);
```

### Option 2: Vanilla React
**Pros:** Lighter bundle size
**Cons:** No built-in API layer, deployment complexity

### Option 3: Vue.js
**Pros:** Learning curve friendly
**Cons:** Less ecosystem untuk database integration

## Component Architecture (Minimal Viable)

```
App
├── ParkingGrid (6 slot display)
│   ├── ParkingSlot × 6
│   └── StatusLegend
├── RefreshIndicator
└── LastUpdated timestamp
```

## State Management Decision

### Local State vs Global State Manager
**Decision: useState Hook (MVP)**

**Reasoning:**
- 6 slots = minimal state complexity
- No complex user interactions
- Display-only requirement
- Avoid Redux/Zustand overhead untuk MVP

```typescript
const [slots, setSlots] = useState<ParkingSlot[]>([]);
const [loading, setLoading] = useState(false);
const [lastUpdate, setLastUpdate] = useState<Date>();
```