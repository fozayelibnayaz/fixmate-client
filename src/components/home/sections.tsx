"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { API_URL, CATEGORIES } from "@/lib/constants";

type CmsRow = {
  id: string;
  title: string;
  sub: string;
  status: string;
  category: string;
  technician: string;
  area: string;
  updated: string;
};

type CmsCollection = {
  id: string;
  label: string;
  count: number;
  rows: CmsRow[];
};

const marqueeItems = [
  { label: "iPhone Screen Repair", href: "/services?category=Smartphone" },
  { label: "AC Servicing", href: "/services?category=AC" },
  { label: "Laptop Care", href: "/services?category=Laptop%20%26%20PC" },
  { label: "Refrigerator Fix", href: "/services?category=Refrigerator" },
  { label: "TV Repair", href: "/services?category=TV" },
  { label: "Washing Machine", href: "/services?category=Washing%20Machine" },
  { label: "Electrical Wiring", href: "/services?category=Electrical" },
  { label: "Pay After Fix", href: "/about" },
  { label: "Verified Technicians", href: "/about#trust" },
];

const steps = [
  { num: "01", title: "Find a Service", body: "Browse approved repair services by category, price and service mode — all filtered on the server." },
  { num: "02", title: "Send a Request", body: "Share your phone, address, preferred date and a clear description of what is wrong." },
  { num: "03", title: "Technician Fixes It", body: "Watch the job move from Accepted to In Progress to Completed with a full status history." },
  { num: "04", title: "Pay After Completion", body: "Pay securely with Stripe only after the technician marks the repair as completed." },
];

const explorations = [
  { art: "cl-art-1", title: "iPhone screen replacement", meta: "Smartphone", category: "Smartphone" },
  { art: "cl-art-2", title: "AC deep servicing", meta: "AC", category: "AC" },
  { art: "cl-art-3", title: "Laptop motherboard check", meta: "Laptop & PC", category: "Laptop & PC" },
];

const cmsCollections: CmsCollection[] = [
  {
    id: "services", label: "Services", count: 12,
    rows: [
      { id: "svc-1", title: "iPhone Screen Replacement", sub: "Smartphone · from $65", status: "Live", category: "Smartphone", technician: "Rahim Uddin", area: "Dhanmondi, Dhaka", updated: "Today" },
      { id: "svc-2", title: "AC Deep Servicing", sub: "AC · from $45", status: "Live", category: "AC", technician: "Karim Sheikh", area: "Mirpur, Dhaka", updated: "Today" },
      { id: "svc-3", title: "Laptop Motherboard Check", sub: "Laptop & PC · from $80", status: "Live", category: "Laptop & PC", technician: "Rahim Uddin", area: "Dhanmondi, Dhaka", updated: "Yesterday" },
      { id: "svc-4", title: "Refrigerator Gas Refill", sub: "Refrigerator · from $55", status: "Pending", category: "Refrigerator", technician: "Karim Sheikh", area: "Mirpur, Dhaka", updated: "2 days ago" },
      { id: "svc-5", title: "Washing Machine Drum Repair", sub: "Washing Machine · from $40", status: "Live", category: "Washing Machine", technician: "Rahim Uddin", area: "Gulshan, Dhaka", updated: "3 days ago" },
    ],
  },
  {
    id: "technicians", label: "Technicians", count: 2,
    rows: [
      { id: "tech-1", title: "Rahim Uddin", sub: "Smartphone & laptop specialist", status: "Live", category: "Approved", technician: "Rahim Uddin", area: "Dhanmondi, Dhaka", updated: "Joined May 2026" },
      { id: "tech-2", title: "Karim Sheikh", sub: "AC & refrigerator specialist", status: "Live", category: "Approved", technician: "Karim Sheikh", area: "Mirpur, Dhaka", updated: "Joined May 2026" },
      { id: "tech-3", title: "Nadia Islam", sub: "Electrical wiring applicant", status: "Pending", category: "Review", technician: "Nadia Islam", area: "Gulshan, Dhaka", updated: "Applied today" },
    ],
  },
  {
    id: "bookings", label: "Bookings", count: 8,
    rows: [
      { id: "FM-1042", title: "Book #FM-1042 · iPhone Screen", sub: "Nadia Islam · requested", status: "Requested", category: "Smartphone", technician: "Rahim Uddin", area: "Gulshan, Dhaka", updated: "12 min ago" },
      { id: "FM-1041", title: "Book #FM-1041 · AC Servicing", sub: "Tanvir Ahmed · accepted", status: "Accepted", category: "AC", technician: "Karim Sheikh", area: "Mirpur, Dhaka", updated: "1 hour ago" },
      { id: "FM-1039", title: "Book #FM-1039 · Laptop Care", sub: "Sadia Rahman · in progress", status: "In Progress", category: "Laptop & PC", technician: "Rahim Uddin", area: "Dhanmondi, Dhaka", updated: "Today" },
      { id: "FM-1037", title: "Book #FM-1037 · Fridge Repair", sub: "Imran Hossain · completed", status: "Completed", category: "Refrigerator", technician: "Karim Sheikh", area: "Uttara, Dhaka", updated: "Yesterday" },
      { id: "FM-1035", title: "Book #FM-1035 · Washing Machine", sub: "Maya Chowdhury · cancelled", status: "Cancelled", category: "Washing Machine", technician: "Rahim Uddin", area: "Bashundhara, Dhaka", updated: "2 days ago" },
    ],
  },
  {
    id: "payments", label: "Payments", count: 5,
    rows: [
      { id: "pay-1", title: "Stripe · ch_3QFM1042", sub: "iPhone Screen · $65.00", status: "Paid", category: "Smartphone", technician: "Rahim Uddin", area: "Gulshan, Dhaka", updated: "Today" },
      { id: "pay-2", title: "Stripe · ch_3QFM1039", sub: "AC Servicing · $45.00", status: "Paid", category: "AC", technician: "Karim Sheikh", area: "Mirpur, Dhaka", updated: "Yesterday" },
      { id: "pay-3", title: "Stripe · ch_3QFM1036", sub: "Laptop Care · $80.00", status: "Paid", category: "Laptop & PC", technician: "Rahim Uddin", area: "Dhanmondi, Dhaka", updated: "2 days ago" },
    ],
  },
  {
    id: "categories", label: "Categories", count: 7,
    rows: CATEGORIES.map((category, index) => ({
      id: `cat-${index}`,
      title: category,
      sub: `${index + 2} approved services`,
      status: "Live",
      category,
      technician: "Multiple technicians",
      area: "Dhaka",
      updated: "Current",
    })),
  },
];

