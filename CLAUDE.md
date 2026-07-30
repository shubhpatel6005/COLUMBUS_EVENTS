@AGENTS.md

# Columbus Indian Community Events

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

- Design direction: **Marigold Bloom** (see below) — deep violet + marigold
  + terracotta, Playfair Display serif, full-bleed split image/text hero.
  Replaced the earlier "Chattahoochee Current" river theme once the org's
  real identity (Indian cultural nonprofit) was known.

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
- `content/about.ts` is **done** — real final copy (org intro + donor/invite
  paragraph), no placeholders left. Nothing to track here anymore.
- `content/sponsors.ts` — confirm real tier names/prices/perks (currently
  example placeholders, same bracketed/highlighted treatment as About) and
  add real sponsor logos to `currentSponsors` once secured. Also need a real
  sponsor deck PDF — the Sponsorship section currently just says "coming
  soon" instead of linking to one.
- `content/donate.ts` is **done** — confirmed 501(c)(3) status from the
  org's own event flyers ("A 501(c)3 Nonprofit Organization"), real
  disclaimer in place. Still worth a quick sanity-check against the actual
  IRS determination letter/EIN before launch, but not a placeholder anymore.
- `content/contact.ts` — confirm a real response-time commitment and, if
  there's a public office, a real address. No social links or map embed were
  added since there's no confirmed address/accounts yet — add them once real.
- `content/events.ts` is **mostly done** — 3 real events (6th Annual Garba
  Musical Night, one night each for Geeta Rabari/Divya Chaudhary/Aishwaria
  Majumdar, Sept 4-6 2026, Columbus Civic Center — sourced from the org's
  own flyer images in `public/images/events/`). Two things still needed:
  (1) exact start/end times — flyers only list the date, so `startDateTime`/
  `endDateTime` currently guess 7-11pm; (2) real `ticketUrl` per event —
  currently `"#"` placeholders, user explicitly said "no link yet."
- `public/images/hero/hero-statue.jpg` — this is a **Thai Buddhist statue**
  (filename was literally `thai-style-buddha-sculpture-concept.jpg`), not
  Hindu/Indian imagery. Flagged explicitly to the user, who chose to use it
  anyway — but it doesn't represent the org's actual culture/religion.
  Worth revisiting with real photos (deity murtis, Navratri garba, diyas,
  rangoli, kite festival, temple imagery) before launch.

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

## Design direction — "Marigold Bloom"
Replaced "Chattahoochee Current" (river/rapids theme) once the org's real
identity — Columbus Indian Community Events, Inc. — was known. Warm,
devotional register: deep violet + marigold + terracotta, serif display
type, full-bleed split-image hero. Loosely modeled on a Hindu-temple-site
reference the user shared (orange header bar, duotone statue photo, serif
headline).

- Colors (CSS custom properties in `app/globals.css`, both raw palette vars
  and remapped shadcn semantic tokens — all pairs below are contrast-checked
  for WCAG AA):
  - Deep Violet `#2D1B4E` — headings/body text on light backgrounds,
    `.dark` mode background, `primary-foreground` (13.5:1 on Ivory)
  - Marigold `#E08A2E` — `primary` (buttons, sticky header bar); pair with
    Deep Violet text, not light text (5.7:1 with Deep Violet, only ~2.4:1
    with Ivory/white)
  - Turmeric `#A15A0A` — the **accent-safe text color**: eyebrow labels,
    highlighted headline words, stat/price callouts, links. Use this, not
    Marigold, whenever the accent color itself needs to be legible text on
    a light bg (4.7:1 vs Marigold's ~2.4:1)
  - Ivory `#F6F1E4` — default page background / text-on-dark
  - Ink `#3A2E4A` — spare/optional darker-body-text raw color, not currently
    wired into a semantic token
  - Utility classes: `bg-deep-violet`, `text-deep-violet`, `bg-marigold`,
    `text-marigold`, `bg-turmeric`, `text-turmeric`, `bg-ivory`, `text-ivory`,
    `bg-ink`, `text-ink`, plus standard shadcn semantic tokens (`bg-primary`,
    `bg-secondary`, `bg-accent`, etc.) remapped to this palette.
  - One-off exception: the About section uses a hardcoded `bg-deep-violet`
    background with `text-marigold` for all its text (5.7:1, passes AA) per
    explicit request — single centered paragraph layout, no eyebrow label,
    no stats block, no PlaceholderMark (copy is final, nothing left to
    flag). Not part of the token system — don't propagate this combo to
    other sections without being asked.
  - **Known accessibility regression, left as-is per explicit user
    instruction**: the Hero's CTA buttons, the "Get Tickets" buttons on the
    homepage event cards, and the individual `/events/[slug]` page all use
    `bg-[#ebddd2]` (soft beige) with `text-marigold` — roughly **2:1
    contrast**, well under the 4.5:1 AA floor this file otherwise mandates.
    The Hero subhead paragraph also uses `text-marigold` on Ivory (~2.4:1).
    All flagged to the user explicitly; they chose to keep iterating on
    other things instead of fixing it. Don't "fix" this silently in a
    future session — it's a live open question, not an oversight. Ask
    before changing.
- Typefaces: display = **Playfair Display** (`font-heading`, CSS var
  `--font-playfair`, weights 400-900), body = **Inter** (`font-sans`, CSS
  var `--font-inter`). Both wired via `next/font/google` in `app/layout.tsx`.
- Hero layout: full-bleed 50/50 split (`grid md:grid-cols-2`, no page
  max-width wrapper, both columns the same fixed height via `md:h-[640px]`)
  — image column left with `object-top` (keeps the subject's head/face in
  frame), text column right. This is a deliberate exception to the
  contained `max-w-*` layout every other section uses.
- Image treatment: grayscale the photo via CSS `filter`, then overlay a
  Deep-Violet-to-Marigold gradient with `mix-blend-mode: color` — a
  duotone effect done entirely in CSS, no image preprocessing needed. See
  `components/sections/hero.tsx`.
- "Next Event" homepage cards (`components/sections/upcoming-events.tsx`)
  auto-rotate their left-to-right order every 4s via a `setInterval` +
  Motion's `layout` prop (smooth position transitions, not a jump-cut).
  Pauses on `onMouseEnter` of the section, resumes on `onMouseLeave`, and
  the interval never starts at all if `useReducedMotion()` is true. Keep
  this pattern (interval + layout animation + hover-pause + reduced-motion
  check) if more rotating/carousel UI gets added elsewhere.
- Header: `bg-primary` (Marigold), solid, no transparency/blur. No brand
  text/logo in the header or mobile menu — removed per request. Active nav
  link is distinguished by weight + underline (not a color swap, since
  there's no third color that reads well on Marigold). Nav link text is
  `text-deep-violet` at full opacity — an earlier version used
  `text-primary-foreground/75` for inactive links, which blends with the
  Marigold bg into a muddy brownish tone rather than reading as clean
  purple. Don't reintroduce opacity fades on text sitting over Marigold.
- Header/section heights: header is `h-20` (not the Tailwind default);
  every anchor-scrolled section must use `scroll-mt-20` to match, or
  content will be hidden behind the sticky header on jump-to-anchor.
- Avoid: cream+terracotta as a *sitewide* base (fine as the one-off About
  exception above), black+neon-green, numbered "01/02/03" markers, stock
  "hands together" imagery.
