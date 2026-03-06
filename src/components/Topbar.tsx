import { Badge } from "./Badge";
import type { RetailerData } from "../types";

interface TopbarProps {
  retailer: RetailerData;
  clock: string;
}

export function Topbar({ retailer, clock }: TopbarProps) {
  const alertCls =
    retailer.alertCount >= 4 ? "red" : retailer.alertCount >= 2 ? "amber" : "green";

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">Integration Health</h1>
        <p className="topbar__sub">
          {retailer.name} — Real-time monitoring across auction, events, and fill rate
        </p>
      </div>
      <div className="topbar__right">
        <Badge variant={alertCls} dot>
          {retailer.alertCount} {retailer.alertCount === 1 ? "ALERT" : "ALERTS"} OPEN
        </Badge>
        <Badge variant="green" dot>API OPERATIONAL</Badge>
        <span className="clock">{clock}</span>
      </div>
    </header>
  );
}
