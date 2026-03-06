import { useRetailer } from "./hooks/useRetailer";
import { useClock } from "./hooks/useClock";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { KpiStrip } from "./components/KpiStrip";
import { LatencyChart } from "./components/LatencyChart";
import { FillRate, Alerts, Pipeline, Endpoints } from "./components/Panels";

export default function App() {
  const { activeId, retailer, switchRetailer } = useRetailer();
  const clock = useClock();

  return (
    <div className="layout">
      <Sidebar activeId={activeId} onSwitch={switchRetailer} />

      <main className="main">
        <Topbar retailer={retailer} clock={clock} />

        <div className="content">
          <div className="section-label">Key Metrics — Today</div>
          <KpiStrip retailer={retailer} />

          <div className="section-label">Live Panels</div>
          <div className="main-grid">
            <LatencyChart retailer={retailer} activeId={activeId} />
            <FillRate retailer={retailer} />
            <Alerts retailer={retailer} />
          </div>

          <div className="section-label">Data Pipeline and API Endpoints</div>
          <div className="bot-grid">
            <Pipeline retailer={retailer} />
            <Endpoints retailer={retailer} />
          </div>
        </div>

        <footer className="footer">
          <div className="footer__note">
            Built on <span className="footer__accent">Topsort v2 API</span> · @topsort/sdk ·{" "}
            docs.topsort.com · Concept by Hana Pham
          </div>
          <div className="footer__live">
            <span className="footer__dot" />
            Refreshing every 30 seconds
          </div>
        </footer>
      </main>
    </div>
  );
}
