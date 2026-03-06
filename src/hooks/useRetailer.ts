/**
 * hooks/useRetailer.ts
 *
 * Manages active retailer state and switching logic.
 * In a real integration this hook would also call TopsortClient
 * to fetch live latency/fill rate data on retailer change.
 */

import { useState, useCallback } from "react";
import type { RetailerId } from "../types";
import { RETAILERS } from "../data/retailers";

export function useRetailer() {
  const [activeId, setActiveId] = useState<RetailerId>("woolworths");

  const switchRetailer = useCallback((id: RetailerId) => {
    setActiveId(id);
  }, []);

  return {
    activeId,
    retailer: RETAILERS[activeId],
    switchRetailer,
  };
}
