# Topsort Integration Health Dashboard

> **Concept project** — Built as part of my application for the Software Engineer, Integrations role at Topsort. Transparent about that. The goal was to understand your actual API architecture, not just the pitch deck version, and build something that reflects how I think about integration problems.

---

## What this is

A real-time integration health dashboard for monitoring retailer integrations across Topsort's v2 API. It surfaces the three problems I'd want visibility on as an integration engineer:

1. **Auction latency** — Is `/v2/auctions` staying under the 10ms SLA? P95/P99 breakdowns, 24h chart, spike detection.
2. **Fill rate by category** — Which ad slots are empty? Zero-fill categories mean lost revenue and brands that haven't been invited to Toppie yet.
3. **Event pipeline health** — Is the impression → click → purchase chain complete? Drop rate directly degrades P(conv) model accuracy and advertiser ROAS.

Five retailers with distinct health profiles — Woolworths AU, Coles Group, Trade Me NZ, Poshmark US, DoorDash AU. Switching retailers updates all panels live.

---

## Stack

Matches Topsort's own tooling:

| Layer      | Choice          | Why                                                              |
|------------|-----------------|------------------------------------------------------------------|
| Framework  | Next.js 14      | App Router, SSR-ready, Topsort's topsort.js SDK explicitly supports it |
| Language   | TypeScript      | Types modelled on Topsort's OpenAPI 3.1.0 spec                  |
| Styling    | Tailwind CSS    | Utility-first, matches Topsort's design system patterns          |
| API client | `@topsort/sdk`  | Mock client mirrors real SDK interface — swap with one line      |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Main dashboard — retailer state, layout
│   └── globals.css         # Tailwind base + CSS custom properties
│
├── components/
│   ├── Sidebar.tsx         # Navigation + retailer switcher
│   ├── KpiStrip.tsx        # Five KPI cards (latency, APM, fill, drop, campaigns)
│   ├── LatencyChart.tsx    # 24h bar chart with SLA reference line
│   ├── FillRate.tsx        # Category fill rate with animated bars
│   ├── AlertsList.tsx      # Severity-ranked alert feed
│   ├── Pipeline.tsx        # Impression → click → purchase event flow
│   ├── EndpointTable.tsx   # /v2/auctions, /v2/events, /v2/campaigns uptime
│   └── ui/
│       ├── Badge.tsx       # Reusable severity badge
│       └── Panel.tsx       # Card wrapper with consistent header
│
├── data/
│   └── retailers.ts        # Mock data per retailer — maps to real API responses
│
├── lib/
│   └── topsort.ts          # Mock API client mirroring @topsort/sdk interface
│
└── types/
    └── topsort.ts          # TypeScript types matching Topsort v2 API schema
```

---

## API architecture

The mock client in `src/lib/topsort.ts` mirrors the real `@topsort/sdk` interface. Swapping to live data is a one-line change per method:

```ts
// Current (mock)
import { topsortClient } from "@/lib/topsort";

// Production
import TopsortClient from "@topsort/sdk";
const topsortClient = new TopsortClient({ apiKey: process.env.TOPSORT_API_KEY });
```

The three endpoints the dashboard monitors:

```ts
// POST /v2/auctions — real-time bidding, <10ms SLA
const result = await topsortClient.runAuction({ auctions: [...] });

// POST /v2/events — impression/click/purchase tracking for P(conv)
await topsortClient.reportEvent({ eventType: "Click", ... });

// GET /v2/campaigns — active campaigns, budget status
const campaigns = await topsortClient.listCampaigns({ status: "active" });
```

TypeScript types in `src/types/topsort.ts` are modelled directly on Topsort's [OpenAPI 3.1.0 spec](https://docs.topsort.com), including:
- `AuctionRequest` / `AuctionResponse` — with `pConv` field on winners
- `ImpressionEvent` / `ClickEvent` / `PurchaseEvent` — typed union
- `Campaign` — with `BiddingStrategy: "BIDLESS" | "MANUAL_CPC" | "TARGET_ROAS"`

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run type-check   # TypeScript validation
npm run build        # Production build
```

---

## What I'd build next

If this were a real internal tool:

- **Webhook integration** — Topsort can push events; real-time updates via Server-Sent Events instead of polling
- **Alert routing** — Severity thresholds trigger Slack/PagerDuty via the same n8n patterns I've used for client integrations
- **Historical ROAS** — Pull from `/v2/reports` to show P(conv) accuracy trends over time, not just current drop rate
- **Multi-region latency** — Edge server latency broken down by region (ANZ vs Europe vs US) to surface cold-start issues in new markets

---

## About

Built by **Hana Pham** — Software Engineer at Cloud Native, Sydney.

References: [docs.topsort.com](https://docs.topsort.com) · [github.com/Topsort](https://github.com/Topsort) · [topsort.js SDK](https://github.com/Topsort/topsort.js)
