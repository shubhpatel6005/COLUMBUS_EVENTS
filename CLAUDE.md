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

## Design direction — "Chattahoochee Current"
Kinetic, outdoor-adventure register built around the Chattahoochee whitewater
course and RiverWalk.

- Colors (defined as CSS custom properties in `app/globals.css`, both raw
  palette vars and remapped shadcn semantic tokens):
  - River Navy `#0B2E3D` — dark background / `.dark` mode base
  - Foam White `#F5F7F6` — light background / text-on-navy
  - Rapids Teal `#1E6B75` — secondary actions, links, focus ring (light mode)
  - Brass `#C99A3D` — accent, headline highlight on navy, focus ring (dark mode)
  - Signal Crimson `#D62839` — primary CTA buttons
  - Ink Slate `#1B1F22` — body copy on Foam White
  - Utility classes available directly: `bg-river-navy`, `text-foam-white`,
    `text-rapids-teal`, `bg-brass`, `bg-signal-crimson`, `text-ink-slate`,
    plus the standard shadcn semantic tokens (`bg-primary`, `bg-secondary`,
    `bg-accent`, etc.) which are remapped to this palette.
- Typefaces: display = **League Spartan** (`font-heading`, CSS var
  `--font-league-spartan`), body = **Inter** (`font-sans`, CSS var
  `--font-inter`). Both wired via `next/font/google` in `app/layout.tsx`.
- Layout concept: a single vertical "riverbank" scroll — content blocks
  alternate left/right of a persistent vertical line down the page.
- Signature element: a continuous hand-drawn-style river contour line
  (traced from the real bends of the Chattahoochee whitewater course),
  rendered as a thin SVG stroke that runs behind the hero headline and
  through every section divider. This is the one motif that should recur
  everywhere — don't introduce a competing divider style.
- Avoid: cream+terracotta, black+neon-green, numbered "01/02/03" markers,
  gradient blobs, stock "hands together" imagery.