const cmsViews = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
];

const cmsInfoPanels = [
  {
    id: "help",
    label: "Help Center",
    title: "FixMate Help Center",
    body: "Answers for booking a repair, accepting a job, final amounts and Stripe payments.",
    status: "Live",
    category: "Support",
    technician: "FixMate team",
    area: "Online",
    updated: "Updated today",
  },
  {
    id: "integrations",
    label: "Integrations",
    title: "Connected services",
    body: "Stripe Checkout handles payments and ImgBB stores service photos through the server proxy.",
    status: "Live",
    category: "Integrations",
    technician: "Platform",
    area: "Global",
    updated: "Synced now",
  },
  {
    id: "training",
    label: "Technician Training",
    title: "Technician onboarding",
    body: "A short guide to listing a service, setting an availability area and closing a job cleanly.",
    status: "Live",
    category: "Training",
    technician: "FixMate operations",
    area: "Dhaka",
    updated: "New cohort",
  },
] as const;

const statusClass = (status: string) => {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  const allowed = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled", "paid", "pending", "review"];
  return allowed.includes(key) ? `st-${key}` : "";
};

const codeTabs = [
  {
    id: "status", label: "status.ts",
    code: `// Server-enforced repair status pipeline
const transitions = {
  requested: ["accepted", "rejected", "cancelled"],
  accepted: ["in-progress"],
  "in-progress": ["completed"],
  completed: [],
};

if (!transitions[current].includes(next)) {
  throw new ApiError(400, "Invalid status transition");
}`,
  },
  {
    id: "booking", label: "booking.ts",
    code: `// Customers only see their own repair jobs
const bookings = await Booking.find({
  customerEmail: req.auth.email,
}).sort({ createdAt: -1 });

// One active request per service
const active = await Booking.exists({
  serviceId,
  customerEmail: req.auth.email,
  status: { $in: ["requested", "accepted", "in-progress"] },
});`,
  },
  {
    id: "payment", label: "payment.ts",
    code: `// Pay-after-completion gate
if (booking.status !== "completed") {
  throw new ApiError(409, "Repair is not completed yet");
}
if (booking.paymentStatus !== "unpaid") {
  throw new ApiError(409, "This job is already paid");
}

const session = await stripe.checkout.sessions.create({
  line_items: [{ price_data: { unit_amount: booking.finalAmount * 100 } }],
  metadata: { bookingId: booking.id },
});`,
  },
];

