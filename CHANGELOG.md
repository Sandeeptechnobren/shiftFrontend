# Changelog
All notable changes to ShiftFrontend are documented here.
Format: `[DATE] [AUTHOR] Description`

---

## [Unreleased]

## [0.1.0] — 2026-04-20
### Added
- 2026-04-20 Claude Code Initial documentation layer: CLAUDE.md, docs/, tasks/, .claude/

## [0.0.1] — Initial Commit
### Added
- Next.js 16 App Router project scaffolding
- Sign-up page (`/`) — email + password → POST /api/signup
- OTP verification page (`/email-recovery`) — POST /api/signup/verify-email
- Payment page (`/payment`) — Stripe checkout integration
- Create account page (`/create-account`) — profile setup with photo upload
- Login page (`/login`) — POST /api/signin with role detection
- Dashboard page (`/dashboard`) — user step tracker UI
- Admin panel (`/admin`) — user/group/post/payment management
- Toast notification component (`app/components/Toast.tsx`)
- Centralised API layer (`app/service/APIutils.tsx`, `app/service/allApi.tsx`)
- Tailwind CSS 4 + Geist fonts + Built Titling custom font
