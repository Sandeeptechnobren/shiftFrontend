# Deployment Log
All deployments are recorded here. Add a row for every production or staging deployment.

| Date | Branch | Environment | Result | Issues | Deployed By |
|------|--------|-------------|--------|--------|-------------|

---

## How to Add an Entry
After every deployment (successful or not), append a row:
```
| 2026-04-20 | feature/user/dashboard-api | production | ✅ Success | none | [name] |
| 2026-04-20 | hotfix/admin-crash         | production | ❌ Failed  | Build error — rolled back | [name] |
```

**Result values:** `✅ Success` / `⚠️ Partial` / `❌ Failed` / `🔄 Rolled Back`

## Pre-Deployment Checklist
- [ ] `npm run build` passes locally (zero TypeScript errors)
- [ ] `npm run lint` passes with no errors
- [ ] `.env.local` variables verified against `.env.example`
- [ ] Tested the changed pages manually in browser
- [ ] API base URL set correctly for target environment
- [ ] PR reviewed and approved

## Rollback Procedure
If a deployment breaks production:
1. Identify the last good commit: `git log --oneline`
2. Revert to last good build on your host (Vercel: instant rollback via dashboard)
3. Or: `git revert HEAD` → push → redeploy
4. Document the failure in this log
