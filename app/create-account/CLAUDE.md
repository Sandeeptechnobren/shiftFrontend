# app/create-account/

## Purpose
Profile-setup page at `/create-account` — final step of the registration flow. Collects username, photo, gender, age range, and country, then POSTs `multipart/form-data` to `/api/profile`. Reached after Stripe Checkout returns successfully.

## Key files
- `page.tsx` — multipart form, country picker (uses `Country` interface), file-upload field for the profile photo

## Data flow
```
User completes form (username, photo, gender, age_range, country_code)
  ↓ createAccount(payload)                     — app/service/allApi.tsx
  ↓ FormData.append + API.post('/api/profile') — multipart, Axios sets Content-Type
  ↓ Laravel /api/profile → ProfileController@store → ProfileService::store()
       → image stored to storage/app/public/profile-images/
       → UserProfile::create(...)
  ↓ extractToken(response) → localStorage.setItem('authToken', token)
  ↓ extractRole(response)  → localStorage.setItem('userRole', role)
  ↓ router.push('/login')
```

## Dependencies
- **Imports from**: `app/service/allApi.tsx` (`createAccount`, `getCountryList`), `app/service/APIutils.tsx` (`extractToken`, `extractRole`), `app/components/Toast.tsx`, `lucide-react`, `next/navigation`
- **Local interface**: `Country { name, code, flag }` (declared inline in `page.tsx`)
- **Depended on by**: redirected to from Stripe Checkout success URL
- **Backend contract**: `POST /api/profile` (multipart) — see backend `app/Services/ProfileService.php`

## Conventions
- `'use client'` at top
- File field key is `'image'` (matches Laravel `$request->file('image')`) per `shiftFrontend/docs/PATTERNS.md §6`
- Country list fetched via `getCountryList()` on mount
- Toast on any non-2xx response

## Common commands
```bash
npm run dev      # http://localhost:3000/create-account
npm run build
```
