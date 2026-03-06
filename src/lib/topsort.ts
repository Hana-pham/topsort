/**
 * topsort.ts — Mock API client
 *
 * Mirrors the topsort.js SDK interface so this can be swapped
 * for the real SDK with a one-line change per method.
 *
 * Real SDK:  npm install @topsort/sdk
 * Docs:      https://docs.topsort.com
 * GitHub:    https://github.com/Topsort/topsort.js
 *
 * Usage (real SDK):
 *   import TopsortClient from "@topsort/sdk";
 *   const client = new TopsortClient({ apiKey: process.env.TOPSORT_API_KEY });
 *
 * Usage (this mock):
 *   import { topsortClient as client } from "@/lib/topsort";
 *   — Same method signatures, returns mock data instead of live API.
 */

import type {
  AuctionRequest,
  AuctionResponse,
  EventRequest,
  EventResponse,
  CampaignListResponse,
  RetailerData,
  RetailerMap,
  RetailerId,
} from "@/types/topsort";

import { RETAILERS } from "@/data/retailers";

// ── SIMULATED NETWORK DELAY ──────────────────
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── MOCK TOPSORT CLIENT ──────────────────────

class MockTopsortClient {
  private apiKey: string;
  private baseUrl = "https://api.topsort.com/v2";

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  /**
   * POST /v2/auctions
   * Runs a real-time auction and returns ranked winners.
   * P(conv) is used internally by Bidless to rank results.
   */
  async runAuction(request: AuctionRequest): Promise<AuctionResponse> {
    await delay(7); // Simulates sub-10ms SLA
    return {
      results: request.auctions.map((_, i) => ({
        slotType: "listing",
        winners: Array.from({ length: request.auctions[i]?.slots[0]?.winners ?? 1 }, (_, rank) => ({
          rank:      rank + 1,
          productId: `product_${Math.random().toString(36).slice(2, 8)}`,
          winnerId:  `winner_${Math.random().toString(36).slice(2, 8)}`,
          pConv:     parseFloat((Math.random() * 0.3 + 0.05).toFixed(4)),
        })),
      })),
    };
  }

  /**
   * POST /v2/events
   * Tracks impression → click → purchase for P(conv) learning.
   * Drop rate in events is the key metric this dashboard monitors.
   */
  async reportEvent(event: EventRequest): Promise<EventResponse> {
    await delay(12); // /v2/events slightly higher latency than /v2/auctions
    return { ok: true };
  }

  /**
   * GET /v2/campaigns
   * Returns active campaigns for a retailer — powers Toppie DSP.
   */
  async listCampaigns(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<CampaignListResponse> {
    await delay(9);
    return {
      campaigns: [],
      totalCount: 0,
      page:     params?.page     ?? 1,
      pageSize: params?.pageSize ?? 20,
    };
  }
}

// ── SINGLETON ────────────────────────────────
// Replace apiKey with process.env.TOPSORT_API_KEY in production

export const topsortClient = new MockTopsortClient({
  apiKey: process.env.TOPSORT_API_KEY ?? "mock_key_replace_in_production",
});

// ── DASHBOARD DATA LAYER ─────────────────────
// Wraps retailer mock data — mirrors what would come from
// a real /v2/reports endpoint aggregating auction + event telemetry.

export function getRetailerData(id: RetailerId): RetailerData {
  return RETAILERS[id];
}

export function getAllRetailers(): RetailerMap {
  return RETAILERS;
}

export function getRetailerIds(): RetailerId[] {
  return Object.keys(RETAILERS) as RetailerId[];
}
