# Implementation Checklist - Distance-Based Parking Recommendation

Gunakan checklist ini untuk track progress implementasi sistem rekomendasi parkir.

---

## 📋 Pre-Implementation Planning

### Requirement Gathering
- [ ] Define physical layout parkir (linear/grid/custom)
- [ ] Measure atau estimate koordinat setiap parking slot
- [ ] Identify entrance location dan coordinate
- [ ] Determine unit measurement (meter/grid units)
- [ ] Confirm jumlah entrance points (single/multiple)

### Documentation Review
- [ ] Read `approach-1-distance-based.md` completely
- [ ] Understand Euclidean distance formula
- [ ] Review code examples untuk clarity
- [ ] Identify any project-specific modifications needed

---

## 🗄️ Phase 1: Database Setup

### Schema Enhancement
- [ ] Backup existing `parkingg` table
- [ ] Add `coordinate_x` column (FLOAT type)
- [ ] Add `coordinate_y` column (FLOAT type)
- [ ] Verify columns added successfully

**SQL Commands**:
```sql
-- Backup (via Supabase Dashboard)
-- Add columns
ALTER TABLE parkingg
ADD COLUMN coordinate_x FLOAT,
ADD COLUMN coordinate_y FLOAT;

-- Verify
SELECT * FROM parkingg LIMIT 1;
```

### Coordinate Population
- [ ] Define entrance coordinate constant (e.g., 0,0)
- [ ] Map physical slot positions ke coordinates
- [ ] Update slot 1 coordinate
- [ ] Update slot 2 coordinate
- [ ] Update slot 3 coordinate
- [ ] Update slot 4 coordinate
- [ ] Update slot 5 coordinate
- [ ] Update slot 6 coordinate
- [ ] Verify all coordinates populated

**SQL Template**:
```sql
UPDATE parkingg SET coordinate_x = ?, coordinate_y = ? WHERE slot_number = 1;
UPDATE parkingg SET coordinate_x = ?, coordinate_y = ? WHERE slot_number = 2;
-- ... untuk slot 3-6
```

### Database Testing
- [ ] Query all slots dengan coordinates: `SELECT * FROM parkingg`
- [ ] Verify no NULL values in coordinate columns
- [ ] Test query available slots: `SELECT * FROM parkingg WHERE status='available'`
- [ ] Confirm coordinate values make logical sense

---

## 💻 Phase 2: Backend Development

### Project Structure Setup
- [ ] Create `app/lib/` directory (jika belum ada)
- [ ] Create `app/types/` directory (jika belum ada)
- [ ] Create `app/api/recommend/` directory

### Constants Configuration
- [ ] Create file: `app/lib/constants.ts`
- [ ] Define `ENTRANCE_COORDINATE` constant
- [ ] Export constant properly
- [ ] Verify import works dari other files

**File**: `app/lib/constants.ts`
```typescript
export const ENTRANCE_COORDINATE = {
  x: 0, // Adjust based pada physical layout
  y: 0
};
```

### Distance Calculation Utility
- [ ] Create file: `app/lib/distance.ts`
- [ ] Implement `calculateDistance` function
- [ ] Implement `getSlotDistance` function
- [ ] Add JSDoc comments
- [ ] Test functions manually (console.log examples)

**File**: `app/lib/distance.ts`
```typescript
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

export function getSlotDistance(
  entranceX: number,
  entranceY: number,
  slotX: number,
  slotY: number
): number {
  const distance = calculateDistance(entranceX, entranceY, slotX, slotY);
  return Math.round(distance * 100) / 100;
}
```

### TypeScript Types Definition
- [ ] Create file: `app/types/parking.ts`
- [ ] Define `ParkingSlot` interface
- [ ] Define `ParkingSlotWithDistance` interface
- [ ] Define `RecommendationResponse` interface
- [ ] Verify types compile without errors

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

