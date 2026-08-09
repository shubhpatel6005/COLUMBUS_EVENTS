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
  Until Drive is configured, 5 real event photos live in
  `content/gallery.ts` (`localGalleryPhotos`) and always render first,
  with Drive photos appended after if `DRIVE_FOLDER_ID` is set — see
  `components/sections/gallery.tsx`. Source images optimized via `sharp`
  (resized to 1600px long side, ~130-285KB each) into
  `public/images/gallery/`; raw originals stay in `public/images/PHOTOS/`
  (gitignored, not committed — same pattern to follow for future photo
  drops: resize before committing, don't commit raw camera originals).
- Donations: **Square Checkout** (custom code via the `square` npm SDK's
  Payment Links API — `client.checkout.paymentLinks.create(...)`, not a
  Givebutter/Donorbox embed). Originally built on Stripe, switched to
  Square per explicit request — see `lib/square.ts`,
  `app/api/checkout/route.ts`, `app/api/webhooks/square/route.ts`.
  One-time donations only — Square's Subscriptions API requires a
  pre-created Catalog subscription plan with fixed price tiers, unlike
  Stripe's dynamic `price_data`, so it can't support an arbitrary
  custom recurring amount the same way. The "Monthly" toggle was
  removed from `components/sections/donate.tsx` for this reason —
  don't re-add recurring donations without first creating Catalog
  subscription plan variations in the Square dashboard (and deciding
  whether custom monthly amounts get dropped in favor of preset tiers).

- Design direction: **Marigold Bloom** (see below) — deep violet + marigold
  + terracotta, Libertinus Math serif throughout, full-bleed split
  image/text hero. Replaced the earlier "Chattahoochee Current" river
  theme once the org's real identity (Indian cultural nonprofit) was
  known; typeface later switched from Playfair Display/Inter to
  Libertinus Math sitewide per explicit request.

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
  (min/max bounds) in the Square checkout route.
- The Drive photo proxy route must verify a file's parent folder matches
  `DRIVE_FOLDER_ID` before serving it — do not build an open proxy.
- Build one section per session. Don't build multiple sections in one pass.

## Content TODOs (must be filled before launch)
- `content/about.ts` is **done** — real final copy (org intro + donor/invite
  paragraph), no placeholders left. Nothing to track here anymore.
- `content/sponsors.ts` is **done** — the tier cards (Community/Supporter/
  Presenting) were removed from the Sponsorship section per request, along
  with the placeholder tier data. 27 real sponsor logos (dropped in
  `public/images/Sponsorship`, gitignored raw originals — see Design
  direction note below) now populate `currentSponsors` and render as a
  continuously auto-scrolling logo marquee (`components/sponsors/
  logo-marquee.tsx`), name printed under each logo, pausing on hover,
  falling back to a static wrapped grid under reduced motion. Below the
  logos, a "50+ Sponsors" stat (`components/sponsors/stat-counter.tsx`)
  counts up on scroll into view — the "$500,000+ Sponsorship Amount"
  stat that used to sit next to it was removed per request; the
  component still supports a `prefix`/second stat if one comes back.
  Its numbers are responsive (`text-3xl sm:text-5xl lg:text-6xl`) — back
  when there were two stats side by side, the original fixed
  `text-5xl`/`gap-16` overflowed horizontally below ~400px viewport
  width (confirmed via `document.documentElement.scrollWidth` checks at
  320/375/390px); the container also had a matching `flex-wrap` +
  smaller gap at the time. Keep numeric stat callouts responsive by
  default; verify with a scrollWidth check, not just visual inspection,
  since overflow at narrow widths is easy to miss in a normal browser
  window. The "Sponsor deck PDF coming soon" line was removed per
  request — add a real link/button there if a deck gets made. If pricing
  tiers come back later, re-add that data with the bracketed-placeholder
  treatment used elsewhere, not invented numbers.
- `content/donate.ts` is **done** — confirmed 501(c)(3) status from the
  org's own event flyers ("A 501(c)3 Nonprofit Organization"), real
  disclaimer in place. Still worth a quick sanity-check against the actual
  IRS determination letter/EIN before launch, but not a placeholder anymore.
- `content/contact.ts` was **deleted** — it only held a placeholder
  response-time line and an unused placeholder address, both removed from
  `components/sections/contact.tsx` per request rather than filled in. No
  social links or map embed were added since there's no confirmed
  address/accounts yet. If a real response-time commitment or public
  address surfaces later, add them back as plain copy in the section
  (a dedicated content file isn't needed for one or two lines).
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
- **Square** (donations): `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` /
  `NEXT_PUBLIC_SQUARE_APPLICATION_ID` are set to real **sandbox**
  credentials (`SQUARE_ENVIRONMENT=sandbox`) and confirmed working
  end-to-end — a real Payment Link is created and resolves to Square's
  hosted checkout. Still needed before launch: (1) switch to
  **production** credentials from the org's real Square account and set
  `SQUARE_ENVIRONMENT=production`; (2) register a webhook endpoint in
  the Square dashboard against the deployed URL
  (`https://<domain>/api/webhooks/square`, event type `payment.updated`)
  to get `SQUARE_WEBHOOK_SIGNATURE_KEY` — donation receipt emails don't
  fire without it. Validates amounts server-side (min $1 / max $10,000)
  in `app/api/checkout/route.ts`.
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
    before changing. All three buttons (Hero CTAs, homepage "Get
    Tickets", `/events/[slug]` "Get Tickets") share the same hover/
    active state per request: `hover:bg-primary hover:text-ivory
    active:bg-primary active:text-ivory` — swaps to the header's
    Marigold + ivory-text combo on interaction, only the resting state
    keeps the low-contrast beige/marigold pairing above.
- Typefaces: **Libertinus Math** for everything — both `font-heading` and
  `font-sans` map to the same CSS var (`--font-libertinus`), wired via
  `next/font/google` in `app/layout.tsx`. Replaced the earlier Playfair
  Display (headings) / Inter (body) pairing per explicit request. Only
  ships weight 400 (no bold cut), so `font-bold`/`font-semibold` render as
  browser-synthesized faux-bold — a known tradeoff of this specific font,
  not a bug. Next.js also can't generate ideal fallback-font metrics for
  it (logged as a harmless build warning) since it's a less-common
  Google Fonts entry.
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
  the interval never starts if reduced motion is preferred. Keep this
  pattern (interval + layout animation + hover-pause + reduced-motion
  check) if more rotating/carousel UI gets added elsewhere.
- Sponsorship logo wall (`components/sponsors/logo-marquee.tsx`) is a
  continuously auto-scrolling marquee — pure CSS (`@keyframes marquee` in
  `globals.css`, `translateX(0)` to `translateX(-50%)` over the sponsor
  list duplicated twice for a seamless loop), paused via
  `group-hover:[animation-play-state:paused]` rather than JS. Falls back
  to a static wrapped grid (no animation) when `useReducedMotion` from
  `lib/use-reduced-motion` is true. Every logo renders in a fixed-size
  card (`h-24 w-44 sm:h-28 sm:w-52`, `object-contain`) so sizes stay
  uniform regardless of each sponsor's native logo dimensions, with the
  sponsor name printed underneath. It's a full-bleed section (breaks out
  of the `mx-auto max-w-5xl` wrapper via `-mx-4`), same full-bleed
  exception pattern as the Hero.
- **The newsletter bar (`components/newsletter/newsletter-bar.tsx`) covers
  the bottom of every page** — it's `fixed inset-x-0 bottom-0` with no
  space reserved for it, so without a fix the last ~70-115px of content
  (varies by breakpoint since the bar wraps to 2 lines on narrow
  screens) is permanently unreachable, even scrolled all the way down
  (confirmed via `getBoundingClientRect()` comparison after
  `window.scrollTo(0, document.body.scrollHeight)`, not just visual
  inspection). Fixed by having the bar measure its own height via
  `ResizeObserver` and write it to a `--newsletter-bar-height` CSS
  custom property on `<html>`, which `body`'s `padding-bottom` in
  `globals.css` reads (reset to `0px` on dismiss/unmount). If the bar's
  content or breakpoints change, this stays correct automatically —
  don't replace it with a static per-breakpoint padding guess.
- Donate section's preset-amount buttons (`components/sections/
  donate.tsx`) use `text-xs`/`px-1.5`/`py-2.5` below `sm:` and
  `text-sm`/`px-3`/`py-2` at `sm:` and up — the original fixed
  `px-3`/`text-sm` at all sizes let "Custom" overflow its own button by
  a few px at 320px width (`scrollWidth` vs `clientWidth` mismatch, not
  page-level overflow so it didn't show up in a scrollWidth sweep of
  the page — check individual interactive elements too, not just
  `document.documentElement`). The bumped `py-2.5` on mobile keeps the
  tap target comfortable after shrinking the font.
- **Two WebKit/Safari-specific bugs found post-launch** (reported as "empty
  boxes" in Gallery and Sponsorship, reproduced with Playwright's `webkit`
  browser against the live Vercel deployment — not visible in Chromium,
  which is why earlier local testing missed them):
  1. Sponsor logos in `components/sponsors/logo-marquee.tsx` (and gallery
     photos in `components/gallery/gallery-grid.tsx`) relied on `next/
     image`'s default `loading="lazy"`, which uses `IntersectionObserver`
     under the hood. Safari's `IntersectionObserver` doesn't reliably fire
     for images inside a continuously CSS-`transform`-animated container
     (the marquee), so logos that were off-screen at page load could get
     stuck at `img.complete === false` forever — a real, permanent blank
     tile, confirmed via `img.complete`/`naturalWidth` checks, not just
     visual inspection. Fixed by setting `loading="eager"` explicitly on
     both — they're small, bounded image sets (27 logos, 5 photos), so
     eager-loading is cheap and removes the lazy-loading uncertainty
     entirely. Don't reintroduce default lazy loading on either.
  2. Separately, the Gallery flip cards' permanent `[perspective:1000px]`
     + `[transform-style:preserve-3d]` (present on every card at rest, not
     just on hover) corrupted WebKit's compositing for *later* content on
     the same page — confirmed by stripping those properties via
     `page.evaluate` and watching the Sponsorship section's ghosting
     disappear, with `elementFromPoint` confirming the "empty boxes" had
     no backing DOM element at all (a pure paint artifact). Reproduced
     even with the animation-free `motion-reduce` fallback grid, so it's
     not about the marquee's `animation` or `mask-image` — a bare 3D
     rendering context anywhere on the page was enough. Fixed by making
     `perspective`/`transform-style: preserve-3d` conditional on
     `hover:`/`focus-visible:` (button) and `group-hover:`/
     `group-focus-visible:` (inner card) instead of permanent, so no 3D
     context exists except during an active flip. Verified the flip
     itself still works afterward (`matrix3d(...)` on hover, confirmed via
     computed style, not just screenshot) before redeploying. If more 3D
     CSS gets added anywhere on this page, test it in real WebKit — not
     just Chromium — since this class of bug doesn't reproduce there.
- **Bug found in `framer-motion`'s own `useReducedMotion()`** (re-exported
  from `motion/react`): it calls
  `window.matchMedia("(prefers-reduced-motion)")` — missing `: reduce` —
  which does not reliably detect the real OS preference (confirmed via
  Playwright's `reducedMotion: 'reduce'` context: `matchMedia("(prefers-
  reduced-motion: reduce)").matches` correctly returned `true`, but
  framer-motion's hook never reflected it, so reduced-motion users still
  got the full intro animation and the rotating carousel). Do **not**
  import `useReducedMotion` from `motion/react` anywhere in this project.
  Use `useReducedMotion` from `lib/use-reduced-motion.ts` instead — a
  small `useSyncExternalStore`-based hook that queries the correct media
  feature and is SSR-hydration-safe. Both the intro overlay and the
  upcoming-events carousel use it.
- Homepage intro (`components/intro/intro-overlay.tsx`, mounted only in
  `app/page.tsx`, not the layout): a full-screen overlay that stroke-draws
  a Namaste logo in black, holds briefly, then fades to reveal the site
  underneath (already rendered, just covered). The logo is
  `public/images/Animation/Namaste-Logo-PNG-Pic.png`, vector-traced with
  `potrace` (a one-off conversion tool, not a project dependency — not in
  package.json) into `components/intro/namaste-path.ts`, then animated via
  Motion's `pathLength`. Skips entirely under reduced motion (see hook
  note above). Timing constants (`DRAW_DURATION_S`, `HOLD_AFTER_DRAW_MS`,
  `FADE_DURATION_S`) are all in that file if the pacing needs adjusting.
