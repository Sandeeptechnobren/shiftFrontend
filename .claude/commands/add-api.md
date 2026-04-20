---
name: add-api
description: Add a new API call and wire it to a page component
---
Add the API integration described in $ARGUMENTS.

1. Read `app/service/allApi.tsx` — understand existing patterns
2. Read `app/service/APIutils.tsx` — understand `handleError` shape
3. Read `docs/PATTERNS.md §2` (API call pattern)
4. Read the page file that will consume this API call

STEP 1 — Add to allApi.tsx:
```ts
export const myNewCall = async (payload: { field: string }) => {
    try {
        const res = await API.get/post(`/api/endpoint`, payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};
```
- Method: match the backend endpoint method (GET/POST/DELETE)
- Payload: define a proper TypeScript interface
- Response: note the shape returned by the backend

STEP 2 — Wire into the page component:
- Import the new function
- Add `useState` for the data and loading state
- Call in `useEffect` (for data fetching) or handler (for mutations)
- Check `response?.success === false` before using data
- Show `<Toast>` for errors

STEP 3 — Verify:
- Run `npm run build` — confirm no TypeScript errors
- Test in browser — confirm data loads/submits correctly

STEP 4 — Update docs:
- Add the new function to `app/service/CLAUDE.md`
- Add to `docs/ARCHITECTURE.md §5` API layer map
