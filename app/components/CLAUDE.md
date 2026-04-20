# app/components

## Purpose
Shared UI components used across multiple pages. Keep components small, focused, and reusable. No business logic here — components receive all data via props.

## Components

### Toast.tsx
Auto-dismissing notification banner.
- Props: `message`, `type` (`success | error | info`), `onClose`, `duration` (ms, default 5000)
- Renders fixed top-right, z-index 9999
- Auto-dismisses via `setTimeout` inside `useEffect`
- Colors: green = success, red = error, blue = info

**Usage pattern:**
```tsx
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
// show:
setToast({ message: 'Done!', type: 'success' });
// render:
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

## Rules
- Every new component must be in `app/components/`
- No `axios` calls inside components — receive data via props or call `allApi.tsx` functions
- No `localStorage` reads inside shared components — pass data as props from the page
- Export as `default` — one component per file
- File name matches the component name: `Toast.tsx` exports `Toast`
