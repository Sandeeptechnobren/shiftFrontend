# app/payment/

## Purpose
Stripe Checkout entry page at `/payment`. Calls `POST /api/payment/create` to create a Stripe Checkout session on the backend, then redirects the browser to the returned `payment_url`. The frontend never sees Stripe credentials — all Stripe logic is server-side.

## Key files
- `page.tsx` — pricing display, "Proceed to payment" CTA, redirect logic; footer "Powered by Stripe" at L156

## Data flow
```
Page mounts → display subscription price
User clicks pay
  ↓ createPayment({ email, otp, amount })        — app/service/allApi.tsx
  ↓ API.post('/api/payment/create')
  ↓ Laravel PaymentController → Stripe\Checkout\Session::create(...)
  ↓ returns { payment_url: 'https://checkout.stripe.com/...' }
  ↓ window.location.href = response.payment_url   (full-page redirect)

(Stripe handles checkout)
  ↓ on success: Stripe redirects to /create-account
  ↓ on cancel:  Stripe redirects to /payment/cancel
```

## Dependencies
- **Imports from**: `app/service/allApi.tsx` (`createPayment`, `getSubscriptionFee`), `app/components/Toast.tsx`, `next/navigation`
- **Depended on by**: redirected to from `app/email-recovery/page.tsx` after OTP success
- **Backend contract**: `POST /api/payment/create` (issues Stripe session); backend `STRIPE_KEY`/`STRIPE_SECRET` env required

## Conventions
- `'use client'` at top
- **Never** import the Stripe SDK on the client — only use the redirect URL
- Use `window.location.href` (not `router.push`) for the Stripe redirect — it's an external host
- Subscription pricing comes from `GET /api/subscription-fee`, not hardcoded

## Common commands
```bash
npm run dev      # http://localhost:3000/payment
npm run build
```
