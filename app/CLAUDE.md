# app/

## Purpose
Next.js App Router root. Every URL the user sees is a folder under here, and each folder contains exactly one `page.tsx` (Client Component). Two flat utility folders sit alongside the routes: `components/` (shared UI) and `service/` (Axios + API call layer).

## Key files
- `page.tsx` — `/` sign-up entry (email + password → `POST /api/signup`)
- `layout.tsx` — root layout: Geist Sans/Mono fonts, metadata, body wrapper
- `globals.css` — Tailwind import, CSS variables, `@font-face` for `Built Titling`, body defaults
- `favicon.ico` — favicon
- `login/`, `email-recovery/`, `payment/`, `create-account/`, `dashboard/`, `admin/` — one route per folder, each with its own `CLAUDE.md`
- `components/Toast.tsx` — auto-dismissing notification component (see [components/CLAUDE.md](components/CLAUDE.md))
- `service/APIutils.tsx` — Axios instance + interceptors + `extractToken`/`extractRole`/`handleError`/`resolveImageUrl` (see [service/CLAUDE.md](service/CLAUDE.md))
- `service/allApi.tsx` — 21 named exports, one per endpoint

## Data flow
```
URL request → file-system route resolves → page.tsx mounts as Client Component
  ↓ useState/useEffect kick off
  ↓ allApi.tsx function called → APIutils Axios → Laravel REST API
  ↓ response → page state → re-render → Toast on error
```

## Dependencies
- **Imports from**: `next/navigation`, `next/font/google`, `react`, `axios` (only via `service/`), `lucide-react`
- **Depended on by**: nothing — this is the user-facing surface; build artifacts go to `.next/`
- **Backend contract**: Laravel API at `process.env.NEXT_PUBLIC_API_BASE_URL`

## Conventions
- **Every** `page.tsx` starts with `'use client'` (no Server Components, no Server Actions)
- **No** middleware.ts (no client-side auth guard); the API layer protects data
- **No** Route Handlers (no `app/api/`) — all backend traffic goes to Laravel
- **No** per-section `layout.tsx` — only the root one
- Path alias `@/*` is configured in tsconfig.json but unused; use relative imports

## Common commands
```bash
npm run dev      # http://localhost:3000
npm run build    # production build (catches TS errors)
npm run lint     # ESLint
```
