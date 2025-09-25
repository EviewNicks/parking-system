Sekarang kita masuk ke Phase 2 Advanced UI Implementation. Bisakah Anda membuat arsitektur UI parking system  
 tingkat lanjut menggunakan Tailwind CSS dan HTML dengan spesifikasi berikut:

**PRODUCT REQUIREMENTS:**

- Buat layout parking system yang menampilkan 6 slot parking (2x3 grid)
- Visualisasikan dengan jelas lokasi gerbang masuk dan gerbang keluar
- Implementasikan 3D styling effects untuk realistic parking lot appearance
- Status indicators: hijau (available), merah (occupied), kuning (maintenance)
- Real-time connection status indicator
- Responsive design untuk mobile, tablet, dan desktop

**PROCESS IMPLEMENTATION:**

1. Analisis arsitektur berdasarkan @claudedocs/frontend-architecture-analysis.md
2. Buat component hierarchy: ParkingLotContainer > ParkingGrid > ParkingSlot
3. Implementasikan Tailwind CSS dengan custom 3D animations
4. Tambahkan asphalt texture dan road markings untuk realism
5. Integrasikan dengan @agent-frontend-architect untuk advanced patterns

**PERFORMANCE CRITERIA:**

- Mobile-first responsive design (breakpoints: 768px, 1024px)
- Accessibility compliance (WCAG 2.1 AA)
- Loading states dan error handling
- Smooth animations dengan CSS transforms
- Bundle size optimization untuk faster loading

**OUTPUT FORMAT:**

- Complete HTML structure dengan semantic markup
- Tailwind CSS classes dengan custom animations
- Component documentation dengan usage examples
- Responsive behavior specifications untuk each breakpoint

**REFERENCE:**
Gunakan analisis dari frontend-architecture-analysis.md dan koordinasi dengan frontend-architect agent untuk  
 implementasi yang konsisten dengan project architecture.
