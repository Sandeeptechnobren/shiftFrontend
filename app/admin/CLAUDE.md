# app/admin/

## Purpose
Single-page admin panel for managing users, groups, posts, payments, workout videos, and unpaid-access grants. Renders at the `/admin` route. Currently a 1535-line god component with ~100 `useState`s and inline modals — flagged for splitting in the audit.

## Key files
- `page.tsx` — the entire admin UI: dashboard cards, user list, group list, post moderation, video upload, unpaid-access management, multiple modals
- `page.tsx.tmp` — leftover backup from a JSX-repair script run; **delete** (see [FRONTEND_AUDIT.md §11](../../../docs/FRONTEND_AUDIT.md))

## Data flow
```
/admin loads → page.tsx mounts as Client Component
  ├─ useEffect: getAdminDashboard(), getAllUsers(), getAllGroups()  (app/service/allApi.tsx)
  ├─ Each modal Save → addUnpaidAccess / removeUnpaidAccess / uploadWorkoutVideo / etc.
  └─ Axios in APIutils.tsx auto-injects Bearer token → Laravel /admin/* routes
                                        ↓
                              admin endpoints behind AdminMiddleware
```

State is local (`useState`); cross-modal data flows via parent component props.

## Dependencies
- **Imports from**: `app/service/allApi.tsx` (admin API functions), `app/service/APIutils.tsx` (`resolveImageUrl`), `app/components/Toast.tsx`, `lucide-react` (icons), `next/navigation` (`useRouter`)
- **Depended on by**: nothing — leaf route
- **Backend contract**: every Laravel endpoint in `routes/admin.php` (Sanctum + `AdminMiddleware`)

## Conventions
- `'use client'` at top — file-system route only, no SSR
- Hardcoded mock user array at L41–46 is dead — real data comes from `getAllUsers()`
- No client-side auth guard — anyone can hit `/admin`; the API blocks unauthorized calls
- Role check is currently "email contains 'admin'" per `shiftFrontend/docs/ACCESS.md` §4 — not the Spatie role from the backend
- Toast for every API failure; never `alert()`

## Common commands
```bash
npm run dev       # http://localhost:3000/admin
npm run build     # next build (catches TS errors in this 1535-line file)
npm run lint      # ESLint pass
```
