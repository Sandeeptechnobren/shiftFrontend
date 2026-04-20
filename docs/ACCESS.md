# Access & Credentials Guide

How to get everything you need to work on ShiftFrontend.

---

## 1. Repository Access
- **Repo:** https://github.com/Sandeeptechnobren/shiftFrontend
- Ask the tech lead to add your GitHub account as a collaborator

## 2. Environment Setup

Create `.env.local` in the project root (never commit this file):

```bash
# ShiftBackend API URL
NEXT_PUBLIC_API_BASE_URL=https://api.easycoders.in/projects/shift_backend/public

# For local development against local backend:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

`.env.local` is listed in `.gitignore` — it will never be committed.

## 3. Local Development

```bash
git clone https://github.com/Sandeeptechnobren/shiftFrontend.git
cd shiftFrontend
npm install
cp .env.example .env.local      # then fill in values
npm run dev                      # http://localhost:3000
```

## 4. Test Accounts

Ask the tech lead for:
- A test **User** account (email + password)
- A test **Admin** account (email + password)

Admin detection is currently based on the email containing "admin" — use an email like `admin@shift.com` for admin access.

## 5. Stripe (Payment)
- Payment flow uses the ShiftBackend Stripe integration — no Stripe keys needed in frontend
- `POST /api/payment/create` returns a Stripe Checkout URL — the frontend just redirects
- For local payment testing, ask the backend team for a Stripe test session

## 6. Production Deployment
- **Hosting:** TBD (Vercel or similar static host recommended)
- **Build:** `npm run build` → `npm run start`
- See `docs/DEPLOY_LOG.md` for deployment history

## 7. Git Workflow
- Branch: `feature/[your-name]/[description]`
- Never push directly to `main`
- PR → review → merge

## 8. Key Contacts
| Role | Contact |
|------|---------|
| Tech Lead | [fill in] |
| Backend Team | shiftBackend repo |
