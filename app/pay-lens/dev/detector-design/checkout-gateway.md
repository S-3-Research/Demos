# Payment Gateway Detector — Design Document

---

## 1. Overall Detection Flow

```
PRODUCT_URL env var
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│ Init — register network listeners (before any goto)     │
│  • browser.newContext()  — custom UA, isolated session  │
│  • page.on('request')    — log URLs + run URL scan      │
│  • context.on('page')    — auto-hook new tabs,          │
│                            track activePage             │
│  • attachResponseListener() — response JSON scan        │
│    All listeners must be registered BEFORE goto()       │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌── Step 1 ──────────────────────────────────────────────┐
│ Load product page                                       │
│  page.goto(productUrl, waitUntil: 'domcontentloaded')   │
│  dismissModals()                                        │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── Step 2 ──────────────────────────────────────────────┐
│ Select an in-stock variant                              │
│  • <select> dropdown → skip "sold out" options          │
│  • radio / swatch    → skip .disabled / .out-of-stock   │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── Step 3 ──────────────────────────────────────────────┐
│ Add to Cart                                             │
│  • Try multiple selectors (WooCommerce / Shopify / …)   │
│  • Skip disabled / "sold out" buttons                   │
│  • Watch for new tab (Shopify may open checkout inline) │
│                                                         │
│  Network-first success detection (cloud-latency fix):   │
│  Before every ATC click, hoist a waitForResponse() for  │
│  cart API URLs (POST/PUT, status<400, regex:            │
│  add-to-cart|cart/items|ecom-cart.*add …).              │
│  If the API responds → return true immediately,         │
│  without waiting for slow DOM updates.                  │
│  Fallback: DOM-based waitAndCheck (badge, side-cart).   │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── Step 4 ──────────────────────────────────────────────┐
│ Navigate to Checkout  →  navigateToCheckoutSM()         │
│  State-machine loop (see §7 for full details)           │
│  Fills contact/address info as a regular transition     │
│  action (first time fillContactInfo runs, maxTries:1    │
│  globally — so it fires once total across all states)   │
│                                                         │
│  Terminal success : CHECKOUT_PAYMENT_STEP               │
│  Terminal failures: SIGN_IN_WALL, CART_EMPTY,           │
│                     EXHAUSTED  → navBlocked = NavError  │
└────────────────────────────────────────────────────────┘
        │
        ▼  (skipped entirely if navBlocked)
┌── Step 5 ──────────────────────────────────────────────┐
│ Select card payment  (only when !navBlocked)            │
│                                                         │
│  iteratePaymentOptions()                                │
│    1. waitForPaymentUI (3 s) — internal, not duplicated │
│    2. find all payment radio buttons                    │
│    3. for each: click → collectEvidence() callback      │
│       └─ captures lazy-loaded gateway JS/iframes        │
│                                                         │
│  Fallback (iterCount = 0, tile/tab-based UIs):          │
│    selectCardPaymentOption()  — broader selector set    │
│    if selected → collectEvidence()                      │
│    if not found → warn                                  │
└────────────────────────────────────────────────────────┘
        │
        ▼  (ALWAYS runs, regardless of Step 5 outcome)
┌── Step 6 ──────────────────────────────────────────────┐
│ Collect evidence  →  collectEvidence()                  │
│  Guarantees at least one full sweep even if Step 5      │
│  was skipped (navBlocked) or found nothing.             │
│                                                         │
│  collectEvidence() = collectAllHtml() + scan:           │
│    collectAllHtml():                                     │
│      activePage.content()                               │
│      + all activePage frames                            │
│      + all other open tabs (e.g. Wix checkout tab)      │
│    matchSignaturesInHtml()  — HTML regex scan           │
│    scanDomForEntities()     — precise DOM queries        │
│      radio/label/logo/data-attr/script[src]             │
│      each node: visibility via getComputedStyle chain   │
│                                                         │
│  Screenshot (fullPage)                                  │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── finaliseEntities() ──────────────────────────────────┐
│  1. deriveAvailability() — infer available from signals │
│  2. Sort: confidence high→low, signal count desc        │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── Output ──────────────────────────────────────────────┐
│  result-summary.json  — all DetectedEntity + metadata   │
│  entities.json        — structured entity list          │
│  network-log.json     — network signals + request list  │
│  evidence.csv         — one row per signal              │
│  payment-page.html    — full page HTML dump             │
│  payment-page.png     — screenshot                      │
└────────────────────────────────────────────────────────┘
        │
        ▼
┌── Cleanup (afterEach) ─────────────────────────────────┐
│  1. All pages goto('about:blank')                       │
│  2. Close all pages                                     │
│  3. Promise.race(context.close(), 6 s timeout)          │
│     ↑ works around Stripe WebSocket hang on m.stripe.com│
└────────────────────────────────────────────────────────┘
```

