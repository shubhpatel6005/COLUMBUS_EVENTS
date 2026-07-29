@AGENTS.md

# Columbus Community Events

## What this is
A single-page site for community events in Columbus, GA, run by a registered
nonprofit/community group. Sections: Home, About, Event Pictures, Sponsorship,
Donate, Contact. Plus a few real routes that need their own URL: `/privacy`,
`/terms`, `/events/[slug]`. Audience: local residents 25-65, mostly on
phones, often on slow connections.

## Confirmed decisions
- Location: Columbus, Georgia (not OH/IN/MS).
- Org type: registered nonprofit/community group — donations, not ticketing.
- Gallery: Google Drive folder managed manually by the org, no visitor uploads.
- Donations: Stripe Checkout (custom code, not a Givebutter/Donorbox embed).

## Rules
- TypeScript strict. No `any`.
- Server Components by default. `"use client"` only for interactivity.
- All API routes validate input with Zod before doing anything.
- Never log or expose secrets. Never put a Drive file ID in a public URL
  without checking it belongs to the allowed folder.
- Every image uses next/image with explicit width/height.
- Mobile-first. Test at 375px before anything else.
- Accessibility floor: visible keyboard focus, semantic landmarks, alt text
  on every image, `prefers-reduced-motion` respected.
- Do not add dependencies without saying why.
- Never trust a donation amount sent from the browser — validate server-side
  (min/max bounds) in the Stripe checkout route.
- The Drive photo proxy route must verify a file's parent folder matches
  `DRIVE_FOLDER_ID` before serving it — do not build an open proxy.
- Build one section per session. Don't build multiple sections in one pass.

## Commands
- `npm run dev` — dev server
- `npm run build` — must pass before any commit
- `npm run lint`

## Design direction
[fill this in after the design-direction session — see build plan Phase 2]
