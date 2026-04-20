# Project Overview
ShiftFrontend is the web client for the Shift fitness platform — a Next.js 16 App Router application. It handles user registration, OTP verification, Stripe payment, profile creation, user dashboard, and a full admin panel. The primary clients are mobile users; this web layer serves registration, payment, and admin management. API communication targets the ShiftBackend Laravel REST API.

# Tech Stack
- **Framework:** Next.js 16.1.1 (App Router) / React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Icons:** Lucide React
- **HTTP:** Axios (custom instance in `app/service/APIutils.tsx`)
- **Fonts:** Geist Sans, Geist Mono (Google Fonts via `next/font`), Built Titling (local)
- **Linting:** ESLint 9 with `eslint-config-next`

# Architecture
All pages live under `app/` using Next.js App Router. Every page is a Client Component (`'use client'`). API calls go through the Axios instance in `app/service/APIutils.tsx` → route functions in `app/service/allApi.tsx` → page components. No global state manager — state is local to each page, passed via localStorage between steps. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

# Directory Structure
```
app/                    Next.js App Router root
  page.tsx              / — Sign-up entry (email + password)
  layout.tsx            Root layout (fonts, metadata)
  globals.css           Global Tailwind + custom font imports
  login/page.tsx        /login — Sign-in for existing users
  create-account/page.tsx  /create-account — Profile setup (username, photo, country)
  email-recovery/page.tsx  /email-recovery — OTP verification
  payment/page.tsx      /payment — Stripe subscription checkout
  dashboard/page.tsx    /dashboard — User step tracker + social feed
  admin/page.tsx        /admin — Admin panel (users, groups, posts, payments)
  components/           Shared UI components
    Toast.tsx           Notification toasts (success/error/info)
  service/              API layer
    APIutils.tsx        Axios instance, interceptors, token/role helpers
    allApi.tsx          All typed API call functions
public/                 Static assets (logo, signup images, fonts)
docs/                   Architecture, patterns, audit, deploy log
tasks/                  todo.md, lessons.md
```

# User Registration Flow
```
/ (signup)  →  POST /api/signup  →  localStorage(verificationEmail)
     ↓
/email-recovery  →  POST /api/signup/verify-email  →  localStorage(authToken)
     ↓
/payment  →  POST /api/payment/create  →  Stripe Checkout redirect
     ↓
/create-account  →  POST /api/profile (multipart)  →  localStorage(authToken, userRole)
     ↓
/dashboard or /admin (based on role)
```

# Key Commands
```bash
npm run dev        # start Next.js dev server on http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (eslint-config-next)
```

# Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=   # ShiftBackend API root (default: https://api.easycoders.in/projects/shift_backend/public)
```
Create `.env.local` for local overrides — never commit it.

# Coding Conventions
- **All pages are Client Components** — every `app/**/page.tsx` has `'use client'` at the top
- **API calls:** always via `app/service/allApi.tsx` functions — never call `axios` directly in components
- **Error handling:** all API functions return `handleError(error)` shape `{ success, message, status }`
- **Auth token:** stored in `localStorage` under key `authToken`; `APIutils` interceptor adds it automatically
- **Role:** stored in `localStorage` under key `userRole` (normalized to `Admin` or `User`)
- **Loading state:** use `useState<boolean>` + disable buttons + show `<Loader2>` spinner during async ops
- **Toast notifications:** use the `<Toast>` component — never use `alert()` or `console.error` for user-visible errors
- **TypeScript:** strict mode enabled — no `any` in new code; use proper interfaces
- **File names:** `PascalCase` for components, `camelCase` for utilities

# Patterns
See [docs/PATTERNS.md](docs/PATTERNS.md) for: API call pattern, form submission pattern, toast usage, auth guard, localStorage conventions, multipart upload, and component structure.

# Testing
- No test suite currently configured
- Run `npm run build` to catch TypeScript and import errors before pushing
- Run `npm run lint` before every PR

# Task Management
- Before starting work, write plan to `tasks/todo.md`
- Track progress by marking items complete
- After ANY correction or mistake, update `tasks/lessons.md` with a rule
- After completing work, add an entry to `CHANGELOG.md`

# Git Workflow
- Always create a feature branch: `feature/[your-name]/[short-description]`
- Never commit directly to main
- Every PR must describe what changed and why
- Run `npm run build && npm run lint` before pushing
- Request review from at least one team member

# Important Rules
- NEVER modify code without an approved plan
- NEVER call axios directly in page components — use `app/service/allApi.tsx`
- NEVER store sensitive data beyond auth token in localStorage (no passwords, no PII)
- NEVER commit `.env.local` or any file containing real API keys
- ALWAYS run `npm run build` before pushing — catches TS errors CI would catch
- Do not touch: `node_modules/`, `.next/`, `public/fonts/`

# Frontend Design Rules (Impeccable)
- For ANY frontend/UI work, run /audit after /review and /polish before final commit
- Never use Inter, Arial, Roboto, or system fonts as primary typeface — pick distinctive fonts
- Never use pure gray — always tint neutrals toward the brand color
- Never nest cards inside cards
- Never use gray text on colored backgrounds — check contrast
- Never use purple gradients as default — commit to a project-specific color palette
- Never use bounce/elastic easing — it feels dated
- See .claude/skills/impeccable/ for full design reference

# Subdirectory Docs
| Directory | CLAUDE.md |
|---|---|
| `app/components/` | [CLAUDE.md](app/components/CLAUDE.md) |
| `app/service/` | [CLAUDE.md](app/service/CLAUDE.md) |

# Context Window Budget
- Root `CLAUDE.md`: under 150 lines
- Each subdirectory `CLAUDE.md`: under 60 lines
- `tasks/lessons.md`: prune entries older than 30 days to an archive file
- `.claudeignore`: keeps `.next/`, `node_modules/`, lock files, and build output out of context
- One task per session — start fresh, don't carry over context from previous tasks