---

## 2. Four Detection Paths

> All four paths write into a single shared `entityMap` that accumulates signals
> across the entire test run.

### Path 1 — Network Request URL  *(real-time, via listener)*

```
page.on('request') / context.on('page') fires
        │
        ├─ allNetworkUrls.push()          → written to network-log.json
        ├─ matchSignaturesInUrl()
        │    └─ match GATEWAY_SIGNATURES.networkPatterns  → via: 'request-url'
        └─ match GATEWAY_SIGNATURES.scriptPatterns        → via: 'html-script-src'
```

Registered before `page.goto()` — captures every request from the first byte.
Automatically hooks every new tab opened during the test.

---

### Path 2 — Full-page HTML Regex  *(via `collectEvidence`)*

```
collectAllHtml(context, activePage)
  └─ activePage.content()
     + all activePage.frames() content
     + all other open tabs content
        │
        └─ matchSignaturesInHtml()
             └─ match each signature.htmlPatterns
                  hit → rawValue = 80 chars before + 120 chars after match
                  via: 'html-text'
```

---

### Path 3 — Precise DOM Queries  *(via `collectEvidence`)*

```
scanDomForEntities(activePage)
  └─ page.evaluate()  (single round-trip, batched)
        │
        ├─ querySelectorAll('input[type=radio][name*=payment]…')
        │    → via: 'html-radio'        rawValue = cloneNode(false).outerHTML
        │    → via: 'html-radio-label'  rawValue = label.textContent
        │
        ├─ querySelectorAll('img[src*=visa|mastercard|paypal…]')
        │    → via: 'html-logo'         rawValue = cloneNode(false).outerHTML
        │
        ├─ querySelectorAll('[data-gateway],[data-payment-method]…')
        │    → via: 'html-attribute'    rawValue = cloneNode(false).outerHTML
        │
        └─ querySelectorAll('script[src]')
             → via: 'html-script-src'   rawValue = full src URL
```

Each node includes a **visibility check** (getComputedStyle, walks up the ancestor chain).

#### `collectEvidence()` — shared sweep helper

Paths 2 and 3 are always called together through a single helper:

```typescript
collectEvidence(context, activePage, entityMap)
  1. collectAllHtml()          → page + all frames + other tabs
  2. matchSignaturesInHtml()   → Path 2
  3. scanDomForEntities()      → Path 3
  returns: allHtml string      → reused by artifact saving in Step 6
```

Called from three places:
- **Step 5 iteration callback** — after each payment radio is clicked
- **Step 5 fallback** — after `selectCardPaymentOption()` succeeds (tile/tab UIs)
- **Step 6** — always, regardless of Step 5 outcome (guaranteed minimum one sweep)

> **Signal deduplication:** `upsertEntity()` checks `via + detail` before pushing.
> If the same DOM node or HTML fragment is matched across multiple sweeps, only
> the first occurrence is recorded. Signal counts in the output reflect unique evidence,
> not how many times `collectEvidence` was called.

---

### Path 4 — Response JSON Whitelist  *(real-time, via listener)*

```
context.on('response') fires
        │
        └─ check URL against signature.responseWhitelist[].urlFragment
             │  match → parse JSON body → extract() → {key, value}[]
             │             → via: 'response-json'
             └─ no match → ignored
```

Registered before `page.goto()` — responses during initial page load are captured.

Whitelist examples:

| Signature | URL fragment | Extracted fields |
|---|---|---|
| Stripe | `/v1/elements/sessions` | `payment_method_types`, `ordered_payment_methods` |
| Stripe | `/v1/payment_intents` | `card_brand`, `wallet_type` |
| Adyen  | `/v68/sessions` | `paymentMethods[].name` |

---

## 3. Signal Types

| `via` | `source` | `visible` field | Typical rawValue |
|---|---|---|---|
| `request-url` | network | — | `[POST] https://api.stripe.com/v1/payment_intents` |
| `response-json` | network | — | `payment_method_types: card, us_bank_account` |
| `html-script-src` (network) | network | — | `https://js.stripe.com/v3/` |
| `html-text` | html | — | `…publishableKey:"pk_live_xxx",stripe.js/v3…` |
| `html-script-src` (DOM) | html | — | `https://js.stripe.com/v3/` |
| `html-radio` | html | **meaningful** | `<input type="radio" value="stripe" id="…">` |
| `html-radio-label` | html | **meaningful** | `Credit / Debit Card (Stripe)` |
| `html-logo` | html | **meaningful** | `<img src="…stripe-logo.svg" alt="Stripe">` |
| `html-attribute` | html | **meaningful** | `<li class="payment-method" data-gateway="stripe">` |

