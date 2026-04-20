# ShiftFrontend — Architecture Reference

> **Date:** 2026-04-20
> **Stack:** Next.js 16 App Router / React 19 / TypeScript 5 / Tailwind CSS 4

---

## 1. Overview

ShiftFrontend is a **Next.js App Router** web application. All routes are Client Components — there is no server-side data fetching or server actions currently. The app is a pure SPA-style frontend that calls the ShiftBackend REST API via Axios.

```
Browser → Next.js App Router → Client Component (page.tsx)
                                      ↓
                              app/service/allApi.tsx
                                      ↓
                              app/service/APIutils.tsx (Axios)
                                      ↓
                         ShiftBackend REST API (Laravel)
```

---

## 2. Routing (App Router)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Sign-up — email + password entry |
| `/login` | `app/login/page.tsx` | Sign-in for existing users |
| `/email-recovery` | `app/email-recovery/page.tsx` | OTP verification after sign-up |
| `/payment` | `app/payment/page.tsx` | Stripe subscription checkout |
| `/create-account` | `app/create-account/page.tsx` | Profile setup (username, photo, country, gender, age) |
| `/dashboard` | `app/dashboard/page.tsx` | User dashboard — steps, stats, social feed |
| `/admin` | `app/admin/page.tsx` | Admin panel — users, groups, posts, payments |

All pages use `'use client'` — no RSC data fetching patterns currently in use.

---

## 3. Registration Flow (New User)

```
1. POST /api/signup (email + password)
   → stores email in localStorage('verificationEmail')
   → stores partial token in localStorage('authToken')
   → router.push('/email-recovery')

2. POST /api/signup/verify-email (email + OTP)
   → stores verified token in localStorage('authToken')
   → router.push('/payment')

3. POST /api/payment/create (email + amount)
   → redirects browser to Stripe Checkout URL
   → on success, Stripe redirects back to /create-account

4. POST /api/profile (multipart: username, photo, gender, age_range, country_code)
   → stores final token in localStorage('authToken')
   → stores role in localStorage('userRole')
   → router.push('/dashboard' or '/admin')
```

---

## 4. Auth Flow (Returning User)

```
POST /api/signin (email + password + role)
  → extractToken() → localStorage('authToken')
  → extractRole() → localStorage('userRole')
  → role === 'Admin' → router.push('/admin')
  → role === 'User'  → router.push('/dashboard')
```

---

## 5. API Layer

All HTTP communication is centralized:

```
app/service/APIutils.tsx
  ├── API (Axios instance)
  │     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
  │     Request interceptor: auto-adds Authorization: Bearer <token>
  │     Response interceptor: clears localStorage on 401
  ├── extractToken(response) — finds token in nested response shapes
  ├── extractRole(response)  — normalizes role to 'Admin' | 'User'
  └── handleError(error)     — returns { success, message, status }

app/service/allApi.tsx
  ├── login()              POST /api/signup
  ├── otpVerify()          POST /api/signup/verify-email
  ├── swiftLogin()         POST /api/signin
  ├── createAccount()      POST /api/profile (multipart)
  ├── createPayment()      POST /api/payment/create
  ├── getCountryList()     GET  /api/countries
  ├── getAdminDashboard()  GET  /api/admin/dashboard
  ├── getAllUsers()         GET  /api/admin/users?type=all
  ├── getUserDetails()     GET  /api/admin/users/:id
  ├── getAllGroups()        GET  /api/admin/groups
  ├── getGroupMembers()    GET  /api/admin/groups/:id/members
  ├── getAllPosts()         GET  /api/admin/posts
  ├── deletePost()         DELETE /api/admin/posts/:id
  ├── updateUserStatus()   POST /api/admin/user/status/:id
  ├── getUnpaidAccess()    GET  /api/admin/unpaid-access
  ├── addUnpaidAccess()    POST /api/admin/unpaid-access/add
  └── removeUnpaidAccess() POST /api/admin/unpaid-access/remove
```

---

## 6. State Management

No global state manager. State flows:
- **Within a page:** `useState` (form fields, loading, toast, modal open/close)
- **Between pages:** `localStorage` (auth token, role, verification email)
- **Server data:** fetched on component mount via `useEffect` + API call

localStorage keys:
| Key | Value | Set by |
|-----|-------|--------|
| `authToken` | Bearer token string | login, signup, create-account |
| `userRole` | `'Admin'` or `'User'` | login, create-account |
| `verificationEmail` | email string | signup page |

---

## 7. Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Toast` | `app/components/Toast.tsx` | Auto-dismissing notification (success/error/info) |

---

## 8. Assets & Fonts

```
public/
  logo.png           — site logo
  signup1-5.png      — onboarding background images
  fonts/             — Built Titling font files (local)

app/layout.tsx — loads Geist Sans + Geist Mono via next/font/google
app/globals.css — @font-face for Built Titling, Tailwind base
```

---

## 9. Known Architectural Debt

| Issue | Location | Priority |
|-------|----------|----------|
| Admin page is 1535 lines — one massive component | `app/admin/page.tsx` | High |
| Mock data hardcoded in admin page | `app/admin/page.tsx` L40+ | High |
| No auth guard middleware — any URL is accessible without token | All pages | High |
| Dashboard page uses static/placeholder data | `app/dashboard/page.tsx` | Medium |
| No test suite configured | — | Medium |
| 8 npm vulnerabilities (3 moderate, 5 high) | `package-lock.json` | Medium |
| `admin/page.tsx.tmp` temp file committed to repo | root | Low |
| `fix_admin.ps1` and `fix_jsx.js` scripts not cleaned up | root | Low |
