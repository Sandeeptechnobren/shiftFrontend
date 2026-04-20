---
name: done
description: Wrap up current task — verify build, update changelog, tasks, and docs
---
The current task is complete. Wrap it up properly.

1. VERIFY BUILD:
   Run: `npm run build`
   If fails → STOP. Fix errors before continuing.
   Run: `npm run lint`
   If fails → STOP. Fix lint errors before continuing.

2. UPDATE CHANGELOG.md:
   Add entry under `## [Unreleased]`:
   `- [today's date] [description of what was done]`

3. UPDATE tasks/todo.md:
   - Mark completed items with `[x]`
   - Move them to the Completed section
   - Clear "In Progress"

4. UPDATE DOCUMENTATION (if code changed):
   - Run the `doc-updater` agent or manually update:
     - `docs/ARCHITECTURE.md` if routing or API surface changed
     - `docs/CODEBASE_AUDIT.md` if known issues were resolved
     - Relevant `CLAUDE.md` files if new components or API functions added

5. LESSONS:
   If any mistakes were made during this task, add them to `tasks/lessons.md`

6. COMMIT:
   Stage only the changed application + doc files (never `node_modules/`, `.next/`, `.env.local`)
   Commit message format: `feat: ...` / `fix: ...` / `refactor: ...` / `docs: ...`

7. PUSH & PR:
   Push to the feature branch.
   Open a PR on GitHub with a clear description.
   Request at least one reviewer.