const flowStates = [
  { id: "requested", icon: "📝", label: "Requested", short: "Customer sends the repair request", detail: "A booking is created with copied service details, status requested and paymentStatus unpaid." },
  { id: "accepted", icon: "✓", label: "Accepted", short: "Technician accepts the job", detail: "Only the service owner can move a requested job to accepted." },
  { id: "in-progress", icon: "🔧", label: "In Progress", short: "Repair work has started", detail: "The technician starts work; the customer can follow the status history." },
  { id: "completed", icon: "✅", label: "Completed", short: "Final amount is set", detail: "The technician must send a finalAmount greater than zero before completing." },
  { id: "paid", icon: "💳", label: "Paid", short: "Stripe confirms payment", detail: "The payment gate only opens for completed, unpaid jobs owned by the customer." },
  { id: "rejected", icon: "⛔", label: "Rejected", short: "Final state for a request", detail: "A technician can reject a requested job. Cancelled and rejected jobs cannot change again." },
];

const showcaseItems = [
  { cls: "cl-sc-1", height: "cl-h-tall", label: "Smartphone", name: "iPhone Screen Replacement" },
  { cls: "cl-sc-2", height: "cl-h-mid", label: "AC", name: "AC Deep Servicing" },
  { cls: "cl-sc-3", height: "cl-h-short", label: "Laptop & PC", name: "Laptop Servicing" },
  { cls: "cl-sc-4", height: "cl-h-tall", label: "Refrigerator", name: "Fridge Gas Refill" },
  { cls: "cl-sc-5", height: "cl-h-mid", label: "TV", name: "LED TV Repair" },
  { cls: "cl-sc-6", height: "cl-h-short", label: "Washing Machine", name: "Drum & Motor Fix" },
  { cls: "cl-sc-7", height: "cl-h-mid", label: "Electrical", name: "Safe Wiring Check" },
  { cls: "cl-sc-8", height: "cl-h-tall", label: "Home Visit", name: "Doorstep Repair" },
];

const stories = [
  { name: "Nadia Islam", role: "Customer · Gulshan", quote: "My phone was dead after a surge. I could see every status change and only paid when it worked again." },
  { name: "Rahim Uddin", role: "Verified Technician", quote: "FixMate gives me a clean place to show my services and manage incoming repair requests." },
  { name: "FixMate Admin", role: "Operations", quote: "Approvals, roles and transactions are all in one dashboard. Moderation takes minutes." },
  { name: "Karim Sheikh", role: "AC Technician", quote: "The final-amount step keeps every job transparent — customers know exactly what they are paying for." },
];

const categoryIcons: Record<string, string> = {
  Smartphone: "📱",
  "Laptop & PC": "💻",
  AC: "❄️",
  Refrigerator: "🧊",
  TV: "📺",
  "Washing Machine": "🌀",
  Electrical: "⚡",
};

const categoryPrices: Record<string, number> = {
  Smartphone: 65,
  "Laptop & PC": 80,
  AC: 45,
  Refrigerator: 55,
  TV: 70,
  "Washing Machine": 40,
  Electrical: 35,
};

const promptChips = ["Fix my iPhone screen", "Book AC servicing", "Repair a laptop", "Service a refrigerator"];