> `visible` is only meaningful for the last four DOM-based signal types.

---

## 4. Confidence Rules

### Mapping by `via`

```
high   ┌─ response-json       server-side payment config, most authoritative
       ├─ html-radio          user-visible payment option node
       └─ request-url (api)   actual API call (POST /v1/payment_intents etc.)

medium ┌─ request-url (cdn)   CDN/SDK load (js.stripe.com etc.)
       ├─ html-script-src     <script src> present; SDK loaded but not confirmed active
       ├─ html-radio-label    label text match; may be descriptive copy
       ├─ html-logo           logo shown does not confirm the method is selectable
       └─ html-attribute      data-* attr; may be styling config

low    └─ html-text           HTML source regex; may be comment / dead code / 3rd-party
```

### URL Heuristic Classification (request-url only)

```
input: URL + HTTP method
        │
        ├─ subdomain prefix = js. / cdn. / static. / assets. / widget.  → cdn
        ├─ path ends with .js / .css                                     → cdn
        │
        ├─ subdomain prefix = api. / hooks. / checkout. / secure. /
        │                      gateway. / pay. / m.                      → api
        ├─ path contains /v1/ /v2/ /api/ /payment /intent
        │                /session /charge /order /confirm /elements      → api
        ├─ method = POST / PUT / PATCH                                   → api
        │
        └─ other                                                         → unknown (→ medium)
```

### Entity confidence = highest signal level

```
entity.confidence = max(signalConfidence(s) for s in signals)
```

---

## 5. Availability Rules

### Inference logic (`deriveAvailability`)

```
entity.signals
        │
        ├─ filter signals where visible !== undefined  (DOM visible signals)
        │
        ├─ if DOM signal count = 0
        │    → available = false
        │      (only network / HTML-text matches; no DOM node found)
        │
        ├─ if any signal has visible = true
        │    → available = true
        │
        └─ if all DOM signals have visible = false
             → available = false
               unavailableReason = 'css-hidden'
```

### `unavailableReason` enum

| Value | Meaning | When set |
|---|---|---|
| `css-hidden` | Node exists but getComputedStyle deems it invisible | `scanDomForEntities` |
| `browser-unsupported` | Browser does not support (e.g. Apple Pay on non-Safari) | reserved |
| `session-check-failed` | `canMakePayments()` returned false | reserved |
| `not-rendered` | Network / text match only, no DOM node | implied by `deriveAvailability` |

---

## 6. Availability × Confidence Matrix

```
                    available = true          available = false
                 ┌────────────────────────┬──────────────────────────┐
confidence=high  │ ✅ Confirmed available  │ ⚠️  Integrated, hidden   │
                 │  method active,         │   API called / radio     │
                 │  DOM visible & clickable│   found but CSS-hidden   │
                 │  e.g. Stripe main flow  │   e.g. Apple Pay         │
                 ├────────────────────────┼──────────────────────────┤
confidence=medium│ 🟡 Likely available     │ 🔶 Exists, state unclear  │
                 │  SDK loaded / logo      │   script present but no  │
                 │  visible; no API call   │   visible payment node   │
                 │  e.g. newly added GW    │   e.g. A/B-tested off    │
                 ├────────────────────────┼──────────────────────────┤
confidence=low   │ 🔵 Weak signal          │ ❌ Low value, ignorable   │
                 │  HTML source match,     │   mentioned in source    │
                 │  DOM happens visible    │   but neither rendered   │
                 │  e.g. footer mention    │   nor any network req    │
                 └────────────────────────┴──────────────────────────┘
```

### Business query examples

| Question | Filter |
|---|---|
| Which payment methods are available now? | `available=true` |
| Which gateways detected with high certainty? | `confidence=high` |
| Integrated but not visible to the user? | `available=false AND confidence=high` |
| Remove noise, only valuable signals? | `confidence != low` |
| Supports Visa/MC but not PayPal? | `name in [Visa,Mastercard] AND available=true`, PayPal not in `available=true` list |
| Was the gateway actually activated? | `signals` contains `via=response-json OR via=request-url(api)` |

---

## 7. Checkout Navigation State Machine (`navigateToCheckoutSM`)

### Overview

