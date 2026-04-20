---
name: status
description: Daily team status digest — git activity, tasks, and build health
---
Generate a status digest for ShiftFrontend.

1. GIT ACTIVITY:
   Run: `git log --oneline -10`
   Run: `git branch -a`
   Run: `git status`

2. TASK STATUS:
   Read `tasks/todo.md` — summarise In Progress and Planned items

3. BUILD HEALTH:
   Run: `npm run build 2>&1 | tail -20`
   Report: pass or fail + error count

4. RECENT LESSONS:
   Read `tasks/lessons.md` — list the last 3 entries

5. AUDIT DEBT:
   Read `docs/CODEBASE_AUDIT.md §5` — list open P1 items

6. REPORT FORMAT:
```
## ShiftFrontend Status — [date]

### Git
- Branch: [current]
- Last commit: [hash] [message]
- Uncommitted changes: [yes/no]

### Tasks
- In Progress: [list or none]
- Planned: [list or none]

### Build
- Status: ✅ Pass / ❌ Fail

### Open P1 Issues
[from CODEBASE_AUDIT.md]
```
