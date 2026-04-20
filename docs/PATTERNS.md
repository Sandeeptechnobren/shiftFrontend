# ShiftFrontend — Code Patterns & Style Guide

> **Date:** 2026-04-20
> Every pattern below has a real file-path example.

---

## 1. Page Component Structure

Every page follows this layout:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { someApiCall } from '../service/allApi';
import { extractToken } from '../service/APIutils';
import Toast from '../components/Toast';

export default function MyPage() {
    // 1. Hooks
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // 2. Side effects
    useEffect(() => { /* fetch on mount */ }, []);

    // 3. Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);
        try {
            const response = await someApiCall(payload);
            if (response?.success === false) {
                setToast({ message: response.message, type: 'error' });
                return;
            }
            // success path
        } catch {
            setToast({ message: 'An unexpected error occurred', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // 4. Render
    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <form onSubmit={handleSubmit}>
                {/* ... */}
            </form>
        </>
    );
}
```

Real example: `app/login/page.tsx`, `app/create-account/page.tsx`

---

## 2. API Call Pattern

All API functions live in `app/service/allApi.tsx`. They always:
- Accept a typed payload
- Return `res.data` on success
- Return `handleError(error)` on failure (never throw)

```ts
// allApi.tsx
export const myEndpoint = async (payload: { id: number }) => {
    try {
        const res = await API.get(`/api/resource/${payload.id}`);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

// page.tsx — check for failure before using data
const response = await myEndpoint({ id: 5 });
if (response?.success === false) {
    setToast({ message: response.message, type: 'error' });
    return;
}
// use response.data here
```

---

## 3. Toast Notification Pattern

```tsx
// State declaration (top of component)
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

// Show a toast
setToast({ message: 'Profile saved!', type: 'success' });
setToast({ message: response.message || 'Failed', type: 'error' });

// Render (at top of JSX return, before main content)
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

NEVER use `alert()` for user-facing messages.

Real example: `app/login/page.tsx` L8, L50, L110

---

## 4. Loading State Pattern

```tsx
const [loading, setLoading] = useState(false);

// In handler:
setLoading(true);
try {
    await someApiCall();
} finally {
    setLoading(false);
}

// In JSX — disable button and show spinner:
<button type="submit" disabled={loading}>
    {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
</button>
```

Real example: `app/login/page.tsx` L13, L90-95

---

## 5. localStorage Conventions

```ts
// Writing
localStorage.setItem('authToken', token);
localStorage.setItem('userRole', role);        // Always 'Admin' or 'User'
localStorage.setItem('verificationEmail', email);

// Reading (always guard against null)
const token = localStorage.getItem('authToken');
if (!token) { router.push('/login'); return; }

// Clearing on logout
localStorage.removeItem('authToken');
localStorage.removeItem('userRole');
```

Do NOT read `localStorage` during SSR — always inside `useEffect` or event handlers.
The Axios interceptor in `APIutils.tsx` reads the token for every request automatically.

---

## 6. Multipart (File Upload) Pattern

```tsx
const formData = new FormData();
formData.append('username', payload.username);
if (payload.photo) formData.append('image', payload.photo);  // key = 'image'

const res = await API.post('/api/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
```

Real example: `app/service/allApi.tsx` → `createAccount()`

---

## 7. Auth Guard Pattern

Currently there is no middleware-level auth guard. Until one is added, protect sensitive pages at the top of the component:

```tsx
useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/login');
    }
}, [router]);
```

> **TODO:** Add a Next.js middleware at `app/middleware.ts` to redirect unauthenticated requests to `/login` before the page renders. See `docs/ARCHITECTURE.md §9`.

---

## 8. Role-Based Redirect Pattern

```tsx
const role = extractRole(response);
localStorage.setItem('userRole', role ?? 'User');

if (role === 'Admin') {
    router.push('/admin');
} else {
    router.push('/dashboard');
}
```

Real example: `app/login/page.tsx` L55-65

---

## 9. Adding a New Page

1. Create `app/[route]/page.tsx` with `'use client'` at top
2. Add the API functions it needs to `app/service/allApi.tsx`
3. Use `Toast` for all user-facing feedback
4. Add auth guard `useEffect` if the page requires login
5. Add the route to `docs/ARCHITECTURE.md §2`

---

## 10. TypeScript Conventions

- All API payload/response shapes should have explicit interfaces
- No `any` in new code — use `unknown` in catch blocks
- All event handlers typed: `(e: React.FormEvent)`, `(e: React.ChangeEvent<HTMLInputElement>)`
- Use `useState<Type | null>(null)` for nullable state

---

## 11. Tailwind CSS Conventions

- Tailwind 4 is used via `@tailwindcss/postcss` — utility classes work as normal
- Custom CSS goes in `app/globals.css` only — no inline `style={}` for anything Tailwind can handle
- Dark mode: controlled by `@media (prefers-color-scheme: dark)` in `globals.css`
- Brand accent: lime-green (`#a3e635` / `lime-400`) — used for walking man icon, CTAs
