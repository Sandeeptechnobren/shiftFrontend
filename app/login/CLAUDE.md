# app/login/

## Purpose
Sign-in page for existing users at `/login`. Calls `swiftLogin()` against the Laravel `POST /api/signin` endpoint, stores the returned Sanctum token + role in `localStorage`, then redirects to `/admin` or `/dashboard` based on role.

## Key files
- `page.tsx` — the login form: email/password inputs, submit handler, role-based redirect

## Data flow
```
User submits form
  ↓ swiftLogin({ email, password, role })       — app/service/allApi.tsx
  ↓ API.post('/api/signin')                     — app/service/APIutils.tsx (Axios)
  ↓ Laravel /api/signin → { token, user }
  ↓ extractToken(response) → localStorage.setItem('authToken', token)
  ↓ extractRole(response)  → localStorage.setItem('userRole', 'Admin' | 'User')
  ↓ if role === 'Admin' → router.push('/admin')
  ↓ else                  → router.push('/dashboard')
```

## Dependencies
- **Imports from**: `app/service/allApi.tsx` (`swiftLogin`), `app/service/APIutils.tsx` (`extractToken`, `extractRole`), `app/components/Toast.tsx`, `lucide-react` (`Loader2`), `next/navigation` (`useRouter`)
- **Depended on by**: redirected to from `app/page.tsx` (signup) and from `/admin`, `/dashboard` 401 handlers
- **Backend contract**: `POST /api/signin` in `routes/api.php`

## Conventions
- `'use client'` at top
- Loading state: `useState<boolean>` + `<Loader2 className="animate-spin" />` while submitting (per `shiftFrontend/docs/PATTERNS.md §4`)
- Role normalisation handled by `extractRole` — always writes `'Admin'` or `'User'` to `localStorage`
- Toast on every failure path — never throw uncaught

## Common commands
```bash
npm run dev      # http://localhost:3000/login
npm run build
```
