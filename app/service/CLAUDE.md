# app/service

## Purpose
All HTTP communication with the ShiftBackend API lives here. Page components never call `axios` directly — they import named functions from `allApi.tsx`.

## Files

### APIutils.tsx
Axios instance and shared utilities.
- `API` — Axios instance with `baseURL` from `NEXT_PUBLIC_API_BASE_URL` env var
- **Request interceptor** — reads `authToken` or `token` from `localStorage`, adds `Authorization: Bearer <token>` header automatically
- **Response interceptor** — on 401, clears `authToken` and `userRole` from `localStorage`
- `extractToken(response)` — traverses common token paths in API responses (`response.token`, `response.data.token`, etc.)
- `extractRole(response)` — normalizes role string to `Admin` or `User`
- `handleError(error)` — returns `{ success: false, message, status }` from any Axios error

### allApi.tsx
One exported async function per API endpoint. Each function:
1. Calls `API.get/post/delete/put`
2. Returns `res.data` on success
3. Returns `handleError(error)` on failure — never throws

## Adding a New API Call
```ts
export const myNewCall = async (payload: { field: string }) => {
    try {
        const res = await API.post("/api/my-endpoint", payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};
```

## Rules
- All functions are async and return data or `handleError` shape — they never throw
- Never call `axios` directly in page components
- Multipart (file upload) calls must set `'Content-Type': 'multipart/form-data'` on the individual request
- No UI logic (no state, no router) inside service files
