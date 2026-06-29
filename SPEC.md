# Northvault — v0 Build Prompt (World Cup 2026 Jersey Store)

> Paste this entire brief into v0. If v0 truncates, paste in this order: (1) Project + Tech + Design System, (2) Data Model + Seed Data, (3) Pages, (4) Cart/Checkout + Acceptance Criteria. Build iteratively, confirming each section renders before moving on.

---

## 0. ROLE & GOAL

Build a complete, production-quality, full-stack e-commerce storefront called **Northvault** — a Canadian shop selling **World Cup 2026 national-team football jerseys**. Deliver the entire customer journey: landing page → browse → product detail → cart → checkout → order confirmation, plus all supporting pages. Nothing should be a dead end. Every button works, every state (empty, loading, error, success) is handled.

**Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · lucide-react icons. Cart state via React Context persisted to `localStorage`. Payments via **Stripe Checkout** (server actions / route handlers). Product data ships as a typed seed file so the site fully runs in preview without any backend keys; Stripe and persistence are wired but gracefully degrade to a mock when env vars are absent.

**Currency:** CAD. **Locale:** en-CA. **Market:** Canada-wide, ships across Canada.

---

## 1. BRAND & DESIGN SYSTEM

**Brand personality:** premium but energetic. "The vault" = a curated collection of the best national kits. Neutral, confident UI that lets the colorful jerseys be the heroes. Think a high-end sneaker boutique crossed with World Cup hype — not a cluttered fan-gear warehouse.

**Color tokens** (define as CSS variables + Tailwind theme):
- `--ink` / background-dark: `#0C0C0E`
- `--surface`: `#15151A`
- `--paper` / background-light: `#FAFAFA`
- `--line` / borders: `#E6E6E6` (light), `#26262C` (dark)
- `--primary` (CTAs, sale, active): `#E11D2A` (vivid red)
- `--gold` (premium accents, "vault" details, badges): `#C8A24B`
- `--muted-fg`: `#6B6B72`
- `--success`: `#1FA971`
- Default to a **light theme** for the store with **dark sections** (hero, footer, announcement bar) for contrast.

**Typography:**
- Display / headings: **Archivo** (Google Font), weights 700–900, UPPERCASE for hero + section headers, tight tracking (-0.01em). Big, athletic, confident.
- Body / UI: **Inter** (Google Font), 400–600.
- Prices and numerals: tabular-nums.

**Logo** (build as an inline SVG React component, `<Logo variant="light|dark" withIcon />`):
- Style: a **clean, minimal, monochrome wordmark** in the spirit of modern Canadian "North-" brand marks — geometric, confident, no gradients or effects. The wordmark **NORTHVAULT** is set in Archivo, weight 800, uppercase, letter-spacing ~1.5px.
- Mark: a small **four-point north-star** (sharp sparkle/compass star) to the left of the wordmark — nods to "North" and the premium "vault" feel. Keep it simple enough to read at 20px (favicon).
- Default (header/hero/footer on black): **all white** — white star + white wordmark. This is the primary lockup.
- On light pages: **all black** (`#0C0C0E`).
- Accent variant (optional, for marketing moments only): two-tone where "NORTH" is white/black and "VAULT" is gold `#C8A24B`; or a gold star with a white wordmark. Do **not** use the gold version as the default header logo — the default is monochrome.
- Ship matching assets: full horizontal lockup, stacked NORTH/VAULT, and a square **app icon / favicon** (north-star + "NV" monogram on black, with a light-bg inverse). Provide an optional sub-tagline lockup "FOOTBALL KITS · CANADA" in muted gray for the footer.

