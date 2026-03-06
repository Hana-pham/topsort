/**
 * types/index.ts
 *
 * Types aligned with Topsort's @topsort/sdk and v2 API contracts.
 * Ref: https://docs.topsort.com/reference/
 */

// ── Topsort API response shapes ─────────────────────────────────────

/** Mirrors a winner from POST /v2/auctions */
export interface AuctionWinner {
  rank: number;
  type: "product" | "banner";
  id: string;
  resolvedBidId: string;
}

/** Mirrors POST /v2/auctions response */
export interface AuctionResult {
  winners: AuctionWinner[];
  error: boolean;
}

// ── Dashboard-specific types ─────────────────────────────────────────

export type Severity = "red" | "amber" | "blue" | "green";
export type Direction = "up" | "down";
export type BadgeVariant = "red" | "amber" | "green" | "blue" | "orange";

export interface KpiMetric {
  value: string;
  delta: string;
  dir: Direction;
}

export interface LatencyStats {
  p50: string;
  p95: string;
  p99: string;
}

export interface SlaBadge {
  cls: BadgeVariant;
  label: string;
}

export interface FillBadge {
  cls: BadgeVariant;
  label: string;
}

export interface Category {
  name: string;
  sub: string;
  pct: number;
  color: string;
  warn?: boolean;
}

export interface Alert {
  sev: Severity;
  title: string;
  meta: string;
  time: string;
}

export interface PipelineStep {
  label: string;
  count: string;
  ok: boolean;
}

export interface Pipeline {
  hasIssue: boolean;
  steps: PipelineStep[];
  note: string;
}

/** 0 = healthy, 1 = outage, 2 = degraded */
export type UptimeSegment = 0 | 1 | 2;

export interface Endpoint {
  method: "POST" | "GET";
  path: string;
  lat: string;
  latColor: string;
  uptime: string;
  uptimeCls: BadgeVariant;
  segs: UptimeSegment[];
}

export interface RetailerData {
  name: string;
  type: string;
  kpi: {
    latency: KpiMetric;
    apm: KpiMetric;
    fill: KpiMetric;
    drop: KpiMetric;
    campaigns: KpiMetric;
  };
  latencyStats: LatencyStats;
  slaBadge: SlaBadge;
  fillBadge: FillBadge;
  alertCount: number;
  categories: Category[];
  alerts: Alert[];
  pipeline: Pipeline;
  endpoints: Endpoint[];
}

export type RetailerId = "woolworths" | "coles" | "trademe" | "poshmark" | "doordash";
