---
name: explore
description: Explore and explain a page or component without writing code
---
Explore the module or feature described in $ARGUMENTS.

1. Read the relevant file(s) in `app/`
2. Read `app/service/allApi.tsx` for any API calls it uses
3. Read `docs/ARCHITECTURE.md` for context
4. Explain:
   - What this page/component does and its place in the user flow
   - What API endpoints it calls and what data it expects
   - What state it manages (useState hooks)
   - Any known issues from `docs/CODEBASE_AUDIT.md`
   - What would need to change if $ARGUMENTS were modified

Do NOT modify any code. Provide a clear, concise explanation only.
