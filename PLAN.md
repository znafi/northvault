# Northvault — Build Plan

## Stack notes (what's actually installed)
- Next.js **16.2.9** + React 19 — App Router, Server Components, `use client` as needed
- Tailwind CSS **v4** — CSS-first config (`globals.css`), no `tailwind.config.js`
- shadcn/ui **base-nova** style — uses `@base-ui/react` (not `@radix-ui`), already init'd
- `tw-animate-css` for animations, `class-variance-authority` + `tailwind-merge` in place
- No Stripe installed yet; added in Phase 5

---

## Phase 1 — Foundation
*Types · Seed data · Design tokens · Fonts · Logo · Layout shell · Home page*

Files:
- `lib/types.ts` — `Size`, `SizeStock`, `Jersey`, `CartLine`, `CartState` types
- `lib/data.ts` — all 13 seed jerseys + helpers: `getJerseyBySlug`, `getBestsellers`, `getByType`, `getHostNation`, `getRelated`
- `app/globals.css` — add brand CSS variables (`--ink`, `--surface`, `--paper`, `--primary`, `--gold`, `--muted-fg`, `--success`, `--line-light`, `--line-dark`) + Tailwind utility aliases; wire Archivo/Inter via `next/font/google` in layout
- `app/layout.tsx` — Archivo + Inter fonts, `CartProvider`, `Toaster`, metadata
- `components/Logo.tsx` — inline SVG: north-star mark + NORTHVAULT wordmark, `variant="light|dark"`, `withIcon` prop
- `contexts/CartContext.tsx` — reducer, `localStorage` persistence (hydration-safe), full API: `addItem`, `removeItem`, `updateQty`, `applyPromo`, `clear`, derived totals
- `components/layout/AnnouncementBar.tsx` — dismissible dark bar, 3 rotating messages incl. WC2026 countdown
- `components/layout/Header.tsx` — sticky, logo left, nav center, icons right, cart badge, mobile hamburger
- `components/layout/Footer.tsx` — dark, newsletter, 4 link columns, payment icons, Canadian flag copy
- `components/layout/CartDrawer.tsx` — right slide-over, line items, qty stepper, remove, subtotal, shipping progress bar, Checkout CTA, empty state
- `app/page.tsx` — Home: hero (white on `#0C0C0E`), trust strip, host-nation band, bestsellers grid, region tiles, full catalog preview, Northvault Promise band, newsletter

Commit checkpoint: `npm run build` passes, home page renders with layout.

---

## Phase 2 — Catalog `/shop`
*Filters · Sort · Search · Product grid*

Files:
- `components/ProductCard.tsx` — image (3:4 ratio, hover-swap), flag emoji, name, type tag, price, star rating, badges, quick add-to-cart with size mini-picker
- `app/shop/page.tsx` — URL query params (`?type`, `?region`, `?sort`), filter sidebar (desktop) / sheet (mobile), active-filter chips, sort dropdown, result count, responsive grid (2/3/4 cols), empty state

Commit checkpoint: all 13 jerseys visible, filters + sort work, no TS errors.

---

## Phase 3 — Product Detail `/shop/[slug]`
*Gallery · Size selector · Printing add-on · Add to cart*

Files:
- `app/shop/[slug]/page.tsx` — dynamic route, `generateStaticParams` for all slugs
- `components/pdp/Gallery.tsx` — main image + 3 thumbnails, hover-zoom desktop, swipe mobile
- `components/pdp/SizeSelector.tsx` — S–2XL pills, OOS disabled + strike + Notify me link
- `components/pdp/PrintingAddon.tsx` — toggle, name/number inputs, live preview, +$19.99, non-returnable note
- `components/pdp/SizeGuideModal.tsx` — CM/IN table, opens from link
- Breadcrumbs, highlights bullets, Details/Materials accordion, Shipping & Returns accordion, Reviews section (static sample), Related jerseys grid
- Sticky mobile add-to-cart bar
- JSON-LD product schema

Commit checkpoint: each slug page loads, add-to-cart fires cart drawer + toast.

---

## Phase 4 — Cart `/cart`
*Full cart page · Promo code · Order summary*

Files:
- `app/cart/page.tsx` — line items table (thumbnail, flag, name, size, printing summary, qty stepper, line total, remove), order summary panel (subtotal, shipping, 5% GST placeholder, total), promo code input (`WC2026` = 10% off), free-shipping progress bar, `Proceed to Checkout` CTA, empty state, "You might also like" mini grid

Commit checkpoint: cart CRUD correct, promo applies/errors, totals accurate.

---

## Phase 5 — Checkout `/checkout`
*Form validation · Stripe / demo mode*

Files:
- `app/checkout/page.tsx` — 4 sections: Contact, Shipping address (Canadian province dropdown + postal validation), Shipping method (Standard/Express radio cards), Payment; sticky order summary; trust badges; inline validation; disabled submit until valid; loading state
- `app/api/checkout/route.ts` — `createCheckoutSession` server route: reads `STRIPE_SECRET_KEY`; if absent, returns a mock session ID and redirect to `/order/success?demo=1`
- Install `stripe` + `@stripe/stripe-js` packages

Demo mode: no env vars needed; mock order flows through to confirmation.

Commit checkpoint: form validates, demo checkout reaches confirmation, Stripe path wires correctly when key is present.

---

## Phase 6 — Confirmation + Account
*Order success · Account stub*

Files:
- `app/order/success/page.tsx` — order number, email-sent note, full order summary (items, totals, address, shipping method, ETA), `Continue Shopping` CTA; reads Stripe session or falls back to mock order from `localStorage`
- `app/account/page.tsx` — tabs: Orders, Addresses, Profile; unauthenticated state shows sign-in stub (never blocks funnel)

Commit checkpoint: full funnel browse → product → cart → checkout → confirmation completes end-to-end.

---

## Phase 7 — Supporting Pages + Polish
*Size guide · Shipping/Returns · FAQ · Contact · About · Search · 404*

Files:
- `app/size-guide/page.tsx` — CM/IN measurement tables
- `app/shipping-returns/page.tsx` — timelines, costs, returns policy
- `app/faq/page.tsx` — accordion by topic
- `app/contact/page.tsx` — form with validation + success state
- `app/about/page.tsx` — brand story
- `app/search/page.tsx` — search overlay + results across name/country/colorway, empty + results states
- `app/not-found.tsx` — branded 404 with Back to Shop

Final: `npm run build` clean, zero TS errors, all routes reachable, no dead ends.

---

## Hard requirements checklist (never lose these)
- [ ] Hero: white text on solid `#0C0C0E`, no gradient, no overlay tint
- [ ] `<Logo />` is monochrome SVG — white on dark contexts, black on light
- [ ] All 13 seed jerseys render on `/shop` + have working `/shop/[slug]` pages
- [ ] Full funnel: browse → product → cart → checkout → confirmation — no dead ends
- [ ] Stripe wired with demo-mode fallback (zero env vars required)
- [ ] Archivo (headings, 700–900, uppercase) + Inter (body, 400–600), tabular-nums on prices
- [ ] Exact color tokens: `--ink #0C0C0E`, `--primary #E11D2A`, `--gold #C8A24B`, etc.
- [ ] Flag emoji/icon beside every team name
- [ ] Cart persists to `localStorage`, no SSR hydration mismatch
- [ ] `WC2026` promo = 10% off
