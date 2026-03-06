/**
 * topsort.ts — TypeScript types
 *
 * Modelled on the Topsort v2 API OpenAPI 3.1.0 specification.
 * Reference: https://docs.topsort.com
 * SDK:        https://github.com/Topsort/topsort.js
 */

// ─────────────────────────────────────────────
// AUCTIONS  POST /v2/auctions
// ─────────────────────────────────────────────

export type SlotType = "listing" | "banner" | "video";

export interface AuctionSlot {
  slotType: SlotType;
  /** Number of winners to return for this slot */
  winners: number;
}

export interface AuctionProduct {
  productId: string;
  /** Optional quality score passed to P(conv) model */
  qualityScore?: number;
}

export interface AuctionRequest {
  auctions: Array<{
    slots:    AuctionSlot[];
    products: AuctionProduct[];
    /** ISO 3166-1 alpha-2 country code */
    geoTargeting?: {
      country: string;
    };
  }>;
}

export interface AuctionWinner {
  rank:      number;
  productId: string;
  winnerId:  string;
  resolvedBid?: number;
  /** Probability of conversion — core Bidless signal */
  pConv?: number;
}

export interface AuctionResult {
  slotType: SlotType;
  winners:  AuctionWinner[];
}

export interface AuctionResponse {
  results: AuctionResult[];
}

// ─────────────────────────────────────────────
// EVENTS  POST /v2/events
// ─────────────────────────────────────────────

export type EventType = "Impression" | "Click" | "Purchase";

export interface TopsortEvent {
  eventType:   EventType;
  id:          string;
  occurredAt:  string; // ISO 8601
  opaqueUserId?: string;
  session?: {
    token: string;
  };
}

export interface ImpressionEvent extends TopsortEvent {
  eventType: "Impression";
  impressions: Array<{
    id:        string;
    productId: string;
    auctionId: string;
    winnerId:  string;
    placement: {
      path:     string;
      position: number;
    };
  }>;
}

export interface ClickEvent extends TopsortEvent {
  eventType: "Click";
  clicks: Array<{
    productId: string;
    auctionId: string;
    winnerId:  string;
  }>;
}

export interface PurchaseEvent extends TopsortEvent {
  eventType: "Purchase";
  purchases: Array<{
    productId: string;
    unitPrice: number;
    quantity:  number;
    auctionId?: string;
    winnerId?:  string;
  }>;
}

export type EventRequest = ImpressionEvent | ClickEvent | PurchaseEvent;

export interface EventResponse {
  ok: boolean;
}

// ─────────────────────────────────────────────
// CAMPAIGNS  GET/POST /v2/campaigns
// ─────────────────────────────────────────────

export type CampaignStatus = "active" | "paused" | "exhausted" | "scheduled";
export type BiddingStrategy = "BIDLESS" | "MANUAL_CPC" | "TARGET_ROAS";

export interface Campaign {
  id:              string;
  name:            string;
  status:          CampaignStatus;
  biddingStrategy: BiddingStrategy;
  dailyBudget:     number;
  totalSpend:      number;
  /** Only present for BIDLESS strategy */
  targetROAS?:     number;
  startDate:       string;
  endDate?:        string;
  productIds:      string[];
}

export interface CampaignListResponse {
  campaigns:  Campaign[];
  totalCount: number;
  page:       number;
  pageSize:   number;
}

// ─────────────────────────────────────────────
// DASHBOARD-SPECIFIC TYPES
// (Extends API types for monitoring UI)
// ─────────────────────────────────────────────

export type Severity = "red" | "amber" | "blue" | "green";
export type Direction = "up" | "down";

export interface KpiMetric {
  value: string;
  delta: string;
  dir:   Direction;
}

export interface CategoryFill {
  name:  string;
  sub:   string;
  pct:   number;
  color: string;
  warn?: boolean;
}

export interface Alert {
  sev:   Severity;
  title: string;
  meta:  string;
  time:  string;
}

export interface PipelineStep {
  label: string;
  count: string;
  ok:    boolean;
}

export interface PipelineHealth {
  hasIssue: boolean;
  steps:    PipelineStep[];
  note:     string;
}

export interface EndpointStatus {
  method:     "GET" | "POST";
  path:       string;
  latency:    string;
  latColor:   string;
  uptime:     string;
  uptimeCls:  Severity;
  /** 20 segments — 0=ok, 1=down, 2=slow */
  segs:       Array<0 | 1 | 2>;
}

export interface LatencyStats {
  p50: string;
  p95: string;
  p99: string;
}

export interface SlaBadge {
  cls:   Severity;
  label: string;
}

export interface RetailerData {
  name:         string;
  type:         string;
  kpi: {
    latency:   KpiMetric;
    apm:       KpiMetric;
    fill:      KpiMetric;
    drop:      KpiMetric;
    campaigns: KpiMetric;
  };
  latencyStats: LatencyStats;
  slaBadge:     SlaBadge;
  fillBadge:    SlaBadge;
  alertCount:   number;
  categories:   CategoryFill[];
  alerts:       Alert[];
  pipeline:     PipelineHealth;
  endpoints:    EndpointStatus[];
}

export type RetailerId = "woolworths" | "coles" | "trademe" | "poshmark" | "doordash";
export type RetailerMap = Record<RetailerId, RetailerData>;
