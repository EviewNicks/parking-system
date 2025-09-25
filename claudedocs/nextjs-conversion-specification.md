# Next.js Conversion Specification: Advanced Parking Lot System

## Conversion Overview

Konversi dari HTML prototype (`proyek.html`) ke Next.js architecture dengan enhanced realistic parking lot visualization dan modern UI components.

## Key Conversion Decisions

### 1. Architecture Upgrade
- **From**: Single HTML file dengan inline JavaScript
- **To**: Next.js App Router dengan TypeScript dan component-based architecture
- **Benefit**: Better maintainability, type safety, dan scalable structure

### 2. Real-time Strategy (Kept from Prototype)
- **Decision**: Tetap menggunakan Supabase real-time subscriptions seperti prototype
- **Reasoning**: Instant updates untuk parking decisions lebih critical daripada cost optimization
- **Implementation**: WebSocket-based subscriptions dengan automatic reconnection

### 3. Advanced UI Enhancement
- **From**: Simple CSS dengan basic colors (hijau/merah)
- **To**: 3D realistic parking lot dengan Tailwind CSS dan modern components
- **Features**: Car icons, shadows, road markings, animated transitions

## Technical Specifications

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL="https://hbamjfskfcatsnboenmr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
TABLE_NAME="parkingg"
```

### Supabase Configuration (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Real-time subscription setup
export const subscribeToParkingUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('parking-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: process.env.TABLE_NAME || 'parkingg' },
      callback
    )
    .subscribe()
}
```

## Advanced Parking Lot Design

### Visual Layout Concept
```
    🚗 PARKING AREA 🚗
    ╔═══════════════════╗
    ║  [1]  [2]  [3]    ║
    ║   🚗   🟢   🚗    ║
    ║                   ║
    ║  [4]  [5]  [6]    ║
    ║   🟢   🔧   🟢    ║
    ╚═══════════════════╝
```

### Tailwind Styling Strategy

#### 1. Parking Space Design
```css
/* Individual parking slot styling */
.parking-slot {
  @apply relative w-32 h-48 border-2 border-white border-dashed;
  @apply bg-gradient-to-br from-gray-600 to-gray-700;
  @apply rounded-lg shadow-lg transform transition-all duration-300;
  @apply hover:scale-105 hover:shadow-xl;
}

/* 3D perspective effect */
.parking-grid {
  @apply perspective-1000 transform-style-preserve-3d;
}

/* Asphalt texture background */
.parking-area {
  @apply bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800;
  @apply relative overflow-hidden rounded-2xl p-8;
}
```

#### 2. Status Indicators dengan Advanced Styling
```typescript
const statusStyles = {
  available: {
    slot: "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-emerald-500/50",
    icon: "🟢",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]"
  },
  occupied: {
    slot: "bg-gradient-to-br from-red-400 to-red-600 border-red-300 shadow-red-500/50",
    icon: "🚗",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]"
  },
  maintenance: {
    slot: "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 shadow-amber-500/50",
    icon: "🔧",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]"
  }
}
```

### Component Architecture

#### 1. ParkingGrid Component
```typescript
interface ParkingGridProps {
  slots: ParkingSlot[]
  isConnected: boolean
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ slots, isConnected }) => {
  return (
    <div className="parking-area max-w-4xl mx-auto p-8">
      {/* Header dengan connection status */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          🚗 Smart Parking System
        </h1>
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* 2x3 parking grid */}
      <div className="grid grid-cols-3 gap-6 parking-grid">
        {slots.map((slot) => (
          <ParkingSlot key={slot.id} slot={slot} />
        ))}
      </div>

      {/* Legend */}
      <StatusLegend />
    </div>
  )
}
```