- Header: `bg-primary` (Marigold), solid, no transparency/blur. Logo is an
  Om symbol image (`public/images/brand/om-logo.png`, transparent PNG,
  sourced from the user), left-aligned, links to `#hero`, sized `h-16`.
  Brand *text* ("Columbus Events") was removed per an earlier request and
  hasn't come back — only the image logo. Mobile menu's own top bar still
  has no logo (only the close button) — hasn't been asked for there yet.
  Active nav link is distinguished by weight + underline plus a color
  swap to `text-ivory` (white-reading) — per explicit request this
  applies to every link's active state now, not just inactive-vs-active
  weight. This is a **deliberate low-contrast choice on Marigold**
  (~2.4:1, same tradeoff already flagged for the Hero CTAs) — don't
  "fix" it back to deep-violet without asking; it was a color swap the
  user asked for on purpose. Inactive nav link text is `text-deep-violet`
  at full opacity — an earlier version used `text-primary-foreground/75`
  for inactive links, which blends with the Marigold bg into a muddy
  brownish tone rather than reading as clean purple. Don't reintroduce
  opacity fades on text sitting over Marigold. Nav link font is
  `font-heading` (Libertinus Math, matching the sitewide typeface),
  rendered **uppercase** (`uppercase` class) and sized `text-xl` — bumped
  up twice from an original `text-sm` per repeated explicit requests to
  make the header more prominent; confirmed it still fits on one line at
  the `md:` breakpoint (768px, the narrowest width the desktop nav
  shows at) via a `scrollWidth` check before shipping each bump. Nav
  *order* is About, Next Event, Gallery, Sponsors,
  Donate, Contact — but the actual page/section order (in
  `app/page.tsx`) stays Hero, Next Event (`#events`), About, Gallery,
  Sponsorship, Donate, Contact. These two orders are intentionally
  different — don't "fix" the nav to match page order or vice versa.
- Header/section heights: header is `h-20` (not the Tailwind default);
  every anchor-scrolled section must use `scroll-mt-20` to match, or
  content will be hidden behind the sticky header on jump-to-anchor.
- Avoid: cream+terracotta as a *sitewide* base (fine as the one-off About
  exception above), black+neon-green, numbered "01/02/03" markers, stock
  "hands together" imagery.
