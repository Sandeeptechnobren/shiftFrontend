---
name: split-page
description: Split a large monolithic page into sub-components
---
Split the large page file described in $ARGUMENTS into properly scoped components.

The admin page (`app/admin/page.tsx` at 1535 lines) is the primary candidate for this.

1. Read the target file fully
2. Read `docs/PATTERNS.md` for component conventions
3. Read `app/components/CLAUDE.md` for component rules

IDENTIFY NATURAL SPLIT POINTS:
- Each tab/section that is self-contained (its own state + render)
- Each modal that has its own open/close state
- Each repeated list item that renders consistently

PLAN (do not code yet):
For each proposed component:
- Name: `ComponentName.tsx` (PascalCase)
- Location: `app/components/ComponentName.tsx`
- Props interface: list what it needs from the parent
- Local state: list what useState hooks move into it
- API calls: does it call any allApi functions directly?

Show the full component plan, confirm with the user, then implement one component at a time.

After each component:
1. Move it to `app/components/ComponentName.tsx`
2. Import and use it in the parent page
3. Run `npm run build` — confirm no TypeScript errors
4. Confirm the page still renders correctly before moving to the next component