#### 2. ParkingSlot Component dengan 3D Effects
```typescript
const ParkingSlot: React.FC<{ slot: ParkingSlot }> = ({ slot }) => {
  const statusStyle = statusStyles[slot.status]

  return (
    <div className={`parking-slot ${statusStyle.slot} ${statusStyle.glow} group`}>
      {/* Slot number */}
      <div className="absolute -top-3 -left-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
        {slot.slot}
      </div>

      {/* Status icon dengan animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl animate-pulse group-hover:animate-bounce">
          {statusStyle.icon}
        </div>
      </div>

      {/* Distance info (if available) */}
      {slot.jarak && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs rounded p-1 text-center">
          {slot.jarak}cm
        </div>
      )}

      {/* Last update timestamp */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/30 text-white text-xs rounded p-1 text-center">
        {formatTimestamp(slot.created_at)}
      </div>
    </div>
  )
}
```

## Real-time Data Hook

### Custom Hook Implementation
```typescript
// hooks/useParkingData.tsx
export const useParkingData = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('parkingg')
          .select('*')
          .order('slot', { ascending: true })

        if (error) throw error
        setSlots(data || [])
        setIsConnected(true)
      } catch (err) {
        setError(err.message)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()

    // Real-time subscription
    const subscription = subscribeToParkingUpdates((payload) => {
      console.log('Real-time update:', payload.new)

      setSlots(prev => prev.map(slot =>
        slot.id === payload.new.id
          ? { ...slot, ...payload.new }
          : slot
      ))
      setIsConnected(true)
      setError(null)
    })

    // Connection health monitoring
    const healthCheck = setInterval(() => {
      if (subscription.state === 'SUBSCRIBED') {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearInterval(healthCheck)
    }
  }, [])

  return { slots, isConnected, isLoading, error }
}
```

## TypeScript Interfaces

```typescript
interface ParkingSlot {
  id: number
  slot: number
  status: 'terisi' | 'kosong' | 'maintenance'
  jarak?: number
  created_at: string
}

interface ConnectionStatus {
  isConnected: boolean
  lastUpdate?: Date
  retryCount?: number
}

interface ParkingState {
  slots: ParkingSlot[]
  connectionStatus: ConnectionStatus
  isLoading: boolean
  error: string | null
}
```

## Animation & Interaction Enhancements

### Smooth Transitions
```css
/* Status change animations */
.parking-slot {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.parking-slot.status-change {
  animation: statusPulse 0.6s ease-in-out;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px currentColor; }
}

/* Loading skeleton animation */
.parking-slot.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Performance Optimizations

### React Optimization
```typescript
// Memoized components untuk prevent unnecessary re-renders
export const ParkingSlot = React.memo(({ slot }: { slot: ParkingSlot }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.slot.status === nextProps.slot.status &&
         prevProps.slot.jarak === nextProps.slot.jarak &&
         prevProps.slot.created_at === nextProps.slot.created_at
})

// Optimized state updates
const updateSlotOptimistically = useCallback((slotId: number, newStatus: string) => {
  setSlots(prev => prev.map(slot =>
    slot.id === slotId
      ? { ...slot, status: newStatus, created_at: new Date().toISOString() }
      : slot
  ))
}, [])
```

### Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    unoptimized: true // untuk static export jika diperlukan
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  }
}
```

## Error Handling Strategy

### Comprehensive Error Boundaries
```typescript
const ParkingErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">🚧 Sistem Parkir Sedang Bermasalah</h2>
            <p className="text-gray-300 mb-6">Mohon tunggu beberapa saat atau refresh halaman</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
```

## Implementation Priority

1. **Setup Foundation** (15 menit)
   - Environment variables dan Supabase config
   - Basic component structure

2. **Advanced UI Implementation** (30 menit)
   - Realistic parking lot design dengan Tailwind
   - 3D effects dan animations
   - Status indicators dengan modern styling

3. **Real-time Integration** (15 menit)
   - WebSocket subscriptions
   - Error handling dan reconnection logic
   - Performance optimizations

**Total estimated time: 60 menit untuk complete conversion**