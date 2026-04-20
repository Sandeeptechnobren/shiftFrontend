---
name: test
description: Run build and lint checks — no test suite configured yet
---
ShiftFrontend has no automated test suite yet. Run the available checks:

1. TYPE CHECK / BUILD:
   Run: `npm run build`
   Report: success or list of TypeScript/build errors with file:line

2. LINT:
   Run: `npm run lint`
   Report: success or list of ESLint violations with file:line

3. MANUAL SMOKE TEST CHECKLIST:
   (Run these manually in the browser at http://localhost:3000)
   - [ ] `/` — sign-up form renders, submit shows loading spinner
   - [ ] `/login` — login form renders, submit shows loading spinner
   - [ ] `/email-recovery` — OTP input renders, countdown timer starts
   - [ ] `/payment` — premium card renders
   - [ ] `/create-account` — form renders, country dropdown loads from API
   - [ ] `/dashboard` — page renders without JS errors
   - [ ] `/admin` — page renders without JS errors (requires admin token in localStorage)

4. REPORT FORMAT:
```
Build: ✅ Pass / ❌ [N errors]
Lint:  ✅ Pass / ❌ [N errors]
Manual: [checklist results]
```

NOTE: If you are adding a new feature, also write a plan to add Jest + React Testing Library in a future task.
