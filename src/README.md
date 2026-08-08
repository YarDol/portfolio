# Architecture — Feature-Sliced Design

```
app       → Next.js router, providers, global styles, route handlers
views     → page compositions (FSD "pages" layer, renamed to avoid Next's pages router)
widgets   → self-contained page blocks (hero, about, contact, ai-chat, …)
features  → user interactions (contact-form, theme-toggle, voice-input, …)
entities  → business data + its presentation (project, skill, portfolio)
shared    → reusable, domain-agnostic code (config, i18n, ui, lib, seo)
```

## Import rule

A layer may only import from layers **below** it. Never sideways between slices
of the same layer, never upward.

```
app → views → widgets → features → entities → shared
```

## Slice segments

Each slice is a folder with a public API (`index.ts`) and these segments:

| Segment  | Contents                                                       |
| -------- | -------------------------------------------------------------- |
| `ui/`    | components                                                     |
| `model/` | domain data, types, stateful hooks                             |
| `lib/`   | slice-local helpers and stateless hooks                        |
| `config/`| static constants and tuning values                             |
| `api/`   | server actions and network calls                               |

## Public API

Cross-slice imports go through the slice root:

```ts
import { Hero } from "@/widgets/hero";          // ✅
import { Hero } from "@/widgets/hero/ui/hero";  // ❌
```

Inside a slice, use relative paths (`../config/motion`).

`shared` has no slices — import its segments directly (`@/shared/config`,
`@/shared/lib/rate-limit`). Segments that mix server-only and client-only code
are deliberately left un-barrelled so nothing leaks into the wrong bundle.

## Routing

`src/app` holds only Next.js entry points. Route files stay thin — they resolve
params, export `generateMetadata`, and delegate rendering to a `views/` slice.
