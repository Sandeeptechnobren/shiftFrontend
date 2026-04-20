---
name: plan
description: Create a detailed implementation plan before coding
---
Create an implementation plan for: $ARGUMENTS

1. Read `docs/ARCHITECTURE.md` — understand the routing and data flow
2. Read `docs/PATTERNS.md` — identify which patterns apply
3. Read `docs/CODEBASE_AUDIT.md` — check for related known issues
4. Read `tasks/lessons.md` — check for relevant lessons
5. Read any files directly affected by the change

Write the plan to `tasks/todo.md` under "## In Progress" with these sections:

## Plan: [task name]
### Files to Change
(list each file and what changes — no new patterns without checking PATTERNS.md)

### New API Calls Needed
(list any new functions needed in allApi.tsx with endpoint + method)

### Component Structure
(for new pages: list useState hooks, useEffect hooks, and JSX sections)

### Risks
(TypeScript issues, breaking changes to localStorage shape, API contract changes)

### Steps
1. ...
2. ...

### Definition of Done
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Manual browser test passes
- [ ] CHANGELOG.md updated

Do NOT write any application code yet. Plan only.
