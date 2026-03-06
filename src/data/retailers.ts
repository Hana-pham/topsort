/**
 * retailers.ts — Mock retailer integration data
 *
 * In production, this data would be aggregated from:
 *   - POST /v2/auctions  → latency telemetry per region
 *   - POST /v2/events    → impression/click/purchase pipeline health
 *   - GET  /v2/campaigns → active campaign counts, budget status
 *   - GET  /v2/reports   → fill rate by category, ROAS metrics
 */

import type { RetailerMap } from "@/types/topsort";

export const RETAILERS: RetailerMap = {
  woolworths: {
    name: "Woolworths AU",
    type: "Grocery",
    kpi: {
      latency:   { value: "7.4ms", delta: "- 0.6ms vs yesterday",     dir: "up"   },
      apm:       { value: "2,847", delta: "+ 12% this hour",           dir: "up"   },
      fill:      { value: "73%",   delta: "- 4% — 3 empty categories", dir: "down" },
      drop:      { value: "1.8%",  delta: "Above 1.5% threshold",      dir: "down" },
      campaigns: { value: "341",   delta: "+ 18 new today",            dir: "up"   },
    },
    latencyStats: { p50: "3.2ms", p95: "7.4ms", p99: "11.2ms" },
    slaBadge:     { cls: "green", label: "WITHIN SLA" },
    fillBadge:    { cls: "red",   label: "3 EMPTY" },
    alertCount:   4,
    categories: [
      { name: "Dairy and Alternatives", sub: "14 active bids",                  pct: 92, color: "var(--tw-brand-green, #1A7A52)" },
      { name: "Beverages",              sub: "9 active bids",                   pct: 85, color: "#1A5FA8" },
      { name: "Fresh Produce",          sub: "3 active bids — declining",       pct: 58, color: "#E07B00" },
      { name: "Personal Care",          sub: "6 active bids",                   pct: 71, color: "#FF5C00" },
      { name: "Pet Supplies",           sub: "0 active bids — action required", pct: 0,  color: "#C0392B", warn: true },
    ],
    alerts: [
      { sev: "red",   title: "Pet Supplies — zero fill rate, no active campaigns",  meta: "Invite pet brands to Toppie to start bidding",        time: "2m"  },
      { sev: "red",   title: "Event drop rate at 1.8% — above 1.5% threshold",     meta: "P(conv) model degrading — review /v2/events",         time: "11m" },
      { sev: "amber", title: "3 campaigns exhausted daily budget before 11:00 AM",  meta: "Budget pacing issue — recommend daily cap review",    time: "43m" },
      { sev: "amber", title: "Fresh Produce fill rate dropped to 58% from 79%",     meta: "Seasonal campaign endings — 4 brands did not renew",  time: "2h"  },
      { sev: "blue",  title: "P99 latency spike to 14ms at 08:22–08:31 UTC",       meta: "Resolved — caused by catalog sync batch job overlap", time: "3h"  },
    ],
    pipeline: {
      hasIssue: true,
      steps: [
        { label: "Impressions",  count: "284,710",        ok: true  },
        { label: "Clicks",       count: "18,340",         ok: true  },
        { label: "Events Fired", count: "17,010 (-1.8%)", ok: false },
        { label: "Purchases",    count: "4,821",          ok: true  },
        { label: "P(conv) Fed",  count: "4,821",          ok: true  },
      ],
      note: "Missing click events give the Bidless engine incomplete feedback. Over time, P(conv) accuracy degrades — advertisers pay for clicks that never inform the learning loop, reducing ROAS across the retailer.",
    },
    endpoints: [
      { method: "POST", path: "/v2/auctions",  latency: "7.4ms",  latColor: "#1A7A52", uptime: "99.97%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/events",    latency: "12.1ms", latColor: "#B05E00", uptime: "99.81%", uptimeCls: "amber", segs: [0,0,2,0,0,1,0,0,0,2,0,0,0,0,2,0,0,0,0,0] },
      { method: "POST", path: "/v2/campaigns", latency: "9.2ms",  latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "GET",  path: "/v2/reports",   latency: "18.4ms", latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },

  coles: {
    name: "Coles Group",
    type: "Grocery",
    kpi: {
      latency:   { value: "8.1ms", delta: "+ 0.3ms vs yesterday",   dir: "down" },
      apm:       { value: "2,103", delta: "+ 5% this hour",          dir: "up"   },
      fill:      { value: "81%",   delta: "+ 2% vs last week",       dir: "up"   },
      drop:      { value: "0.9%",  delta: "Within 1.5% threshold",   dir: "up"   },
      campaigns: { value: "214",   delta: "+ 7 new today",           dir: "up"   },
    },
    latencyStats: { p50: "4.1ms", p95: "8.1ms", p99: "13.4ms" },
    slaBadge:     { cls: "amber", label: "P99 ELEVATED" },
    fillBadge:    { cls: "red",   label: "1 LOW" },
    alertCount:   2,
    categories: [
      { name: "Snacks and Confectionery", sub: "11 active bids",            pct: 94, color: "#1A7A52" },
      { name: "Beverages",                sub: "8 active bids",             pct: 88, color: "#1A5FA8" },
      { name: "Bakery",                   sub: "5 active bids",             pct: 79, color: "#FF5C00" },
      { name: "Household",                sub: "4 active bids",             pct: 67, color: "#B05E00" },
      { name: "Organic Range",            sub: "2 active bids — low coverage", pct: 34, color: "#E07B00" },
    ],
    alerts: [
      { sev: "amber", title: "Organic Range fill rate at 34% — below 40% threshold", meta: "Recruit organic brands to Toppie for this category", time: "18m" },
      { sev: "blue",  title: "P99 latency at 13.4ms — slightly above 10ms SLA",      meta: "Monitoring — no action required yet",               time: "1h"  },
    ],
    pipeline: {
      hasIssue: false,
      steps: [
        { label: "Impressions",  count: "196,440",        ok: true },
        { label: "Clicks",       count: "14,210",         ok: true },
        { label: "Events Fired", count: "14,082 (-0.9%)", ok: true },
        { label: "Purchases",    count: "3,940",          ok: true },
        { label: "P(conv) Fed",  count: "3,940",          ok: true },
      ],
      note: "Event pipeline is healthy. All click events are reaching the Bidless engine. P(conv) is receiving complete feedback, maintaining strong ROAS performance for Coles advertisers.",
    },
    endpoints: [
      { method: "POST", path: "/v2/auctions",  latency: "8.1ms",  latColor: "#B05E00", uptime: "99.94%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/events",    latency: "9.8ms",  latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/campaigns", latency: "11.2ms", latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "GET",  path: "/v2/reports",   latency: "22.1ms", latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },

  trademe: {
    name: "Trade Me NZ",
    type: "Marketplace",
    kpi: {
      latency:   { value: "5.9ms", delta: "- 1.2ms vs yesterday",          dir: "up"   },
      apm:       { value: "984",   delta: "+ 3% this hour",                 dir: "up"   },
      fill:      { value: "62%",   delta: "- 8% — 5 empty categories",      dir: "down" },
      drop:      { value: "2.4%",  delta: "Above 1.5% threshold — critical", dir: "down" },
      campaigns: { value: "128",   delta: "+ 4 new today",                  dir: "up"   },
    },
    latencyStats: { p50: "2.8ms", p95: "5.9ms", p99: "9.1ms" },
    slaBadge:     { cls: "green", label: "WITHIN SLA" },
    fillBadge:    { cls: "red",   label: "5 EMPTY" },
    alertCount:   6,
    categories: [
      { name: "Electronics",     sub: "7 active bids",          pct: 78, color: "#1A5FA8" },
      { name: "Clothing",        sub: "5 active bids",          pct: 61, color: "#FF5C00" },
      { name: "Home and Garden", sub: "2 active bids",          pct: 44, color: "#B05E00" },
      { name: "Motors",          sub: "0 active bids — empty",  pct: 0,  color: "#C0392B", warn: true },
      { name: "Books and Media", sub: "0 active bids — empty",  pct: 0,  color: "#C0392B", warn: true },
    ],
    alerts: [
      { sev: "red",   title: "Motors — zero fill rate, no active campaigns",   meta: "Invite automotive brands to Toppie immediately",      time: "5m"  },
      { sev: "red",   title: "Books and Media — zero fill rate",               meta: "Category has had no bids for 3 days",                 time: "3h"  },
      { sev: "red",   title: "Event drop rate at 2.4% — critical threshold",   meta: "P(conv) accuracy significantly degrading",            time: "8m"  },
      { sev: "amber", title: "Home and Garden fill rate at 44%",               meta: "Down from 71% — seasonal shift",                     time: "1h"  },
      { sev: "amber", title: "4 campaigns budget-exhausted before midday",     meta: "Budget pacing requires review",                       time: "2h"  },
      { sev: "blue",  title: "New integration deployed — monitoring for 24h",  meta: "No anomalies detected so far",                        time: "4h"  },
    ],
    pipeline: {
      hasIssue: true,
      steps: [
        { label: "Impressions",  count: "88,210",         ok: true  },
        { label: "Clicks",       count: "6,440",          ok: true  },
        { label: "Events Fired", count: "6,285 (-2.4%)",  ok: false },
        { label: "Purchases",    count: "1,840",          ok: true  },
        { label: "P(conv) Fed",  count: "1,840",          ok: true  },
      ],
      note: "Drop rate at 2.4% — critical. Events not reaching the engine mean P(conv) is learning from incomplete data. This directly reduces Bidless accuracy and advertiser ROAS on Trade Me.",
    },
    endpoints: [
      { method: "POST", path: "/v2/auctions",  latency: "5.9ms",  latColor: "#1A7A52", uptime: "99.91%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0] },
      { method: "POST", path: "/v2/events",    latency: "14.2ms", latColor: "#C0392B", uptime: "99.52%", uptimeCls: "red",   segs: [0,1,0,0,2,0,0,1,0,0,0,2,0,0,0,1,0,0,0,0] },
      { method: "POST", path: "/v2/campaigns", latency: "10.8ms", latColor: "#B05E00", uptime: "99.88%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0] },
      { method: "GET",  path: "/v2/reports",   latency: "19.7ms", latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },

  poshmark: {
    name: "Poshmark US",
    type: "Fashion",
    kpi: {
      latency:   { value: "6.2ms", delta: "- 0.4ms vs yesterday", dir: "up" },
      apm:       { value: "3,412", delta: "+ 21% this hour",       dir: "up" },
      fill:      { value: "89%",   delta: "+ 6% vs last week",     dir: "up" },
      drop:      { value: "0.6%",  delta: "Well within threshold", dir: "up" },
      campaigns: { value: "512",   delta: "+ 44 new today",        dir: "up" },
    },
    latencyStats: { p50: "2.9ms", p95: "6.2ms", p99: "8.8ms" },
    slaBadge:     { cls: "green", label: "WITHIN SLA" },
    fillBadge:    { cls: "green", label: "ALL HEALTHY" },
    alertCount:   1,
    categories: [
      { name: "Womens Clothing", sub: "28 active bids", pct: 97, color: "#1A7A52" },
      { name: "Shoes",           sub: "21 active bids", pct: 94, color: "#1A7A52" },
      { name: "Handbags",        sub: "18 active bids", pct: 91, color: "#1A5FA8" },
      { name: "Mens Clothing",   sub: "14 active bids", pct: 83, color: "#FF5C00" },
      { name: "Accessories",     sub: "9 active bids",  pct: 74, color: "#B05E00" },
    ],
    alerts: [
      { sev: "blue", title: "Scheduled maintenance window in 48 hours", meta: "Sunday 02:00–04:00 UTC — plan accordingly", time: "2d" },
    ],
    pipeline: {
      hasIssue: false,
      steps: [
        { label: "Impressions",  count: "421,880",        ok: true },
        { label: "Clicks",       count: "31,240",         ok: true },
        { label: "Events Fired", count: "31,052 (-0.6%)", ok: true },
        { label: "Purchases",    count: "8,940",          ok: true },
        { label: "P(conv) Fed",  count: "8,940",          ok: true },
      ],
      note: "Pipeline is healthy. Poshmark has the strongest event reliability on the network. Bidless is receiving near-complete feedback, driving excellent ROAS for fashion advertisers.",
    },
    endpoints: [
      { method: "POST", path: "/v2/auctions",  latency: "6.2ms",  latColor: "#1A7A52", uptime: "99.99%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/events",    latency: "8.4ms",  latColor: "#1A7A52", uptime: "99.98%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/campaigns", latency: "7.9ms",  latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "GET",  path: "/v2/reports",   latency: "16.1ms", latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
  },

  doordash: {
    name: "DoorDash AU",
    type: "Delivery",
    kpi: {
      latency:   { value: "9.4ms", delta: "+ 1.1ms — approaching SLA", dir: "down" },
      apm:       { value: "1,644", delta: "- 3% this hour",             dir: "down" },
      fill:      { value: "55%",   delta: "- 11% — peak dinner hours",  dir: "down" },
      drop:      { value: "1.2%",  delta: "Within 1.5% threshold",      dir: "up"   },
      campaigns: { value: "187",   delta: "+ 12 new today",             dir: "up"   },
    },
    latencyStats: { p50: "5.1ms", p95: "9.4ms", p99: "14.8ms" },
    slaBadge:     { cls: "red",   label: "P99 EXCEEDS SLA" },
    fillBadge:    { cls: "red",   label: "4 EMPTY" },
    alertCount:   3,
    categories: [
      { name: "Fast Food",       sub: "12 active bids",        pct: 82, color: "#1A7A52" },
      { name: "Asian Cuisine",   sub: "8 active bids",         pct: 71, color: "#1A5FA8" },
      { name: "Healthy Options", sub: "3 active bids",         pct: 48, color: "#B05E00" },
      { name: "Late Night",      sub: "0 active bids — empty", pct: 0,  color: "#C0392B", warn: true },
      { name: "Desserts",        sub: "0 active bids — empty", pct: 0,  color: "#C0392B", warn: true },
    ],
    alerts: [
      { sev: "red",   title: "P99 latency at 14.8ms — exceeds 10ms SLA ceiling",  meta: "Likely peak-hour load — investigate edge server capacity", time: "4m"  },
      { sev: "red",   title: "Late Night and Desserts — zero fill rate",           meta: "High-value dinner slots going unfilled nightly",           time: "1h"  },
      { sev: "amber", title: "Auction latency at 9.4ms P95 — approaching threshold", meta: "P95 within SLA but trending upward — monitor closely",  time: "22m" },
    ],
    pipeline: {
      hasIssue: false,
      steps: [
        { label: "Impressions",  count: "142,670",        ok: true },
        { label: "Clicks",       count: "11,880",         ok: true },
        { label: "Events Fired", count: "11,737 (-1.2%)", ok: true },
        { label: "Purchases",    count: "3,210",          ok: true },
        { label: "P(conv) Fed",  count: "3,210",          ok: true },
      ],
      note: "Event pipeline is within acceptable range at 1.2% drop. Key concern is latency — P99 exceeding SLA during peak dinner hours suggests the Sydney edge server may need additional capacity.",
    },
    endpoints: [
      { method: "POST", path: "/v2/auctions",  latency: "9.4ms",  latColor: "#B05E00", uptime: "99.88%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/events",    latency: "11.2ms", latColor: "#B05E00", uptime: "99.91%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0] },
      { method: "POST", path: "/v2/campaigns", latency: "8.8ms",  latColor: "#1A7A52", uptime: "100%",   uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { method: "GET",  path: "/v2/reports",   latency: "21.4ms", latColor: "#1A7A52", uptime: "99.97%", uptimeCls: "green", segs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0] },
    ],
  },
};