export const ScrollEffects = () => {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("show"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export const Marquee = () => (
  <div className="cl-marquee-wrap" aria-label="Popular FixMate repair services">
    <div className="cl-marquee">
      {marqueeItems.map((item) => <Link className="cl-mq-item" href={item.href} key={item.label}>{item.label}</Link>)}
      {marqueeItems.map((item) => <Link className="cl-mq-item" href={item.href} key={`${item.label}-duplicate`} aria-hidden="true" tabIndex={-1}>{item.label}</Link>)}
    </div>
  </div>
);

export const AgentSection = () => (
  <section className="cl-section cl-reveal" id="agent" data-reveal>
    <div className="cl-container">
      <div className="cl-feature-head">
        <span className="cl-eyebrow">✦ FixMate flow</span>
        <h2>From request to repair,<br />without the guesswork</h2>
        <p>Four clear steps, one visible job record, and a payment gate that protects the customer until the work is delivered.</p>
      </div>

      <div className="cl-steps">
        {steps.map((step) => (
          <article className="cl-step-card" key={step.num}>
            <span className="cl-step-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>

      <div className="cl-explore-row" aria-label="Popular FixMate repairs">
        {explorations.map((exploration) => (
          <Link className="cl-explore-card" href={`/services?category=${encodeURIComponent(exploration.category)}`} key={exploration.title}>
            <div className={`cl-explore-art ${exploration.art}`}>
              <div className="cl-fake-lines"><i /><i /><i /></div>
            </div>
            <div className="cl-explore-meta">{exploration.title}<span>{exploration.meta}</span></div>
          </Link>
        ))}
      </div>
      <div className="cl-center-link"><Link className="cl-text-link" href="/services">Browse all services <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>
);

export const CmsSection = () => {
  const [collectionId, setCollectionId] = useState("services");
  const [viewId, setViewId] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CmsRow | null>(null);
  const [infoId, setInfoId] = useState<string | null>(null);
  const infoPanel = cmsInfoPanels.find((item) => item.id === infoId) ?? null;

  const collection = cmsCollections.find((item) => item.id === collectionId) ?? cmsCollections[0];
  const rows = useMemo(() => collection.rows.filter((row) => {
    const matchesView = viewId === "all" || row.status.toLowerCase() === viewId;
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${row.title} ${row.sub} ${row.category} ${row.technician}`.toLowerCase().includes(needle);
    return matchesView && matchesQuery;
  }), [collection, query, viewId]);

  const detail = selected
    ? {
        eyebrow: `${collection.label} detail`,
        title: selected.title,
        sub: selected.sub,
        status: selected.status,
        category: selected.category,
        technician: selected.technician,
        area: selected.area,
        updated: selected.updated,
      }
    : infoPanel
      ? {
          eyebrow: `${infoPanel.label} detail`,
          title: infoPanel.title,
          sub: infoPanel.body,
          status: infoPanel.status,
          category: infoPanel.category,
          technician: infoPanel.technician,
          area: infoPanel.area,
          updated: infoPanel.updated,
        }
      : null;

  return (
    <section className="cl-section cl-reveal" id="operations" data-reveal style={{ background: "var(--panel)", borderTop: "var(--hairline)", borderBottom: "var(--hairline)" }}>
      <div className="cl-container">
        <div className="cl-feature-head">
          <span className="cl-eyebrow">▦ Operations table</span>
          <h2>Manage every repair<br />in one place</h2>
          <p>Switch collections, search records, filter by view and open any row to inspect the FixMate data behind it.</p>
        </div>

        <div className="cl-cms-wrap">
          <aside className="cl-cms-side">
            <label className="cl-cms-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" aria-label="Search FixMate records" />
            </label>
            <h5>Collections</h5>
            {cmsCollections.map((item) => (
              <button className={`cl-cms-col${item.id === collectionId ? " active" : ""}`} key={item.id} type="button" onClick={() => { setCollectionId(item.id); setSelected(null); setInfoId(null); }}>
                {item.label}<b>{item.count}</b>
              </button>
            ))}
            <h5>Views</h5>
            {cmsViews.map((view) => (
              <button className={`cl-cms-col${view.id === viewId ? " active" : ""}`} key={view.id} type="button" onClick={() => { setViewId(view.id); setInfoId(null); }}>
                {view.label}<b>↗</b>
              </button>
            ))}
            <h5>More</h5>
            {cmsInfoPanels.map((panel) => (
              <button className={`cl-cms-col${panel.id === infoId ? " active" : ""}`} key={panel.id} type="button" onClick={() => { setInfoId(panel.id); setSelected(null); }}>
                {panel.label}<b>↗</b>
              </button>
            ))}
          </aside>

          <div className="cl-cms-table">
            <div className="cl-cms-table-head"><span>{collection.label} record</span><span>Status</span><span>Category</span></div>
            {rows.length ? rows.map((row) => (
              <button className="cl-cms-row" key={row.id} type="button" onClick={() => { setSelected(row); setInfoId(null); }} aria-label={`Open ${row.title} details`}>
                <span className={`cl-cms-thumb cl-th${(Number(row.id.replace(/\D/g, "")) % 5) + 1}`} />
                <span><span className="t">{row.title}</span><span className="cat">{row.sub}</span></span>
                <span className={`cl-status ${statusClass(row.status)}`}>{row.status}</span>
                <span className="cat">{row.category}</span>
              </button>
            )) : <div className="cl-cms-empty">No {collection.label.toLowerCase()} match this search or view.</div>}
          </div>

          {detail ? (
            <aside className="cl-cms-detail" aria-live="polite">
              <button
                className="cl-cms-close"
                type="button"
                onClick={() => { setSelected(null); setInfoId(null); }}
                aria-label="Close details"
              >✕</button>
              <span className="cl-eyebrow">{detail.eyebrow}</span>
              <h4>{detail.title}</h4>
              <p style={{ color: "var(--mist)", fontSize: 12 }}>{detail.sub}</p>
              <dl>
                <dt>Status</dt><dd>{detail.status}</dd>
                <dt>Category</dt><dd>{detail.category}</dd>
                <dt>Technician</dt><dd>{detail.technician}</dd>
                <dt>Area</dt><dd>{detail.area}</dd>
                <dt>Updated</dt><dd>{detail.updated}</dd>
              </dl>
            </aside>
          ) : null}
        </div>
        <div className="cl-center-link"><Link className="cl-text-link" href="/dashboard/profile">Open your FixMate dashboard <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>
  );
};

export const CodeSection = () => {
  const [tabId, setTabId] = useState("status");
  const [copied, setCopied] = useState(false);
  const [flowId, setFlowId] = useState("requested");
  const tab = codeTabs.find((item) => item.id === tabId) ?? codeTabs[0];
  const flow = flowStates.find((item) => item.id === flowId) ?? flowStates[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="cl-section cl-reveal" id="rules" data-reveal>
      <div className="cl-container">
        <div className="cl-feature-head">
          <span className="cl-eyebrow">&lt;/&gt; Enforced rules</span>
          <h2>The repair logic lives<br />on the server</h2>
          <p>Status transitions, ownership checks and the payment gate are enforced by Express — not left to the browser.</p>
        </div>

        <div className="cl-wheel-wrap">
          <div className="cl-code-window">
            <div className="cl-code-titlebar">
              <div className="cl-traffic"><i className="cl-t-r" /><i className="cl-t-y" /><i className="cl-t-g" /></div>
              <span style={{ marginLeft: 8 }}>fixmate-server</span>
              <button type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>
            <div className="cl-code-tabs">
              {codeTabs.map((item) => (
                <button key={item.id} type="button" className={item.id === tabId ? "active" : undefined} onClick={() => setTabId(item.id)}>{item.label}</button>
              ))}
            </div>
            <pre className="cl-code-body"><code>{tab.code}</code></pre>
          </div>

          <div className="cl-wheel" aria-label="FixMate booking status flow">
            <div className="cl-wheel-ring" />
            {flowStates.map((state, index) => (
              <button
                key={state.id}
                type="button"
                className={`cl-wheel-item cl-wi-${index + 1}${state.id === flowId ? " active" : ""}`}
                onClick={() => setFlowId(state.id)}
                aria-label={`Show ${state.label} status`}
              >
                <span aria-hidden="true">{state.icon}</span>
                <span>{state.label}</span>
              </button>
            ))}
            <div className="cl-wheel-core" aria-live="polite">
              <strong>{flow.label}</strong>
              <small>{flow.short}</small>
            </div>
          </div>
        </div>
        <p className="cl-center-link" style={{ color: "var(--mist)", fontSize: 13, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>{flow.detail}</p>
      </div>
    </section>
  );
};

export const ApiSection = () => {
  const endpoint = `${API_URL.replace(/\/$/, "")}/api`;
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    { text: "$ fixmate api --status", tone: "cl-t-cmd" },
    { text: `✓ Connected to ${endpoint}`, tone: "cl-t-ok" },
    { text: "✓ 12 approved services · 2 technicians · 8 bookings", tone: "cl-t-dim" },
    { text: '> Type "help" to see available commands.', tone: "cl-t-blue" },
  ]);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = bodyRef.current;
    if (!terminal) return;
    const nodes = terminal.querySelectorAll<HTMLElement>(".cl-term-line");
    nodes.forEach((node, index) => window.setTimeout(() => node.classList.add("show"), Math.min(index * 90, 700)));
  }, []);

  useEffect(() => {
    const terminal = bodyRef.current;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [lines]);

  const run = (command: string) => {
    const value = command.trim();
    if (!value) return;
    const key = value.toLowerCase();
    const output: Array<{ text: string; tone: string }> = [{ text: `$ ${value}`, tone: "cl-t-cmd" }];

    if (key === "help") {
      output.push(
        { text: "services   list approved repair services", tone: "cl-t-dim" },
        { text: "pending    show services awaiting approval", tone: "cl-t-dim" },
        { text: "booking    check the status pipeline", tone: "cl-t-dim" },
        { text: "pay        check the pay-after-fix gate", tone: "cl-t-dim" },
        { text: "clear      clear this terminal", tone: "cl-t-dim" },
      );
    } else if (key === "services") {
      output.push(
        { text: `GET ${endpoint}/services`, tone: "cl-t-blue" },
        { text: "✓ 12 approved · available services returned", tone: "cl-t-ok" },
        { text: "· search, filter, sort and pagination run in MongoDB", tone: "cl-t-dim" },
      );
    } else if (key === "pending") {
      output.push(
        { text: `GET ${endpoint}/admin/services?approval=pending`, tone: "cl-t-blue" },
        { text: "✓ 3 services waiting for admin approval", tone: "cl-t-ok" },
        { text: "· admin role required", tone: "cl-t-dim" },
      );
    } else if (key === "booking") {
      output.push(
        { text: "PATCH /api/bookings/:id/status", tone: "cl-t-blue" },
        { text: "✓ requested → accepted → in-progress → completed", tone: "cl-t-ok" },
        { text: "· technician must own the job", tone: "cl-t-dim" },
      );
    } else if (key === "pay") {
      output.push(
        { text: `POST ${endpoint}/payments/create-checkout-session`, tone: "cl-t-blue" },
        { text: "✓ gate: status=completed & paymentStatus=unpaid", tone: "cl-t-ok" },
        { text: "· amount is read from booking.finalAmount, never the client", tone: "cl-t-dim" },
      );
    } else if (key === "clear") {
      setLines([]);
      setInput("");
      return;
    } else {
      output.push({ text: `✗ Unknown command: ${value}. Try "help".`, tone: "cl-t-dim" });
    }

    setLines((current) => [...current, ...output].slice(-40));
    setInput("");
  };

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="cl-section cl-reveal" id="api" data-reveal style={{ background: "var(--panel)", borderTop: "var(--hairline)" }}>
      <div className="cl-container">
        <div className="cl-mcp-grid">
          <div>
            <span className="cl-eyebrow">⌁ FixMate API</span>
            <h2 style={{ fontSize: "clamp(32px,4.6vw,54px)", letterSpacing: "-.045em", marginTop: 14 }}>One API for every<br />repair touchpoint</h2>
            <p style={{ color: "var(--mist)", marginTop: 18, maxWidth: 460 }}>The customer portal, technician console, admin dashboard and Stripe webhook all speak to the same protected Express API. Try a command in the terminal.</p>
            <div className="cl-agent-chips">
              {["services", "pending", "booking", "pay"].map((command) => (
                <button className="cl-agent-chip" type="button" key={command} onClick={() => run(command)}>› {command}</button>
              ))}
            </div>
            <div className="cl-mcp-endpoint">
              <span className="cl-mono" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{endpoint}</span>
              <button type="button" onClick={copyEndpoint}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>
          </div>

          <div className="cl-terminal">
            <div className="cl-term-bar"><span>fixmate-api — terminal</span><span className="cl-mono" style={{ color: "var(--smoke)" }}>express</span></div>
            <div className="cl-term-body" ref={bodyRef}>
              {lines.map((line, index) => (
                <div className={`cl-term-line ${line.tone}`} key={`${index}-${line.text}`}>{line.text}</div>
              ))}
            </div>
            <form className="cl-term-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); run(input); }}>
              <span aria-hidden="true">›</span>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a command…" aria-label="FixMate API command" autoComplete="off" />
              <button type="submit">Run</button>
            </form>
          </div>
        </div>
        <div className="cl-center-link" style={{ marginTop: 40 }}><Link className="cl-text-link" href="/services">Explore the service API <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>
  );
};

export const PlatformBento = () => (
  <section className="cl-section cl-reveal" id="platform" data-reveal>
    <div className="cl-container">
      <div className="cl-feature-head" style={{ marginBottom: 44 }}>
        <span className="cl-eyebrow">▦ Platform</span>
        <h2>Everything needed to<br />run repairs well</h2>
        <p>Built-in trust, role safety and transparent payments — not add-ons bolted onto a booking form.</p>
      </div>
      <div className="cl-bento">
        <article className="cl-tile cl-span-4">
          <div className="cl-tile-label">⚡ Performance</div>
          <h3>Fast pages, clear numbers</h3>
          <div className="cl-vital-good">● Healthy</div>
          <div className="cl-vitals">
            <div className="cl-vital"><small>LCP</small><b>1.1s</b><span>Good</span></div>
            <div className="cl-vital"><small>INP</small><b>95ms</b><span>Good</span></div>
            <div className="cl-vital"><small>CLS</small><b>0.01</b><span>Good</span></div>
          </div>
        </article>
        <article className="cl-tile cl-span-2">
          <div className="cl-tile-label">☁ Availability</div>
          <div className="cl-uptime-badge">99.99<i style={{ fontStyle: "normal", fontSize: ".45em" }}>%</i></div>
          <div className="cl-tile-cap">API uptime · global hosting · SSL · quick rollback</div>
        </article>
        <article className="cl-tile cl-span-3">
          <div className="cl-tile-label">◪ Live operations</div>
          <div className="cl-stat-line" style={{ borderTop: "none", paddingTop: 0 }}><span>Active jobs</span><b style={{ color: "var(--blue)" }}>● 24</b></div>
          <svg className="cl-spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="cl-sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0099ff" stopOpacity=".5" /><stop offset="1" stopColor="#0099ff" stopOpacity="0" /></linearGradient></defs>
            <path d="M0,64 C30,60 45,48 65,52 C85,56 95,38 120,40 C145,42 150,26 175,30 C200,34 210,18 235,20 C260,22 275,10 300,8 L300,80 L0,80 Z" fill="url(#cl-sg)" />
            <path d="M0,64 C30,60 45,48 65,52 C85,56 95,38 120,40 C145,42 150,26 175,30 C200,34 210,18 235,20 C260,22 275,10 300,8" fill="none" stroke="#0099ff" strokeWidth="2" />
          </svg>
          <div className="cl-stat-line"><span>Completed repairs</span><b>1,742</b></div>
          <div className="cl-stat-line"><span>Approved services</span><b>12</b></div>
          <div className="cl-stat-line"><span>Avg. response</span><b>3m 11s</b></div>
        </article>
        <article className="cl-tile cl-span-3">
          <div className="cl-tile-label">⌥ Status pipeline</div>
          <table className="cl-ab">
            <thead><tr><th>Step</th><th>Owner</th><th>Rule</th><th>State</th></tr></thead>
            <tbody>
              <tr><td>Requested</td><td>Customer</td><td>Create job</td><td className="cl-pill-best">Open</td></tr>
              <tr><td>In Progress</td><td>Technician</td><td>Owned job</td><td className="cl-lift-up">Live</td></tr>
              <tr><td>Paid</td><td>Stripe</td><td>Completed only</td><td className="cl-pill-best">Safe</td></tr>
            </tbody>
          </table>
          <div className="cl-tile-cap" style={{ marginTop: "auto" }}>Invalid transitions are rejected on the server with a clear error.</div>
        </article>
        <article className="cl-tile cl-span-2">
          <div className="cl-tile-label">⌕ Discovery</div>
          <h3>Server-side search</h3>
          <div className="cl-stat-line" style={{ borderTop: "none", paddingTop: 0 }}><span>Query</span><b>iPhone</b></div>
          <div className="cl-stat-line"><span>Filter</span><b>Smartphone</b></div>
          <div className="cl-stat-line"><span>Sort</span><b>Newest</b></div>
        </article>
        <article className="cl-tile cl-span-2">
          <div className="cl-tile-label">⑂ Role safety</div>
          <h3>Three clear roles</h3>
          <div className="cl-stat-line" style={{ borderTop: "none", paddingTop: 0 }}><span>Customer</span><b>Requests &amp; pays</b></div>
          <div className="cl-stat-line"><span>Technician</span><b>Lists &amp; fixes</b></div>
          <div className="cl-stat-line"><span>Admin</span><b>Approves &amp; oversees</b></div>
        </article>
        <article className="cl-tile cl-span-2">
          <div className="cl-tile-label">⌘ Local coverage</div>
          <h3>Service areas</h3>
          <div className="cl-locale-row"><span>Dhanmondi</span><span className="cl-progress"><i style={{ width: "90%" }} /></span><b>90%</b></div>
          <div className="cl-locale-row"><span>Mirpur</span><span className="cl-progress"><i style={{ width: "100%" }} /></span><b>100%</b></div>
          <div className="cl-locale-row"><span>Gulshan</span><span className="cl-progress"><i style={{ width: "75%" }} /></span><b>75%</b></div>
        </article>
      </div>
    </div>
  </section>
);

export const ShowcaseSection = () => (
  <section className="cl-section cl-reveal" id="showcase" data-reveal style={{ paddingTop: 40 }}>
    <div className="cl-container">
      <div className="cl-feature-head" style={{ marginBottom: 44 }}>
        <span className="cl-eyebrow">▦ Repairs</span>
        <h2>Real problems,<br />clear solutions</h2>
      </div>
      <div className="cl-showcase-grid">
        {showcaseItems.map((shot) => (
          <Link className={`cl-shot ${shot.height} ${shot.cls}`} href={`/services?category=${encodeURIComponent(shot.label)}`} key={shot.name}>
            <small>{shot.label}</small><b>{shot.name}</b>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export const StoriesSection = () => {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <section className="cl-section cl-reveal" id="stories" data-reveal style={{ background: "var(--panel)", borderTop: "var(--hairline)" }}>
      <div className="cl-container">
        <div className="cl-feature-head" style={{ marginBottom: 44 }}>
          <span className="cl-eyebrow">◈ Community</span>
          <h2>Why Dhaka chooses<br />FixMate</h2>
        </div>
        <div className="cl-stories-layout">
          <div className="cl-featured-quote" aria-live="polite">
            <blockquote>“{story.quote}”</blockquote>
            <cite>{story.name} · {story.role}</cite>
          </div>
          <div className="cl-stories-grid">
            {stories.map((item, index) => (
              <button className={`cl-story${index === active ? " active" : ""}`} type="button" key={item.name} onClick={() => setActive(index)} aria-label={`Read story from ${item.name}`}>
                <div className="cl-story-logo">{item.name}</div>
                <div className="cl-story-body"><p>{item.role}</p><div className="cl-read-story">Read story →</div></div>
              </button>
            ))}
          </div>
        </div>
        <div className="cl-center-link"><Link className="cl-text-link" href="/about#stories">Meet the FixMate community <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>
  );
};

export const MarketplaceSection = () => (
  <section className="cl-section cl-reveal" id="categories" data-reveal>
    <div className="cl-container">
      <div className="cl-feature-head" style={{ marginBottom: 44 }}>
        <span className="cl-eyebrow">▦ Categories</span>
        <h2>Popular repairs<br />near you</h2>
        <p>Pick a category and jump straight to approved, available FixMate services.</p>
      </div>
      <div className="cl-templates-grid">
        {CATEGORIES.map((category, index) => (
          <Link className="cl-tpl" href={`/services?category=${encodeURIComponent(category)}`} key={category}>
            <div className={`cl-tpl-art cl-ta-${(index % 6) + 1}`}><span aria-hidden="true">{categoryIcons[category] ?? "🔧"}</span></div>
            <div className="cl-tpl-body">
              <b>{category}</b>
              <small>Approved technicians available</small>
              <span className="cl-tpl-price">From ${categoryPrices[category] ?? 35}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="cl-center-link"><Link className="cl-text-link" href="/services">Browse all services <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>
);

export const FinalCta = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/services?q=${encodeURIComponent(query)}`);
  };

  const pickChip = (chip: string) => {
    setValue(chip);
    inputRef.current?.focus();
  };

  return (
    <section className="cl-final-cta cl-reveal" id="cta" data-reveal>
      <div className="cl-container">
        <span className="cl-eyebrow">✦ Start a repair</span>
        <h2 style={{ marginTop: 18 }}>Book your fix<br /><span className="cl-blue-grad">this afternoon.</span></h2>
        <form className="cl-prompt-box" onSubmit={submit}>
          <span aria-hidden="true" style={{ color: "var(--blue)", fontSize: 18 }}>⌕</span>
          <input ref={inputRef} type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Describe your repair…" aria-label="Describe your repair" autoComplete="off" />
          <button type="submit">Search services →</button>
        </form>
        <div className="cl-prompt-chips">
          {promptChips.map((chip) => (
            <button className="cl-prompt-chip" type="button" key={chip} onClick={() => pickChip(chip)}>{chip}</button>
          ))}
        </div>
        <Link className="cl-start-without" href="/services">Browse all services instead →</Link>
      </div>
    </section>
  );
};
