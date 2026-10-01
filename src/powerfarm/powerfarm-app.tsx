import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  Cloud,
  Code2,
  Command,
  Cpu,
  Database,
  GitBranch,
  Home,
  Layers3,
  Package,
  Search,
  Server,
  Sparkles,
} from "lucide-react";
import "./powerfarm.css";

type Section = "home" | "products" | "software" | "metrics" | "artifacts" | "activity";

type Product = {
  id: string;
  name: string;
  description: string;
  software: number;
  metrics: number;
  artifacts: number;
  accent: string;
};

const products: Product[] = [
  {
    id: "minilab",
    name: "Minilab",
    description: "Private compute, experiments, workers and operational software.",
    software: 9,
    metrics: 28,
    artifacts: 41,
    accent: "ML",
  },
  {
    id: "powerfarm",
    name: "Powerfarm",
    description: "Software, intelligence and company systems.",
    software: 14,
    metrics: 37,
    artifacts: 63,
    accent: "PF",
  },
  {
    id: "research",
    name: "Research",
    description: "Benchmarks, experiments, datasets and living technical knowledge.",
    software: 6,
    metrics: 19,
    artifacts: 88,
    accent: "R",
  },
];

const software = [
  { name: "minilab-platform", product: "Minilab", type: "app", version: "main", status: "active", provider: "Vercel" },
  { name: "minivault", product: "Powerfarm", type: "service", version: "0.4", status: "active", provider: "Supabase" },
  { name: "lab-8gb", product: "Minilab", type: "private worker", version: "local", status: "online", provider: "Private" },
  { name: "lab-512", product: "Minilab", type: "private worker", version: "local", status: "online", provider: "Private" },
  { name: "lab-256", product: "Minilab", type: "workbench", version: "local", status: "available", provider: "Private" },
];

const metrics = [
  { name: "Successful deployments", value: "18", delta: "+4", direction: "up", product: "Powerfarm", period: "30d" },
  { name: "Tracked software", value: "29", delta: "+6", direction: "up", product: "All products", period: "now" },
  { name: "Stored artifacts", value: "192", delta: "+23", direction: "up", product: "All products", period: "30d" },
  { name: "Private workers online", value: "2 / 3", delta: "1 available", direction: "flat", product: "Minilab", period: "now" },
];

const artifacts = [
  { name: "minivault-0.4", type: "release", product: "Powerfarm", size: "—", created: "recent" },
  { name: "Unified Canon", type: "document", product: "Powerfarm", size: "—", created: "Sep 30" },
  { name: "benchmark-results", type: "dataset", product: "Research", size: "—", created: "recent" },
  { name: "minilab-ui-spec", type: "manifest", product: "Minilab", size: "393 KB", created: "current" },
];

const activity = [
  { title: "minilab-platform branch created", detail: "powerfarm-unified-app-v1", time: "now", icon: GitBranch },
  { title: "Powerfarm product surface selected", detail: "Products · Software · Metrics · Artifacts · Activity", time: "now", icon: Sparkles },
  { title: "Private compute represented as first-class software", detail: "LAB 8GB · LAB 512 · LAB 256", time: "today", icon: Cpu },
  { title: "External platforms remain native", detail: "OpenAI · Anthropic · Cloudflare · Vercel", time: "today", icon: Cloud },
];

const providers = [
  { name: "OpenAI", detail: "ChatGPT · Plugins · Codex", state: "surface" },
  { name: "Anthropic", detail: "Claude · developer workflows", state: "surface" },
  { name: "Cloudflare", detail: "Workers · edge · MCP", state: "surface" },
  { name: "Vercel", detail: "apps · deploys · AI", state: "surface" },
  { name: "Private compute", detail: "LAB 8GB · LAB 512 · LAB 256", state: "local" },
];

const nav: Array<{ id: Section; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "products", label: "Products", icon: Boxes },
  { id: "software", label: "Software", icon: Code2 },
  { id: "metrics", label: "Metrics", icon: ChartNoAxesCombined },
  { id: "artifacts", label: "Artifacts", icon: Archive },
  { id: "activity", label: "Activity", icon: Activity },
];

function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="pf-status">{children}</span>;
}