### API Route Implementation
- [ ] Create file: `app/api/recommend/route.ts`
- [ ] Import dependencies (Supabase, utilities, types)
- [ ] Implement GET handler function
- [ ] Add error handling untuk database errors
- [ ] Add handling untuk "no available slots" scenario
- [ ] Add distance calculation logic
- [ ] Add sorting logic
- [ ] Format response properly
- [ ] Test TypeScript compilation: `npm run build`

**File**: `app/api/recommend/route.ts` - See full code in `approach-1-distance-based.md`

### Backend Testing
- [ ] Start development server: `npm run app`
- [ ] Test API endpoint: `http://localhost:3000/api/recommend`
- [ ] Verify response format matches `RecommendationResponse` type
- [ ] Test dengan all slots available
- [ ] Test dengan some slots occupied
- [ ] Test dengan all slots occupied (error scenario)
- [ ] Check console logs untuk errors
- [ ] Measure API response time (should be <200ms)

**Testing Tools**:
- Browser: Visit `http://localhost:3000/api/recommend`
- Thunder Client (VS Code extension)
- Postman
- cURL: `curl http://localhost:3000/api/recommend`

---

## 🎨 Phase 3: Frontend Development

### Component Creation
- [ ] Create file: `app/components/ParkingRecommendation.tsx`
- [ ] Set up component state (`recommendation`, `loading`, `error`)
- [ ] Implement `getRecommendation` async function
- [ ] Add fetch call ke `/api/recommend`
- [ ] Add error handling
- [ ] Implement UI structure (button, result display, error message)
- [ ] Add loading state indicator
- [ ] Style component dengan Tailwind CSS
- [ ] Test component in isolation

**File**: `app/components/ParkingRecommendation.tsx` - See full code in `approach-1-distance-based.md`

### Page Integration
- [ ] Open `app/page.tsx`
- [ ] Import `ParkingRecommendation` component
- [ ] Add component ke page layout
- [ ] Position component appropriately (above/below parking grid)
- [ ] Ensure responsive layout
- [ ] Test component renders correctly

**Example Integration**:
```typescript
import ParkingRecommendation from './components/ParkingRecommendation';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1>Smart Parking System</h1>

      <ParkingRecommendation />

      {/* Existing parking grid display */}
    </main>
  );
}
```

### Styling & UX Polish
- [ ] Ensure button has hover states
- [ ] Add disabled state styling untuk loading
- [ ] Style recommendation result card (green highlight)
- [ ] Style error message (red alert)
- [ ] Add icons (parking icon, error icon)
- [ ] Ensure mobile responsive
- [ ] Test color contrast untuk accessibility
- [ ] Add animations (optional)

---

## 🧪 Phase 4: Testing & Validation

### Functional Testing
- [ ] **Test 1**: Click "Cari Parkir Terdekat" dengan all slots available
  - Expected: Shows nearest slot dengan correct distance
- [ ] **Test 2**: Occupy nearest slot, click again
  - Expected: Shows second-nearest slot
- [ ] **Test 3**: Set all slots ke occupied
  - Expected: Shows error "Tidak ada slot tersedia"
- [ ] **Test 4**: Set 1 slot ke maintenance, others occupied
  - Expected: Shows error (maintenance slots excluded)
- [ ] **Test 5**: Rapid clicking (stress test)
  - Expected: Handles multiple requests gracefully

### Data Accuracy Testing
- [ ] Manually calculate expected distance untuk each slot
- [ ] Compare manual calculation dengan API results
- [ ] Verify sorting order is correct (ascending distance)
- [ ] Test dengan different slot availability combinations
- [ ] Confirm slot_number displayed matches recommended slot

### Edge Cases
- [ ] Test dengan empty database (no slots)
- [ ] Test dengan missing coordinate data (NULL values)
- [ ] Test dengan negative coordinates
- [ ] Test dengan very large coordinate values
- [ ] Test dengan Supabase connection failure (disconnect internet)

### Performance Testing
- [ ] Measure API response time (target: <200ms)
- [ ] Check Network tab untuk request/response size
- [ ] Monitor Supabase dashboard untuk query performance
- [ ] Test dengan slow 3G network simulation
- [ ] Verify no memory leaks (repeated requests)

### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (if available)
- [ ] Chrome (mobile - Android)
- [ ] Safari (mobile - iOS if available)

---

## 📊 Phase 5: Monitoring & Optimization

### Performance Optimization
- [ ] Review API code untuk bottlenecks
- [ ] Consider caching strategy (if needed)
- [ ] Optimize Supabase query (add indexes if slow)
- [ ] Minimize frontend re-renders
- [ ] Check bundle size impact: `npm run build`

### Error Monitoring Setup
- [ ] Add console.error untuk backend failures
- [ ] Add user-friendly error messages
- [ ] Consider error tracking service (Sentry - optional)
- [ ] Log API failures untuk debugging

### Documentation
- [ ] Document coordinate system used
- [ ] Document any deviations dari original design
- [ ] Add comments untuk complex logic
- [ ] Update README.md dengan new feature
- [ ] Create troubleshooting guide (common issues)

### User Acceptance
- [ ] Demo feature ke stakeholders
- [ ] Gather user feedback
- [ ] Document feature requests untuk future iterations
- [ ] Confirm MVP acceptance criteria met

---

## 🚀 Phase 6: Deployment

### Pre-Deployment Checks
- [ ] Run production build: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Fix any ESLint warnings
- [ ] Test production build locally: `npm start`
- [ ] Verify environment variables set correctly
- [ ] Confirm Supabase credentials valid

### Deployment Steps
- [ ] Commit changes ke Git
- [ ] Push ke repository
- [ ] Deploy ke Vercel (or hosting platform)
- [ ] Verify deployment successful
- [ ] Test live API endpoint
- [ ] Test frontend on production URL

### Post-Deployment Validation
- [ ] Test all functionality on production
- [ ] Monitor Vercel logs untuk errors
- [ ] Monitor Supabase usage (API calls)
- [ ] Verify performance on production (response times)
- [ ] Test from different devices/networks

---

## 📈 Future Enhancements (Optional)

### Short-term Improvements
- [ ] Auto-refresh recommendation setiap 30s (match polling cycle)
- [ ] Show top 3 recommendations instead of just 1
- [ ] Add visual map showing recommended slot location
- [ ] Add distance unit toggle (meters/feet)

### Medium-term Features
- [ ] Support multiple entrance points
- [ ] Add user preferences (accessible slots, covered parking)
- [ ] Implement reservation system (book recommended slot)
- [ ] Add navigation arrows/directions ke recommended slot

### Long-term Vision
- [ ] Upgrade ke Approach 2 (pathfinding dengan obstacles)
- [ ] Implement AI-based predictive availability
- [ ] Add user behavior learning
- [ ] Mobile app integration

---

## 🆘 Troubleshooting

### Common Issues & Solutions

**Issue**: API returns 500 error
- Check Supabase credentials in `.env`
- Verify table name is correct (`parkingg`)
- Check Supabase dashboard untuk errors

**Issue**: Distance calculation seems wrong
- Verify coordinate values in database
- Check entrance coordinate constant
- Manually calculate expected distance
- Review distance formula implementation

**Issue**: No recommendation shown (but slots available)
- Check browser console untuk errors
- Verify fetch call succeeds (Network tab)
- Check API response format
- Verify component state updates correctly

**Issue**: TypeScript compilation errors
- Run `npm install` untuk ensure dependencies
- Check import paths are correct
- Verify types defined properly
- Check for typos in type names

---

## ✅ Definition of Done

Feature is COMPLETE when:
- [ ] All 6 phases checklist items completed
- [ ] All tests passing
- [ ] No console errors in browser/server
- [ ] API response time <200ms
- [ ] Feature deployed to production
- [ ] Stakeholder approval received
- [ ] Documentation updated

---

**Checklist Version**: 1.0
**Last Updated**: 2025-10-18
**Estimated Time**: 4-6 hours (untuk developer familiar dengan stack)