After ATC, navigation to checkout is handled by a **state-machine loop** rather than a fixed sequence. Each iteration:

1. **Detect** current page state (always fresh — never assumes)
2. **Handle terminals** (return on success, throw on failure)
3. **Pick and run** the next action for this state (round-robin Tier 1, then Tier 2)
4. **Settle** (wait for DOM/AJAX to stabilise)
5. Repeat

`fillContactInfo` is a **regular Tier-1 action** in the transition table (not a side-effect).
`tryCounts` is shared globally across states — with `maxTries: 1`, it fires at most once
total, whether it's first triggered on `CART_PAGE` or `CHECKOUT_PAGE`.

### `fillContactInfo` — fast-exit, hydration wait & speed optimisations

**Early termination (no form on this page) + cloud hydration wait:**

```
page.evaluate() — one round-trip, checks all selectors at once
  any match?
    NO  → Promise.race(waitForSelector × 7 common selectors, timeout: 5000 ms)
            catches slow JS hydration in cloud (Lambda / Batch)
            still none → return immediately (no 10 s timeout penalty)
    YES → proceed to fill
```

Cloud environments (Lambda / Fargate) hydrate Wix checkout forms significantly
slower than local. The previous fixed `waitForTimeout(800 ms)` was too short;
it is replaced by a `Promise.race` across the 7 most common first-field
selectors with a 5 s cap — resolves as soon as any one appears:

```typescript
const commonSelectors = [
  'input[type="email"]', 'input[name*="email"]',
  'input[name*="first"]', 'input[name*="firstName"]',
  '[data-hook*="form-field"]',
  'input[autocomplete*="given-name"]', 'input[placeholder*="First"]',
];
await Promise.race(
  commonSelectors.map((sel) =>
    page.waitForSelector(sel, { state: 'attached', timeout: 5000 }).catch(() => {}),
  ),
);
```

Before this change: fixed `waitForTimeout(800 ms)` — too short for cloud latency.

**Per-field speed:**

> **Additional cloud-latency fixes (same session):**
>
> 1. **Cart page hydration wait** — after navigating to a cart URL, before reading
>    the badge count, a `Promise.race` waits up to 5 s for `CART_ITEM_SELECTOR`
>    or a cart-count badge element to attach. Wix/Shopify cart pages render a
>    skeleton first; without this wait the badge is not yet in the DOM and the
>    state machine incorrectly detects `CART_EMPTY`.
>
> 2. **CHECKOUT state payment-option wait** — before calling `paymentVisible`
>    evaluate to distinguish `CHECKOUT_PAGE` vs `CHECKOUT_PAYMENT_STEP`, a
>    `Promise.race` waits up to 3 s for any payment radio/tile/option element to
>    become visible. Prevents the state from sticking as `CHECKOUT_PAGE` when
>    options are merely still loading.

| Operation | Before | After | Saving |
|---|---|---|---|
| combobox typing | `type(char)` × N + `waitForTimeout(40ms)` each | `keyboard.type(value, {delay:0})` | ~500 ms for "United States" |
| text input fallback | `type(char)` × N + `waitForTimeout(20ms)` each | `keyboard.type(value, {delay:0})` + one 50 ms settle | ~200–400 ms per field |
| post-fill settle | `waitForTimeout(80ms)` always | removed (read value directly) | 80 ms per field |

### Page States

| State | Description | Terminal? |
|---|---|---|
| `PRODUCT_PAGE` | Product page, no ATC success signal yet | — |
| `PRODUCT_PAGE_ATC_DONE` | Product page with visible ATC success notice | — |
| `CART_PAGE` | Cart URL + cart items present | — |
| `CART_EMPTY` | Cart URL but no items | ❌ fail |
| `CHECKOUT_PAGE` | Checkout URL, payment options not yet visible (still filling forms) | — |
| `CHECKOUT_PAYMENT_STEP` | Checkout URL + payment options visible | ✅ success |
| `SIGN_IN_WALL` | Login / sign-in required | ❌ fail |
| `BLOCKED_MODAL` | Age gate / cookie consent / overlay | ⚠️ disabled |
| `UNKNOWN` | None of the above | — |

> **`BLOCKED_MODAL` is currently disabled** — detection was producing false positives on generic page buttons.
> Age-gate / cookie-consent dismissal is handled upstream, before `navigateToCheckoutSM` is called.

### State Detection Order (`detectPageState`)

