# app/dashboard/

## Purpose
End-user dashboard at `/dashboard` showing step counts and a social feed. **Currently uses placeholder data only** — the `friends` array is hardcoded and there is no API integration yet (flagged in [FRONTEND_AUDIT.md §11](../../../docs/FRONTEND_AUDIT.md)).

## Key files
- `page.tsx` — dashboard layout, hardcoded `friends` array, commented-out nav buttons (Community, Workout, Challenges, Space at L181–196)

## Data flow
```
/dashboard loads → page.tsx mounts as Client Component
  ├─ useEffect: (currently no API call — placeholder data)
  └─ Future: should call getUserStepDetail / getStatistics from allApi.tsx
              ↓
              Laravel /api/user-step-detail and /api/statistics/{user_id}
```

## Dependencies
- **Imports from**: `app/components/Toast.tsx`, `lucide-react`, `next/navigation`
- **Depended on by**: redirected to from `app/login/page.tsx` when role is `'User'`
- **Backend contract**: none active yet — Laravel endpoints `GET /api/user-step-detail`, `GET /api/statistics/{user_id}` exist but unused here

## Conventions
- `'use client'` at top
- Auth guard: should add `useEffect` checking `localStorage.getItem('authToken')` and `router.push('/login')` if missing (per `shiftFrontend/docs/PATTERNS.md §7`) — currently absent
- Static `friends` array + commented nav buttons should be removed when real data is wired

## Common commands
```bash
npm run dev      # http://localhost:3000/dashboard
npm run build
```
