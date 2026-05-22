# app/email-recovery/

## Purpose
OTP verification page at `/email-recovery`. Reads `verificationEmail` from `localStorage` (set during signup), accepts a 4-digit OTP, and verifies it against `POST /api/signup/verify-email`. On success, stores the returned auth token and routes to `/payment`.

## Key files
- `page.tsx` — 4-digit OTP input UI, verify handler, resend logic

## Data flow
```
Page mounts
  ↓ const email = localStorage.getItem('verificationEmail')
User enters 4-digit OTP and submits
  ↓ otpVerify({ email, otp })           — app/service/allApi.tsx
  ↓ API.post('/api/signup/verify-email')
  ↓ Laravel AuthController checks Redis OTP (key: otp:shift:signup:{email})
  ↓ on success: { token, user } returned
  ↓ extractToken(response) → localStorage.setItem('authToken', token)
  ↓ router.push('/payment')
```

## Dependencies
- **Imports from**: `app/service/allApi.tsx` (`otpVerify`), `app/service/APIutils.tsx` (`extractToken`), `app/components/Toast.tsx`, `next/navigation`
- **Depended on by**: redirected to from `app/page.tsx` (signup entry)
- **Backend contract**: `POST /api/signup/verify-email` — Laravel verifies the Redis-stored OTP from `app/Http/Controllers/AuthController.php`

## Conventions
- `'use client'` at top
- OTP TTL is 10 minutes (set by backend `Redis::setex(..., 600, ...)`) — show resend button after expiry
- Toast on incorrect OTP; never reveal whether the email exists
- Reads `verificationEmail` from localStorage — guard against missing value

## Common commands
```bash
npm run dev      # http://localhost:3000/email-recovery
npm run build
```
