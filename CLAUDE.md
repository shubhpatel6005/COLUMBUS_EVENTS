@AGENTS.md

# Columbus Community Events

## What this is
A single-page site for **Columbus Indian Community Events, Inc.**, a
Columbus, GA nonprofit that hosts free, inclusive Indian cultural events
(e.g. Navratri, the Uttrayan kite-flying festival) funded by donors. Sections:
Home, About, Event Pictures, Sponsorship, Donate, Contact. Plus a few real
routes that need their own URL: `/privacy`, `/terms`, `/events/[slug]`.
Audience: local residents 25-65, mostly on phones, often on slow connections.

## Confirmed decisions
- Location: Columbus, Georgia (not OH/IN/MS).
- Org: Columbus Indian Community Events, Inc. — registered nonprofit,
  donations not ticketing.
- Gallery: Google Drive folder managed manually by the org, no visitor uploads.
- Donations: Stripe Checkout (custom code, not a Givebutter/Donorbox embed).

## Open branding question
The site's generic "Columbus Events" nav brand, hero headline ("Where the
Rapids Meet the Riverwalk"), and page metadata title predate knowing the
org is specifically Indian-cultural-events-focused. Haven't touched these
yet — ask before rewriting the hero/nav copy or metadata to reference Indian
culture/festivals specifically, since that's a bigger identity change than
a content-file edit.

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

## Content TODOs (must be filled before launch)
- `content/about.ts` — org name, mission, and "who runs it" are now real:
  **Columbus Indian Community Events, Inc.**, a Columbus, GA nonprofit
  hosting free Indian cultural events (Navratri, Uttrayan kite festival,
  etc.), donor-funded. Only the stats (events held, attendees, volunteers,
  founding year) are still bracketed placeholders.
- `content/sponsors.ts` — confirm real tier names/prices/perks (currently
  example placeholders, same bracketed/highlighted treatment as About) and
  add real sponsor logos to `currentSponsors` once secured. Also need a real
  sponsor deck PDF — the Sponsorship section currently just says "coming
  soon" instead of linking to one.
- `content/donate.ts` — confirm the org's actual tax-exempt status (are
  donations tax-deductible or not?) and replace the placeholder disclaimer.
  This is a compliance matter (see the plan's Georgia Charitable
  Solicitations Act note), not just copy — don't guess at it.
- `content/contact.ts` — confirm a real response-time commitment and, if
  there's a public office, a real address. No social links or map embed were
  added since there's no confirmed address/accounts yet — add them once real.
- `content/events.ts` — replace the single example event with real upcoming
  events (title, description, start/end time with UTC offset, location).
  Drives the "Upcoming Events" homepage teaser, the `/events/[slug]` pages,
  their JSON-LD Event schema, dynamic OG images, and .ics/Google Calendar
  links — currently all placeholder-marked since no real event is confirmed.

## External service setup still needed
- **Stripe** (donations): needs a real Stripe account, `STRIPE_SECRET_KEY`,
  and a webhook endpoint registered against the deployed URL for
  `STRIPE_WEBHOOK_SECRET`. Code is built and validates amounts server-side
  (min $1 / max $10,000) but is untested against a live Stripe account.
- **Google Drive** (gallery): needs the Cloud project + service account +
  shared Drive folder from the plan's Phase 3 Step 1, then
  `GOOGLE_CLIENT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `DRIVE_FOLDER_ID`.
- **Resend** (contact form + donation receipts + newsletter): needs
  `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, a verified
  sending domain (SPF/DKIM) or mail lands in spam, and `RESEND_AUDIENCE_ID`
  (create an Audience in the Resend dashboard) for the newsletter signup bar.
- **Cloudflare Turnstile** (contact form spam protection): needs
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`. The widget and
  server verification both currently no-op (fail open) when unset — the
  contact form works but has no bot challenge until these are added.
- **Upstash Redis** (contact form rate limiting): needs
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Rate limiting
  fails open (unlimited submissions) when unset, per `lib/rate-limit.ts`.

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
