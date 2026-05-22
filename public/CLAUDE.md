# public/

## Purpose
Static assets served directly at the root URL by Next.js (no build step — files are copied as-is). Contains the active brand assets plus a substantial amount of dead/orphaned files left from earlier iterations (audit R13).

## Key files (actually referenced)
- `logo.png` (2.12 MB) — canonical brand logo. Used by `app/dashboard/page.tsx:160,220` and as favicon meta in `app/layout.tsx:19`
- `signup5.png` — used by `app/page.tsx:202` and `app/login/page.tsx:221` as the signup hero image
- `favicon.ico` is in `app/` not here — `app/layout.tsx` references `/logo.png` for favicon

## Key files (committed but unused — audit R13 cleanup candidates, ~63 MB total)
- `signup1.png` (20 MB), `signup2.png` (17 MB), `signup3.png` (20 MB) — never imported anywhere
- `dark-logo.png`, `light-logo.png` (2.12 MB each, byte-identical to `logo.png`) — never imported
- `Shift Logo.svg` — never imported; redundant with the inline `<Logo>` SVG at `app/admin/page.tsx:101-110`
- `back.jpeg`, `main.jpeg`, `white.jpeg` — added with the logo refresh commit, not imported
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — `create-next-app` boilerplate, not imported

## Data flow
```
Browser → request /<filename>
  → Next.js serves directly from public/
  → No build step, no optimization unless using <Image src="/x.png" />
```

## Dependencies
- **Depends on:** nothing
- **Depended on by:** `app/dashboard/page.tsx`, `app/page.tsx`, `app/login/page.tsx`, `app/layout.tsx` — most files in this folder have NO inbound reference

## Conventions
- Reference public assets with absolute paths (`/logo.png`), not relative
- Use `<Image src="/x.png" .../>` from `next/image` for non-trivial images (optimisation + lazy load)
- New large images go through compression first — `signup1-3.png` are ~57 MB combined for no reason
- **Cleanup pending** — audit R13 lists ~63 MB of unused assets ready to remove in a dedicated PR

## Common commands
```bash
ls -lhS public/    # see assets sorted by size — run before adding anything large
```
