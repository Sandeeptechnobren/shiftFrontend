---
name: review
description: Review recent changes for bugs, TypeScript issues, and style violations
---
Review the recent changes to this frontend codebase.

1. Run: `git diff HEAD~1 --name-only` to see changed files
2. Run: `git diff HEAD~1` to read the actual changes
3. Run: `npm run build` — report any TypeScript or build errors
4. Run: `npm run lint` — report any lint errors

Check for these issues in the changed code:

**API / Data flow:**
- [ ] All API calls go through `allApi.tsx` — no direct `axios` calls in components
- [ ] `response?.success === false` is checked before using response data
- [ ] `handleError()` shape respected: `{ success, message, status }`

**React / Next.js:**
- [ ] `'use client'` present on all page and component files
- [ ] No `localStorage` reads at module level — only inside `useEffect` or handlers
- [ ] No missing dependency arrays in `useEffect`
- [ ] Loading state set to `false` in `finally` block

**TypeScript:**
- [ ] No `any` types in new code (use `unknown` in catch blocks)
- [ ] All event handlers properly typed

**UX:**
- [ ] Every async operation has loading state + disabled button
- [ ] All user-facing errors shown via `<Toast>` — no `alert()`
- [ ] `setToast(null)` called at start of each handler

**Security:**
- [ ] No tokens or PII in `console.log` statements
- [ ] No hardcoded credentials or API keys

Report: list of issues found (or "No issues found") with file:line references.
