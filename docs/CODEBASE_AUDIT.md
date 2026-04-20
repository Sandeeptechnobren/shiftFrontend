# ShiftFrontend — Codebase Audit

> **Date:** 2026-04-20
> **Audited by:** Claude Code (AI-assisted)

---

## 1. Project Health Summary

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Code organisation | ⚠️ Fair | Flat structure, admin page is monolithic |
| TypeScript coverage | ✅ Good | Strict mode on; some `any` in older code |
| API layer | ✅ Good | Centralised in `allApi.tsx` / `APIutils.tsx` |
| Auth handling | ⚠️ Partial | Token stored + sent correctly, but no route guard middleware |
| Error handling | ✅ Good | `handleError()` normalises all API errors |
| Component reuse | ⚠️ Low | Only one shared component (`Toast`); pages are monoliths |
| Security | ⚠️ Concerns | No CSRF, no route protection, token in localStorage |
| Testing | ❌ None | No test suite configured |
| Dependencies | ⚠️ Outdated | 8 vulnerabilities (3 moderate, 5 high) |
| Dead files | ⚠️ Present | `.tmp`, fix scripts, unused imports |

---

## 2. File-by-File Inventory

### `app/page.tsx` (180 lines) — Sign-up Page
- **What it does:** Email + password entry, calls `POST /api/signup`, stores token + email in localStorage, routes to `/email-recovery`
- **Issues:**
  - Terms & conditions checkbox — no actual link to T&C document
  - `login()` from `allApi` is misnamed — it actually calls `/api/signup` (registration)
  - OTP flow: token stored here may be overwritten at `/email-recovery`

### `app/login/page.tsx` (214 lines) — Login Page
- **What it does:** Email + password sign-in, role detection by email heuristic, routes to dashboard or admin
- **Issues:**
  - Role detection is a heuristic (`email.includes('admin')`) — fragile, should come from API
  - Commented-out import at L7: `// import { login, swiftLogin }` — dead code
  - `agreedToTerms` checkbox exists but no T&C link

### `app/email-recovery/page.tsx` (262 lines) — OTP Verification
- **Named:** `VerifyEmailPage` but route is `/email-recovery` — confusing name
- **What it does:** 4-digit OTP entry, countdown timer, calls `POST /api/signup/verify-email`
- **Issues:**
  - Falls back to `"user@example.com"` if no email in localStorage — should redirect to signup instead
  - Two separate `countdown` and `timeLeft` states that seem to serve the same purpose — possible logic duplication

### `app/payment/page.tsx` (172 lines) — Payment Page
- **What it does:** Shows premium plan card, calls `POST /api/payment/create`, redirects to Stripe
- **Issues:**
  - Amount hardcoded: `const AMOUNT = 599` — should come from env var or API
  - No success/cancel webhook handling on the frontend (backend handles it)
  - Currency display shows "GH₵" (cedis) but amount sent to Stripe is in cents (USD) — potential currency mismatch

### `app/create-account/page.tsx` (468 lines) — Profile Setup
- **What it does:** Username, photo, gender, age range, country selection, calls `POST /api/profile` (multipart)
- **Issues:**
  - Photo upload has debug `console.log` statements that should be removed
  - FormData key `image` — must match backend expectation (verify against backend `PATTERNS.md`)
  - Country list fetched on every render — could be cached

### `app/dashboard/page.tsx` (449 lines) — User Dashboard
- **What it does:** Displays step count, walking animation, social-style feed
- **Issues:**
  - **Uses no real API calls** — all data appears static/hardcoded
  - Walking animation defined as inline SVG — should be extracted to component
  - No actual step data from `GET /api/steps` or `GET /api/statistics`

### `app/admin/page.tsx` (1535 lines) — Admin Panel
- **What it does:** Full admin UI — users list, group management, post moderation, payment status, unpaid access control
- **Issues:**
  - **1535 lines in a single file** — must be split into sub-components
  - Mock data hardcoded (`const mockUsers = [...]`) — real API calls exist but mock data may shadow them
  - `admin/page.tsx.tmp` temp file in repo — should be deleted
  - Light/dark mode toggle present but theme not persisted to localStorage

### `app/components/Toast.tsx` (51 lines)
- ✅ Clean, well-structured, reusable

### `app/service/APIutils.tsx` (100 lines)
- ✅ Solid Axios setup with proper interceptors
- **Minor:** `// window.location.href = '/login';` redirect is commented out — intentional?

### `app/service/allApi.tsx` (160 lines)
- ✅ Good centralised API layer
- **Minor:** `addNewMessage()` function present but not used by any current page

---

## 3. Dead / Leftover Files

| File | Issue | Action |
|------|-------|--------|
| `app/admin/page.tsx.tmp` | Temp file committed to repo | Delete |
| `fix_admin.ps1` | PowerShell fix script — no longer needed | Delete or move to `scripts/` |
| `fix_jsx.js` | JSX fix script — no longer needed | Delete or move to `scripts/` |
| `README.md` | Generic Next.js README — not project-specific | Replace with project README |

---

## 4. Security Issues

| Issue | Severity | Location |
|-------|----------|----------|
| No route guard middleware | High | All authenticated pages |
| Auth token in localStorage (XSS risk) | Medium | `APIutils.tsx` |
| Role detection by email heuristic | Medium | `app/login/page.tsx` |
| Debug `console.log` in production code | Low | `app/create-account/page.tsx`, `app/service/allApi.tsx` |
| 8 npm vulnerabilities | Medium | `package-lock.json` |

---

## 5. Priority Refactoring Tasks

| Priority | Task |
|----------|------|
| P1 | Add `middleware.ts` to protect `/dashboard` and `/admin` routes |
| P1 | Split `app/admin/page.tsx` into sub-components (Users, Groups, Posts, Payments tabs) |
| P1 | Wire `app/dashboard/page.tsx` to real API (`GET /api/steps`, `/api/statistics`) |
| P2 | Fix role detection — read role from API response, not email heuristic |
| P2 | Remove mock data from admin page |
| P2 | Run `npm audit fix` to resolve npm vulnerabilities |
| P3 | Remove debug `console.log` statements |
| P3 | Delete leftover files (`*.tmp`, `fix_*.ps1`, `fix_*.js`) |
| P3 | Replace generic README.md with project-specific one |