```
1. SIGN_IN_WALL          — URL regex (/login, /sign-in, /my-account)
                           OR visible password input (not a payment card field)

2. BLOCKED_MODAL         — DISABLED

3. CHECKOUT_PAYMENT_STEP — URL contains "checkout" or "order"
                           AND at least one payment option element is visible
                           (radio/tile/tab with getComputedStyle check)

   CHECKOUT_PAGE         — URL contains "checkout" or "order"
                           but payment options not yet visible

4. CART_PAGE /    — URL matches /cart, /basket, /shopping-cart, /bag
   CART_EMPTY       → CART_PAGE  if CART_ITEM_SELECTOR element found
                    → CART_PAGE  if cart-count badge text parses to > 0
                    → CART_EMPTY otherwise

5. PRODUCT_PAGE_  — visible ATC success element
   ATC_DONE         (.woocommerce-message, [class*="added-to-cart"] …)

6. PRODUCT_PAGE   — ATC button or form present in DOM

7. UNKNOWN        — none of the above
```

### Empty Cart Detection (step 4 detail)

Two independent signals on cart URLs, applied in order:

```
1. CART_ITEM_SELECTOR  — checks for cart item DOM elements
   [class*="cart-item"], [class*="cart_item"], .woocommerce-cart-form, [data-cart-item]

2. Cart count badge    — parses numeric text of count elements
   [class*="cart-count"], [class*="cart-quantity"],
   .cart-contents-count, [data-hook="items-count"]
   → count > 0  : CART_PAGE  (items exist even if selector missed them)
   → count = 0  : CART_EMPTY
   → not found  : CART_EMPTY
```

### Action Tiers

| Tier | Actions | max tries | Scheduling |
|---|---|---|---|
| **Tier 1** | `fillContactInfo` | 1 (global) | Round-robin; runs once total across all states |
| **Tier 1** | `clickCheckoutButton` | 3 | Round-robin |
| **Tier 1** | `clickViewCart` | 3 | Round-robin |
| **Tier 1** | `advanceCheckoutStep` | 5 | Round-robin |
| **Tier 1** | `dismissModal` | 3 | Round-robin |
| **Tier 2** (last resort) | `directNavigateCart` | 1 | Sequential, after Tier-1 exhausted |
| **Tier 2** (last resort) | `directNavigateCheckout` | 1 | Sequential, after Tier-1 exhausted |

### Round-Robin Scheduler

```
roundUsed = {}   ← resets when state changes

each iteration:
  tier1Remaining = Tier-1 actions with tries left

  if tier1Remaining not empty:
    next = first in tier1Remaining not yet in roundUsed
    if none → roundUsed.clear(), start new round, pick first

  else (Tier-1 exhausted):
    next = first Tier-2 action with tries left
    if none → throw EXHAUSTED
```

**Why round-robin?**
A `clickViewCart` call may open a mini-cart drawer (URL unchanged, state stays `PRODUCT_PAGE`)
that injects a checkout button into the DOM. Sequential scheduling would exhaust
`clickCheckoutButton` before the drawer ever opens. Round-robin ensures every Tier-1
action gets one attempt per round, interleaved with others, so a DOM change triggered
by one action can be exploited by another in the next round.

**Why share `tryCounts` across states?**
A global spend counter prevents infinite retries when the same action repeatedly fails
across state transitions. The round reset (`roundUsed.clear()`) handles DOM-change
opportunities within the same state.

### Post-Action Settle Wait

After every action, before re-detecting:

```
URL changed  → waitForLoadState('domcontentloaded') + 3 s cap
URL same     → waitForTimeout(1200 ms)   ← AJAX / drawer injection settle time
```

### Debug Mode

```typescript
await navigateToCheckoutSM(page, { debug: true });
```

When `debug: true`, the loop pauses at every `CART_PAGE` iteration and waits for
Enter in the terminal — useful for inspecting cart DOM mid-run.

### Transition Table

| State | Tier-1 (round-robin) | Tier-2 (last resort) |
|---|---|---|
| `PRODUCT_PAGE` | clickCheckout → clickViewCart | directCart → directCheckout |
| `PRODUCT_PAGE_ATC_DONE` | clickCheckout → clickViewCart | directCart → directCheckout |
| `CART_PAGE` | fillContact → clickCheckout | directCheckout |
| `CHECKOUT_PAGE` | fillContact → advanceCheckoutStep | — |
| `UNKNOWN` | clickCheckout → clickViewCart | directCart → directCheckout |
| `BLOCKED_MODAL` | dismissModal | — |

> `fillContact` has `maxTries: 1` shared globally. Whichever state triggers it first
> (usually `CART_PAGE` on Wix, or `CHECKOUT_PAGE` on WooCommerce), it won't run again.
