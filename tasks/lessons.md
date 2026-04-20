# Lessons Learned
Rules added here prevent repeated mistakes. Each rule was born from an actual error.
Prune entries older than 30 days to `tasks/lessons-archive.md`.

---

## Code Patterns

- **Never call axios directly in page components.** All HTTP calls go through `app/service/allApi.tsx`. This keeps error handling and auth headers consistent.
- **Check `response?.success === false` before using response data.** The `handleError()` shape returns `{ success: false, message, status }` — don't assume a non-null response means success.
- **Don't read `localStorage` at the module level or during SSR.** Always read inside `useEffect` or event handlers. Next.js renders on the server first — `window` and `localStorage` are undefined there.
- **Toast state must be cleared before each new operation.** Call `setToast(null)` at the top of every handler to avoid stale messages showing.

## Common Pitfalls

- **`login()` in `allApi.tsx` calls `/api/signup`, not `/api/signin`.** The sign-in function is `swiftLogin()`. This naming mismatch has caused bugs — check function names carefully.
- **Role detection via email heuristic is fragile.** `email.includes('admin')` is the current approach in `/login`. It breaks for any non-obvious admin email. The API response role field should be the source of truth.
- **`verificationEmail` in localStorage may be missing.** The `/email-recovery` page falls back to a dummy email if it's not set — it should redirect to signup instead.
- **FormData key for photo is `image`, not `photo`.** The `createAccount()` API call uses `formData.append("image", payload.photo)`. Using any other key will silently fail on the backend.

## Frontend Design

- **All AI models default to generic templates** (Inter font, purple gradients, cards-in-cards). Always challenge the first design output with /critique before accepting.
- **Animations should have purpose.** Never animate just because you can. Every motion must communicate state change, guide attention, or provide feedback.
- **Dark mode is not "invert colors".** It requires separate consideration for contrast, shadows, and surface hierarchy.
- **The brand accent is lime-green (`#a3e635`).** Use it for primary CTAs and active states. Never replace it with generic blue or purple.

## Build / Tooling

- **Run `npm run build` before every push.** TypeScript errors that ESLint misses will be caught here. A passing lint does not guarantee a passing build.
- **`npm run lint` uses ESLint 9 with flat config.** The config file is `eslint.config.mjs` — not `.eslintrc`. Don't create an `.eslintrc` file.

## Security

- **Never log auth tokens.** Remove all `console.log` statements that print response objects before merging — they may expose tokens in browser DevTools.
- **Never commit `.env.local`.** It is git-ignored but double-check before `git add .`.
