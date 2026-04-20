---
name: security
description: Run a frontend security audit
---
Run a security audit of the ShiftFrontend codebase.

1. AUTH & TOKENS:
   - Search for any hardcoded tokens or API keys: `grep -r "Bearer " app/ --include="*.tsx"`
   - Confirm token is read from localStorage only in `APIutils.tsx` interceptor
   - Confirm no token is passed as a URL query parameter

2. ROUTE PROTECTION:
   - Check if `app/middleware.ts` exists — if not, flag: no server-side route guard
   - Check each authenticated page for `useEffect` auth guard redirecting to `/login`
   - List pages that have NO auth guard

3. SENSITIVE DATA IN LOGS:
   - Search: `grep -rn "console.log" app/ --include="*.tsx"`
   - Flag any that print response objects (may contain tokens or PII)

4. ENVIRONMENT VARIABLES:
   - Confirm no `NEXT_PUBLIC_` variable exposes secrets (NEXT_PUBLIC_ vars are visible in browser)
   - Confirm `.env.local` is in `.gitignore`

5. XSS:
   - Search for `dangerouslySetInnerHTML`: `grep -rn "dangerouslySetInnerHTML" app/`
   - Flag any usage — ensure content is sanitised

6. NPM VULNERABILITIES:
   - Run: `npm audit`
   - Report counts by severity and top packages affected

7. DEPENDENCY CHECK:
   - Run: `npm outdated`
   - Flag any packages with security implications that are outdated

Report all findings with file:line references and severity (P1/P2/P3).
P1 = exploitable now, P2 = architectural risk, P3 = best practice violation.