**Component style:**
- Square-ish cards, 12px radius, generous whitespace, thin 1px borders rather than heavy shadows. Subtle shadow + slight lift on card hover.
- Buttons: solid red primary, outline secondary, ghost tertiary. 44px min tap height. Clear disabled + loading (spinner) states.
- Imagery: 3:4 portrait product images on a soft neutral (#F2F2F2) tile. Use `/placeholder.svg` placeholders now, with correct aspect ratio, descriptive `alt`, and structured so real photos swap in later (4 images per product).
- Flags: render the country flag (emoji flag or circular flag icon) beside team names everywhere a product appears.

**Motion:** smooth 150–250ms transitions. Sticky header that shrinks on scroll. Cart drawer slides in from the right. Toasts for add-to-cart / errors. Respect `prefers-reduced-motion`.

---

## 2. GLOBAL LAYOUT (every page)

**Announcement bar** (dark, dismissible, top of page): rotating messages — "Free shipping across Canada over $150" · "Ships from Canada — no surprise duties" · a small **World Cup 2026 countdown** to June 11, 2026.

**Header** (sticky):
- Left: **Northvault logo** — see the Logo spec in §1. Render it as an inline SVG component (`<Logo />`) so it scales crisply and recolors by context: white version on the black hero/header/footer, black version on light pages.
- Center/left nav: `Shop All`, `Home Kits`, `Away Kits`, `Host Nation` (Canada), `Bestsellers`.
- Right: search icon (opens search overlay), account icon (`/account`), cart icon with a live item-count badge that opens the **cart drawer**.
- Mobile: hamburger → slide-out nav; sticky bottom-safe cart access.

**Cart drawer** (global, right slide-over): line items with thumbnail, name+flag, size, printing add-on if any, qty stepper, remove; live subtotal; "X away from free shipping" progress bar; `View Cart` + `Checkout` buttons; empty state with a `Shop Jerseys` CTA.

**Footer** (dark): newsletter email capture ("Get World Cup drops first"); columns — Shop (by confederation/region), Help (Size Guide, Shipping & Returns, FAQ, Contact), Company (About, our authenticity promise); social icons; payment-method icons (Visa/Mastercard/Amex/Apple Pay); copyright + Canadian flag + "Shipped from Canada."

**Global utilities:** toast system, `<Loading>` skeletons, scroll-to-top, consistent SEO `<head>` per page (title, description, OpenGraph), and a friendly **404** page with a `Back to Shop` CTA.

---

## 3. DATA MODEL

```ts
type Size = "S" | "M" | "L" | "XL" | "2XL";

interface SizeStock { size: Size; inStock: boolean; }

interface Jersey {
  id: string;
  slug: string;            // url: /shop/[slug]
  name: string;            // "Brazil 2026 Home Jersey"
  country: string;
  countryCode: string;     // ISO for flag, e.g. "BR"
  region: "South America" | "North America" | "Europe" | "Africa";
  type: "Home" | "Away";
  maker: "Nike" | "adidas" | "Puma";
  price: number;           // CAD
  colorway: string;        // short, e.g. "Yellow / Green"
  description: string;     // 2–3 sentences of selling copy
  highlights: string[];    // 3–4 bullet features
  sizes: SizeStock[];
  images: string[];        // 4 image paths (use /placeholder.svg for now)
  badges: string[];        // e.g. ["Bestseller"], ["Host Nation"], ["New"]
  rating: number;          // 0–5
  reviewCount: number;
}
```

**Printing add-on (per cart line):** optional player **name** (max 12 chars, uppercase) + **number** (0–99), `+$19.99 CAD`. Show as a toggle on the product page with two inputs and a live preview line ("Will print: MESSI 10"). Personalized items are marked non-returnable.

**Cart line shape:** `{ jerseyId, slug, name, countryCode, size, qty, unitPrice, printing?: { name: string; number: number; fee: number } }`.

---

## 4. SEED DATA (use exactly these 13 products)

Prices in CAD. All sizes `inStock: true` except where noted. Use 4 `/placeholder.svg` images each; set `alt` from `name + colorway`.

```ts
export const jerseys: Jersey[] = [
  { id:"br-h", slug:"brazil-2026-home", name:"Brazil 2026 Home Jersey", country:"Brazil", countryCode:"BR", region:"South America", type:"Home", maker:"Nike", price:104.99, colorway:"Yellow / Green", description:"The iconic canarinho yellow with green trim. The most recognizable shirt in world football, refreshed for 2026.", highlights:["Classic CBF yellow","Breathable match-weight fabric","Embroidered crest","Tagless collar"], badges:["Bestseller"], rating:4.9, reviewCount:218, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"br-a", slug:"brazil-2026-away", name:"Brazil 2026 Away Jersey", country:"Brazil", countryCode:"BR", region:"South America", type:"Away", maker:"Nike", price:104.99, colorway:"Royal Blue", description:"Brazil's deep royal-blue away kit — a bold alternate to the famous yellow.", highlights:["Royal blue colorway","Match-weight fabric","Embroidered crest","Slim modern fit"], badges:["Bestseller"], rating:4.8, reviewCount:142, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"mx-h", slug:"mexico-2026-home", name:"Mexico 2026 Home Jersey", country:"Mexico", countryCode:"MX", region:"North America", type:"Home", maker:"adidas", price:99.99, colorway:"Green / White", description:"El Tri's vibrant green home shirt — one of the loudest selling kits in North America.", highlights:["Vibrant Tri green","Aeroready-style fabric","Woven crest","Ribbed collar"], badges:["Bestseller"], rating:4.8, reviewCount:176, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"ma-h", slug:"morocco-2026-home", name:"Morocco 2026 Home Jersey", country:"Morocco", countryCode:"MA", region:"Africa", type:"Home", maker:"Puma", price:99.99, colorway:"Red / Green", description:"The Atlas Lions' red home kit with green detailing — a runaway seller since 2022.", highlights:["Bold red colorway","Green star detailing","Lightweight knit","Embroidered crest"], badges:["New"], rating:4.9, reviewCount:131, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"de-h", slug:"germany-2026-home", name:"Germany 2026 Home Jersey", country:"Germany", countryCode:"DE", region:"Europe", type:"Home", maker:"adidas", price:99.99, colorway:"White / Black", description:"Die Mannschaft's classic white home shirt with crisp black accents.", highlights:["Classic white kit","DFB crest","Clean modern cut","Moisture-wicking"], badges:[], rating:4.7, reviewCount:98, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"eg-h", slug:"egypt-2026-home", name:"Egypt 2026 Home Jersey", country:"Egypt", countryCode:"EG", region:"Africa", type:"Home", maker:"adidas", price:99.99, colorway:"Red", description:"The Pharaohs' striking red home shirt — a fan favourite across the diaspora.", highlights:["Signature red","Gold crest detail","Breathable fabric","Ribbed collar"], badges:[], rating:4.7, reviewCount:74, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"ca-h", slug:"canada-2026-home", name:"Canada 2026 Home Jersey", country:"Canada", countryCode:"CA", region:"North America", type:"Home", maker:"Nike", price:109.99, colorway:"Red / Maple", description:"The host nation's bold red home shirt with the maple leaf front and centre. The shirt of the summer.", highlights:["Host-nation home kit","Centred maple leaf","Match-weight fabric","Embroidered crest"], badges:["Host Nation","Bestseller"], rating:5.0, reviewCount:264, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"ca-a", slug:"canada-2026-away", name:"Canada 2026 Away Jersey", country:"Canada", countryCode:"CA", region:"North America", type:"Away", maker:"Nike", price:109.99, colorway:"Black / Ice", description:"Canada's darker away kit with a cracked-ice maple-leaf graphic. Sharp, modern, sold out fast last drop.", highlights:["Cracked-ice graphic","Host-nation away kit","Slim athletic fit","Tonal crest"], badges:["Host Nation"], rating:4.9, reviewCount:151, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"fr-h", slug:"france-2026-home", name:"France 2026 Home Jersey", country:"France", countryCode:"FR", region:"Europe", type:"Home", maker:"Nike", price:99.99, colorway:"Navy Blue", description:"Les Bleus' deep navy home shirt — always one of the top-selling kits of any tournament.", highlights:["Deep navy blue","FFF crest","Premium match fabric","Refined collar"], badges:[], rating:4.8, reviewCount:120, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"ar-h", slug:"argentina-2026-home", name:"Argentina 2026 Home Jersey", country:"Argentina", countryCode:"AR", region:"South America", type:"Home", maker:"adidas", price:104.99, colorway:"Sky Blue / White", description:"The reigning champions' iconic sky-blue and white stripes. Demand is relentless — order early.", highlights:["Albiceleste stripes","Three-star crest","Match-weight knit","Embroidered detailing"], badges:["Bestseller"], rating:5.0, reviewCount:312, sizes:[{size:"S",inStock:true},{size:"M",inStock:false},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:false}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"ar-a", slug:"argentina-2026-away", name:"Argentina 2026 Away Jersey", country:"Argentina", countryCode:"AR", region:"South America", type:"Away", maker:"adidas", price:104.99, colorway:"Deep Purple", description:"Argentina's bold alternate away kit — a modern collector's favourite.", highlights:["Statement colorway","Three-star crest","Slim fit","Tonal trims"], badges:[], rating:4.8, reviewCount:98, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"pt-h", slug:"portugal-2026-home", name:"Portugal 2026 Home Jersey", country:"Portugal", countryCode:"PT", region:"Europe", type:"Home", maker:"Puma", price:99.99, colorway:"Deep Red / Green", description:"Portugal's rich red home shirt with green accents — a perennial top seller.", highlights:["Deep red colorway","Green collar trim","FPF crest","Lightweight knit"], badges:[], rating:4.8, reviewCount:134, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
  { id:"en-h", slug:"england-2026-home", name:"England 2026 Home Jersey", country:"England", countryCode:"GB", region:"Europe", type:"Home", maker:"Nike", price:99.99, colorway:"White / Navy", description:"The Three Lions' classic white home shirt with navy trim.", highlights:["Classic white kit","Three Lions crest","Clean cut","Moisture-wicking"], badges:[], rating:4.7, reviewCount:111, sizes:[{size:"S",inStock:true},{size:"M",inStock:true},{size:"L",inStock:true},{size:"XL",inStock:true},{size:"2XL",inStock:true}], images:["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"] },
];
```

Derive helpers: `getJerseyBySlug`, `getBestsellers` (badge includes "Bestseller"), `getByType("Home"|"Away")`, `getHostNation` (country === "Canada"), `getRelated` (same region, exclude current, max 4).

---

## 5. PAGES

### 5.1 Home `/`
- **Hero** (full-bleed, **default = white text on solid black `#0C0C0E`** — no gradient, no background image overlay tint; pure black canvas with white type so it reads like the brand's signature lockup): big Archivo headline in white "WORLD CUP 2026. WORN HERE." + white/muted-gray subline "National-team jerseys, shipped from Canada." Primary CTA `Shop All Jerseys` (white-filled button with black text), secondary `Shop Host Nation` (white outline, white text). Optional small product image sits to the side or below on its own neutral tile — it must not wash out the black background. This white-on-black hero is the default look; do not lighten it.
- **Trust strip**: 4 icons — Ships from Canada (no surprise duties) · Free shipping over $150 · Easy 30-day returns · Secure checkout.
- **Host Nation feature band**: Canada Home + Away side by side with a "Host Nation 2026" headline and CTA.
- **Bestsellers carousel/grid**: product cards from `getBestsellers()`.
- **Shop by region**: tiles for South America, Europe, Africa, North America → filtered shop.
- **Full catalog preview grid** (all 13) with a `View All` CTA.
- **"The Northvault Promise" band**: short trust copy on quality + clear authenticity labeling + Canadian shipping.
- **Newsletter band** before footer.

### 5.2 Shop / Catalog `/shop`
- Page header + result count. Supports query params for deep links (`?type=Home`, `?region=Europe`, `?sort=`).
- **Filters** (sidebar on desktop, slide-over sheet on mobile): Country (multi), Type (Home/Away), Region/Confederation, Maker (Nike/adidas/Puma), Price range, In-stock-only toggle. Active filters show as removable chips; `Clear all`.
- **Sort**: Featured, Price ↑, Price ↓, Top rated, Newest.
- **Search box** within shop.
- **Product grid** (responsive 2/3/4 cols). **Product card**: image with hover-swap to 2nd image, flag + name, type tag, price, star rating, badges (Bestseller/Host Nation/New), quick `Add to cart` that opens a size mini-picker, and a low-stock/"Selling fast" hint where relevant. Empty-state when filters match nothing.

### 5.3 Product Detail `/shop/[slug]`
- **Gallery**: main image + 3 thumbnails, click to switch, zoom on hover (desktop), swipe (mobile).
- **Info column**: flag + name, maker + type, price, star rating → jumps to reviews. Colorway. Short description.
- **Size selector**: S–2XL pills; out-of-stock sizes disabled with a strike + "Notify me" link; required before add-to-cart. **Size Guide** link opens a modal with a CM/IN measurement table.
- **Printing add-on**: toggle → name input (max 12, auto-uppercase) + number input (0–99) + live preview ("Will print: MESSI 10") + "+$19.99" + note "Personalized items are final sale."
- **Quantity** stepper.
- **Add to cart** (primary) → opens cart drawer + success toast. **Buy now** (secondary) → straight to checkout. Sticky add-to-cart bar on mobile.
- **Highlights** bullets, **Details/Materials** accordion, **Shipping & Returns** accordion (ships from Canada, timelines, returns policy, personalized = final sale).
- **Reviews** section: average rating, distribution bars, sample reviews list, "Write a review" (stub form).
- **Related jerseys** grid (`getRelated`).
- Breadcrumbs: Home / Shop / {name}.

### 5.4 Cart `/cart`
- Line items table: thumbnail + flag + name, size, printing summary, unit price, qty stepper, line total, remove. Edit size inline.
- **Order summary**: subtotal, shipping (Free over $150, else $14.99), estimated tax (e.g. GST/PST by province — use a simple flat 5% GST placeholder labeled "Estimated tax, finalized at checkout"), total. **Promo code** input (accept demo code `WC2026` = 10% off, show applied/invalid states). Free-shipping progress bar.
- `Proceed to checkout` CTA. Empty cart state with `Shop Jerseys`.
- "You might also like" mini grid.

### 5.5 Checkout `/checkout`
Single-page, multi-section, **guest checkout by default** (offer optional account creation, never force login):
1. **Contact**: email (validated), SMS opt-in checkbox.
2. **Shipping address**: full name, address line 1/2, city, **Province** (Canadian province/territory dropdown), postal code (Canadian format validation), phone. "Ships within Canada only" note.
3. **Shipping method**: Standard (5–8 business days, free over $150 else $14.99) · Express (2–3 days, $24.99). Radio cards.
4. **Payment**: Stripe. In preview without keys, show a mock card form + a clear "Demo mode" banner; with keys, redirect to **Stripe Checkout** (or embedded Payment Element). Support Apple Pay / Google Pay via Stripe.
5. **Order summary** (sticky on desktop): editable line items, totals, promo, taxes, final total.
- Inline validation on every field, disabled `Place order` until valid, loading state on submit, graceful error surface. Trust badges (secure checkout, encrypted).

### 5.6 Order Confirmation `/order/success` (or `/order/[id]`)
- Big confirmation, order number, email-sent note, full order summary (items, totals, shipping address, method, ETA), `Continue shopping` CTA, "Track via email" note. Handles the post-Stripe redirect with session lookup; falls back to mock order in demo mode.

### 5.7 Account `/account` (lightweight, optional auth)
- Tabs: **Orders** (list with status), **Addresses**, **Profile**. If unauthenticated, show sign-in / create-account (email-based stub via NextAuth or a simple mock) — but the store is fully usable as a guest. Don't block the funnel.

### 5.8 Supporting pages
- `/size-guide` — measurement tables (chest, length) in CM + IN, fit notes.
- `/shipping-returns` — Canada shipping timelines/costs, 30-day returns, personalized = final sale, how to start a return.
- `/faq` — accordion: sizing, authenticity & labeling, shipping, returns, printing, payment.
- `/contact` — form (name, email, order #, message) with validation + success state; support email + response-time note.
- `/about` — Northvault story: Canadian, World Cup focus, the curation/"vault" idea, authenticity & honest labeling promise.
- `/search` — search overlay + results page across name/country/colorway with empty + results states.
- **404** — branded, `Back to Shop`.

---

## 6. CART & CHECKOUT LOGIC

- **CartContext** (React Context + reducer) persisted to `localStorage` (`northvault.cart`), hydration-safe (no SSR mismatch). API: `addItem`, `removeItem`, `updateQty`, `updateSize`, `applyPromo`, `clear`, plus derived `subtotal`, `itemCount`, `discount`, `shipping`, `tax`, `total`.
- Unique line key = `jerseyId + size + JSON(printing)` so a printed shirt and a blank one of the same size are separate lines.
- Promo: `WC2026` → 10% off subtotal. Invalid code → inline error.
- Shipping: free ≥ $150 subtotal (after discount), else method-based.
- Tax: flat 5% placeholder labeled "Estimated."
- **Stripe**: route handler / server action `createCheckoutSession` builds line items from the cart (incl. printing fee + shipping) and returns a redirect URL; webhook (or success-page session fetch) confirms the order. Read `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_*`; if missing, run **Demo mode** end-to-end with a mock order so preview works with zero config. Never hardcode keys.

---

## 7. RESPONSIVE · A11Y · SEO · PERF

- Mobile-first. Breakpoints: 1-col mobile, 2–3 tablet, 4 desktop grids. Mobile sticky add-to-cart; bottom-safe cart access.
- Accessibility: semantic HTML, labeled inputs, keyboard-navigable menus/drawers/modals, visible focus rings, `aria-live` for cart/toast updates, alt text on all images, AA contrast.
- SEO: per-page `<title>`/meta/OG, `next/image`, semantic headings, product JSON-LD on PDP.
- Performance: lazy-load below-the-fold images, skeleton loaders, optimistic cart updates.

---

## 8. DEFINITION OF DONE (acceptance criteria)

1. All 13 seed jerseys render on `/shop` and each has a working `/shop/[slug]` page.
2. A shopper can: filter + sort + search → open a product → pick a size (out-of-stock sizes blocked) → optionally add name/number printing → add to cart → see the drawer update → edit qty/size → apply `WC2026` → reach checkout → fill valid Canadian shipping → pay (Stripe or demo) → land on a confirmation page with an order number. No dead ends.
3. Cart persists across refresh. Counts, subtotals, discount, shipping, tax, and total are always correct.
4. Every state handled: empty cart, empty search/filter, loading, form errors, payment error, 404.
5. Header (with live cart badge), cart drawer, announcement bar, and footer appear on every page.
6. Fully responsive, keyboard-accessible, and runs in v0 preview with **no env vars** (demo mode) — Stripe + optional persistence activate when keys are added.
7. Brand system applied consistently: Archivo/Inter, the color tokens, flags beside team names, jerseys as the visual heroes.

**Build it complete. Wire every button. Leave nothing as a placeholder except the product photos.**