function Header({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <header className="pf-page-header">
      <div>
        {eyebrow ? <div className="pf-eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
      </div>
      {children}
    </header>
  );
}

export function PowerfarmApp() {
  const [section, setSection] = useState<Section>("home");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      ...products.map((item) => ({ group: "Product", label: item.name, detail: item.description })),
      ...software.map((item) => ({ group: "Software", label: item.name, detail: `${item.product} · ${item.provider}` })),
      ...metrics.map((item) => ({ group: "Metric", label: item.name, detail: `${item.value} · ${item.product}` })),
      ...artifacts.map((item) => ({ group: "Artifact", label: item.name, detail: `${item.type} · ${item.product}` })),
    ].filter((item) => `${item.label} ${item.detail} ${item.group}`.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div className="pf-app">
      <aside className="pf-sidebar">
        <div className="pf-brand">
          <div className="pf-brand-mark">P</div>
          <div>
            <strong>Powerfarm</strong>
            <span>software intelligence</span>
          </div>
        </div>

        <nav className="pf-nav" aria-label="Powerfarm">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="pf-sidebar-section">
          <div className="pf-sidebar-label">Products</div>
          {products.map((product) => (
            <button
              key={product.id}
              className={selectedProduct === product.id ? "pf-product-link active" : "pf-product-link"}
              onClick={() => {
                setSelectedProduct(product.id);
                setSection("products");
              }}
            >
              <span className="pf-dot">{product.accent}</span>
              <span>{product.name}</span>
            </button>
          ))}
        </div>

        <div className="pf-sidebar-footer">
          <div className="pf-live-dot" />
          <div>
            <strong>Unified surface</strong>
            <span>Web + ChatGPT</span>
          </div>
        </div>
      </aside>

      <main className="pf-main">
        <div className="pf-topbar">
          <div className="pf-search-wrap">
            <Search size={17} />
            <input
              aria-label="Search Powerfarm"
              placeholder="Search software, metrics, artifacts..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd><Command size={12} />K</kbd>
            {query && (
              <div className="pf-search-results">
                {searchResults.length ? searchResults.map((result, index) => (
                  <button key={index}>
                    <span className="pf-result-group">{result.group}</span>
                    <strong>{result.label}</strong>
                    <span>{result.detail}</span>
                  </button>
                )) : <div className="pf-search-empty">No matching Powerfarm object.</div>}
              </div>
            )}
          </div>
          <button className="pf-ask-button">
            <Sparkles size={16} />
            Ask ChatGPT
          </button>
        </div>

        <div className="pf-content">
          {section === "home" && (
            <>
              <Header title="Good morning." eyebrow="Powerfarm" />
              <section className="pf-hero">
                <div>
                  <span className="pf-kicker">One company, many runtimes</span>
                  <h2>Everything you build stays visible.</h2>
                  <p>Software, metrics and artifacts across cloud platforms and private machines, in one product surface that humans and models can share.</p>
                </div>
                <div className="pf-hero-orbit">
                  <div className="pf-orbit-core">PF</div>
                  <span>OpenAI</span><span>Cloudflare</span><span>Vercel</span><span>Anthropic</span>
                </div>
              </section>

              <section className="pf-section">
                <div className="pf-section-heading"><h3>Products</h3><button onClick={() => setSection("products")}>View all <ChevronRight size={15} /></button></div>
                <div className="pf-product-grid">
                  {products.map((product) => (
                    <button className="pf-product-card" key={product.id} onClick={() => { setSelectedProduct(product.id); setSection("products"); }}>
                      <div className="pf-product-card-top"><span className="pf-product-avatar">{product.accent}</span><ArrowUpRight size={17} /></div>
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <div className="pf-card-stats">
                        <span><strong>{product.software}</strong> software</span>
                        <span><strong>{product.metrics}</strong> metrics</span>
                        <span><strong>{product.artifacts}</strong> artifacts</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="pf-split">
                <div className="pf-section">
                  <div className="pf-section-heading"><h3>Highlights</h3><button onClick={() => setSection("metrics")}>Metrics <ChevronRight size={15} /></button></div>
                  <div className="pf-metric-list">
                    {metrics.map((metric) => (
                      <button key={metric.name} className="pf-metric-row" onClick={() => setSection("metrics")}>
                        <div><strong>{metric.name}</strong><span>{metric.product} · {metric.period}</span></div>
                        <div className="pf-metric-value">{metric.value}<small>{metric.delta}</small></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pf-section">
                  <div className="pf-section-heading"><h3>Platforms</h3></div>
                  <div className="pf-provider-grid">
                    {providers.map((provider) => (
                      <div className="pf-provider" key={provider.name}>
                        <div className="pf-provider-icon">{provider.state === "local" ? <Server size={18} /> : <Cloud size={18} />}</div>
                        <div><strong>{provider.name}</strong><span>{provider.detail}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="pf-section">
                <div className="pf-section-heading"><h3>Recent</h3><button onClick={() => setSection("activity")}>All activity <ChevronRight size={15} /></button></div>
                <div className="pf-activity-list">
                  {activity.slice(0, 3).map((event) => {
                    const Icon = event.icon;
                    return <div className="pf-activity-row" key={event.title}><div className="pf-activity-icon"><Icon size={17} /></div><div><strong>{event.title}</strong><span>{event.detail}</span></div><time>{event.time}</time></div>;
                  })}
                </div>
              </section>
            </>
          )}

          {section === "products" && (
            <>
              <Header title={selectedProduct ? products.find((p) => p.id === selectedProduct)?.name ?? "Products" : "Products"} eyebrow="Portfolio">
                <button className="pf-primary"><Package size={16} /> New product</button>
              </Header>
              <div className="pf-product-grid">
                {(selectedProduct ? products.filter((p) => p.id === selectedProduct) : products).map((product) => (
                  <div className="pf-product-card pf-product-detail" key={product.id}>
                    <div className="pf-product-card-top"><span className="pf-product-avatar">{product.accent}</span><StatusPill>active</StatusPill></div>
                    <h4>{product.name}</h4><p>{product.description}</p>
                    <div className="pf-card-stats">
                      <span><strong>{product.software}</strong> software</span><span><strong>{product.metrics}</strong> metrics</span><span><strong>{product.artifacts}</strong> artifacts</span>
                    </div>
                    <div className="pf-inline-actions">
                      <button onClick={() => setSection("software")}>Software</button>
                      <button onClick={() => setSection("metrics")}>Metrics</button>
                      <button onClick={() => setSection("artifacts")}>Artifacts</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "software" && (
            <>
              <Header title="Software" eyebrow="What Powerfarm runs and ships" />
              <div className="pf-table">
                <div className="pf-table-head"><span>Name</span><span>Type</span><span>Product</span><span>Provider</span><span>Status</span></div>
                {software.map((item) => (
                  <button className="pf-table-row" key={item.name}>
                    <span><div className="pf-row-icon"><Layers3 size={16} /></div><strong>{item.name}</strong><small>{item.version}</small></span>
                    <span>{item.type}</span><span>{item.product}</span><span>{item.provider}</span><span><StatusPill>{item.status}</StatusPill></span>
                  </button>
                ))}
              </div>
            </>
          )}

          {section === "metrics" && (
            <>
              <Header title="Metrics" eyebrow="Numbers worth remembering" />
              <div className="pf-metrics-grid">
                {metrics.map((metric) => (
                  <div className="pf-metric-card" key={metric.name}>
                    <div className="pf-metric-card-label">{metric.name}</div>
                    <div className="pf-metric-card-value">{metric.value}</div>
                    <div className="pf-metric-card-meta">
                      <span className={metric.direction === "up" ? "positive" : ""}>{metric.direction === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{metric.delta}</span>
                      <span>{metric.period}</span>
                    </div>
                    <div className="pf-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div>
                    <small>{metric.product}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "artifacts" && (
            <>
              <Header title="Artifacts" eyebrow="What Powerfarm keeps" />
              <div className="pf-table">
                <div className="pf-table-head pf-artifact-cols"><span>Name</span><span>Type</span><span>Product</span><span>Size</span><span>Created</span></div>
                {artifacts.map((item) => (
                  <button className="pf-table-row pf-artifact-cols" key={item.name}>
                    <span><div className="pf-row-icon"><Database size={16} /></div><strong>{item.name}</strong></span>
                    <span>{item.type}</span><span>{item.product}</span><span>{item.size}</span><span>{item.created}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {section === "activity" && (
            <>
              <Header title="Activity" eyebrow="What changed" />
              <div className="pf-activity-timeline">
                {activity.map((event) => {
                  const Icon = event.icon;
                  return <div className="pf-timeline-event" key={event.title}><div className="pf-timeline-dot"><Icon size={16} /></div><div><strong>{event.title}</strong><p>{event.detail}</p></div><time>{event.time}</time></div>;
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
