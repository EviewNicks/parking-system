# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Parking System adalah sistem monitoring parking slot real-time menggunakan Next.js 15 dan Supabase. Project ini merupakan MVP untuk monitoring 6 parking slot dengan update status setiap 30 detik.

## Development Commands

### Core Development
```bash
npm run app           # Start development server with Turbopack
npm run build         # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Setup
- Copy `.env` file dan pastikan Supabase credentials tersedia
- Supabase table: `parkingg` dengan 6 slot initial records
- Development server: http://localhost:3000

## Architecture & Stack

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **React**: Version 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 dengan PostCSS
- **Build**: Turbopack untuk faster development dan builds

### Backend & Database
- **Database**: Supabase PostgreSQL
- **Table**: `parkingg` untuk parking slot data
- **API Strategy**: 30-second polling untuk real-time updates
- **Connection**: Direct Supabase client integration

### Key Configuration
- **Path Aliases**: `@/*` mapped ke project root
- **TypeScript**: Strict configuration dengan Next.js plugin
- **ESLint**: Next.js core-web-vitals dan TypeScript rules

## Project Structure

```
app/
├── layout.tsx       # Root layout dengan Geist fonts
├── page.tsx         # Main parking grid display
├── globals.css      # Tailwind base styles
└── favicon.ico

claudedocs/          # Project documentation dan analysis
├── mvp-implementation-roadmap.md  # MVP development phases
├── cost-analysis-realtime.md      # Supabase usage optimization
├── data-structure-optimization.md # Database schema
└── frontend-architecture-analysis.md # Component structure
```

## Development Workflow

### MVP Implementation Phases
1. **Phase 1**: Database setup dan basic API endpoints
2. **Phase 2**: Slot display components dengan real-time polling
3. **Phase 3**: UX polish dan performance optimization

### Real-time Data Strategy
- Implementasi 30-second polling (bukan WebSocket untuk cost efficiency)
- Status colors: Hijau (available), Merah (occupied), Kuning (maintenance)
- Loading states dan error handling untuk connection issues

### Performance Guidelines
- Target: <3 second load time
- Caching strategy untuk reduced API calls
- Optimized JSON payloads dari Supabase
- Bundle size monitoring dengan Next.js analyzer

## Database Schema

### Parking Slots Table (`parkingg`)
- 6 initial records untuk slot monitoring
- Status field: available/occupied/maintenance
- Timestamp tracking untuk last update
- Slot numbering system (1-6)

## Important Notes

### Cost Optimization
- Semua components free tier compatible (Supabase, Vercel)
- Monitor Supabase API usage untuk avoid rate limits
- Efficient polling intervals untuk balance real-time dan cost

### Development Patterns
- TypeScript strict mode - semua types harus defined
- App Router patterns - server/client components separation
- Responsive design - mobile-first approach
- Error boundaries untuk graceful failure handling

### Environment Variables
File `.env` berisi Supabase credentials:
- `supabase_url`: Project URL
- `anon_key`: Public API key
- `table_name`: Database table name ("parkingg")

### Testing Strategy
- Manual testing untuk MVP phase
- Performance monitoring dengan Web Vitals
- Uptime monitoring untuk 99% reliability target

Ketika working dengan project ini, prioritaskan MVP scope adherence dan cost-efficient solutions. Focus pada core functionality: 6-slot display dengan accurate real-time status updates.