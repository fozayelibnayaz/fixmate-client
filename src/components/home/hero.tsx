"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type PreviewPage = {
  id: string;
  hash: string;
  label: string;
  route: string;
  title: string;
  subtitle: string;
  chips: string[];
  status: string;
  access: string;
};

const previewPages: PreviewPage[] = [
  {
    id: "home", hash: "/", label: "Home", route: "/",
    title: "Broken device? Fixed.",
    subtitle: "Verified technicians · Live tracking · Pay after the fix",
    chips: ["1200px", "Public", "hero.fixmate"], status: "Live", access: "Everyone",
  },
  {
    id: "services", hash: "/services", label: "Services", route: "/services",
    title: "Find the right repair",
    subtitle: "12 approved services · 7 categories · Search on the server",
    chips: ["Server filters", "Approved only", "3 per row"], status: "Live", access: "Everyone",
  },
  {
    id: "work", hash: "/work", label: "My Jobs", route: "/dashboard/customer/bookings",
    title: "Track every repair job",
    subtitle: "Requested → Accepted → In Progress → Completed → Paid",
    chips: ["Status history", "Pay after fix", "Customer only"], status: "Live", access: "Customer",
  },
  {
    id: "requests", hash: "/requests", label: "Requests", route: "/dashboard/technician/requests",
    title: "Manage incoming requests",
    subtitle: "Accept, reject, start work and set the final amount",
    chips: ["Owner scoped", "Final amount", "Technician"], status: "Live", access: "Technician",
  },
  {
    id: "news", hash: "/news", label: "Updates", route: "/about#stories",
    title: "What is new at FixMate",
    subtitle: "New service categories, technician stories and platform updates",
    chips: ["News", "Community", "Changelog"], status: "Live", access: "Everyone",
  },
  {
    id: "admin", hash: "/admin", label: "Admin", route: "/dashboard/admin",
    title: "Moderate the whole platform",
    subtitle: "Users, service approvals, all jobs and Stripe revenue",
    chips: ["Approvals", "Roles", "Revenue"], status: "Live", access: "Admin",
  },
  {
    id: "profile", hash: "/profile", label: "Profile", route: "/dashboard/profile",
    title: "Keep your profile current",
    subtitle: "Name, phone, area, bio and a photo uploaded through ImgBB",
    chips: ["ImgBB upload", "All roles", "Read-only email"], status: "Live", access: "Signed in",
  },
  {
    id: "contact", hash: "/contact", label: "Contact", route: "/about#trust",
    title: "Talk to the FixMate team",
    subtitle: "hello@fixmate.test · +880 1711 000 000 · Dhaka",
    chips: ["Email", "Phone", "Dhaka"], status: "Live", access: "Everyone",
  },
  {
    id: "stories", hash: "/stories", label: "Stories", route: "/about#stories",
    title: "Repairs people can trust",
    subtitle: "Customer, technician and admin stories from FixMate",
    chips: ["Testimonials", "Trust", "Community"], status: "Live", access: "Everyone",
  },
];

const assetGroups = [
  { id: "search", label: "Search", icon: "⌕", items: previewPages.map((page) => page.label) },
  { id: "layers", label: "Status Layers", icon: "▤", items: ["Requested", "Accepted", "In Progress", "Completed", "Paid"] },
  { id: "components", label: "UI Components", icon: "▦", items: ["iPhone Screen", "AC Servicing", "Laptop Care", "Fridge Repair"] },
  { id: "styles", label: "Styles", icon: "◫", items: ["Status badges", "Role badges", "Price tags", "Empty states"] },
] as const;

const agentCopy: Record<string, { prompt: string; statuses: string[] }> = {
  home: {
    prompt: "Write a short introduction for a repair platform where customers can track every job.",
    statuses: ["Checking the headline…", "Tightening the sub-deck…", "Auto-saving hero copy…"],
  },
  services: {
    prompt: "Show the newest approved repair services with equal-height cards and a clear price.",
    statuses: ["Sorting by newest…", "Applying approval rules…", "Aligning service cards…"],
  },
  work: {
    prompt: "Add a live status tracker so customers can see each step of their repair job.",
    statuses: ["Mapping status history…", "Adding the payment gate…", "Auto-saving tracker…"],
  },
  news: {
    prompt: "Share FixMate platform updates, technician stories and new service categories.",
    statuses: ["Collecting updates…", "Formatting the story…", "Auto-saving update…"],
  },
  requests: {
    prompt: "Prepare the request table with owner-scoped actions for the logged-in technician.",
    statuses: ["Checking ownership rules…", "Adding valid transitions…", "Auto-saving table…"],
  },
  admin: {
    prompt: "Summarize pending service approvals and Stripe revenue for the admin overview.",
    statuses: ["Reading approval queue…", "Totaling transactions…", "Auto-saving overview…"],
  },
  profile: {
    prompt: "Keep name, phone, area and bio editable while email and role stay read-only.",
    statuses: ["Checking profile fields…", "Preparing ImgBB upload…", "Auto-saving profile…"],
  },
  contact: { prompt: "Add clear contact details for customers across Dhaka.", statuses: ["Checking contact info…", "Formatting details…", "Auto-saving page…"] },
  stories: { prompt: "Write three short FixMate stories from a customer, technician and admin view.", statuses: ["Collecting stories…", "Matching voice…", "Auto-saving stories…"] },
};

export const Hero = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<PreviewPage[]>(previewPages);
  const [activePageId, setActivePageId] = useState("home");
  const [activeAssetId, setActiveAssetId] = useState<(typeof assetGroups)[number]["id"]>("search");
  const [assetQuery, setAssetQuery] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);

  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];
  const agent = agentCopy[activePage.id] ?? agentCopy.home;
  const activeGroup = assetGroups.find((group) => group.id === activeAssetId) ?? assetGroups[0];
  const assetItems = useMemo(
    () => activeGroup.items.filter((item) => item.toLowerCase().includes(assetQuery.trim().toLowerCase())),
    [activeGroup, assetQuery],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setStatusIndex((index) => index + 1), 2600);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const offset = Math.min(window.scrollY * 0.08, 42);
      heroRef.current?.style.setProperty("--cl-parallax", String(offset));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/services?q=${encodeURIComponent(value)}` : "/services");
  };

  const addPage = () => {
    setPages((current) => {
      if (current.length >= 12) return current;
      const number = current.filter((page) => page.id.startsWith("custom-")).length + 1;
      const page: PreviewPage = {
        id: `custom-${number}`,
        hash: `/repair-${number}`,
        label: `Repair Page ${number}`,
        route: "/services",
        title: `Repair Page ${number}`,
        subtitle: "A new FixMate page ready to be edited",
        chips: ["Draft", "Editable", "New"], status: "Draft", access: "Editor",
      };
      setActivePageId(page.id);
      return [...current, page];
    });
  };

  return (
    <header className="cl-hero cl-grain" ref={heroRef}>
      <Link className="cl-hero-pill" href="/about#stories">
        <span className="dot">New</span> Trusted by Dhaka technicians <span aria-hidden="true">→</span>
      </Link>

      <h1>
        Broken device?<br />
        <span className="grad">Fixed.</span>
      </h1>
      <p className="cl-hero-sub">
        Describe the problem — FixMate matches you with verified technicians, keeps every step visible, and lets you pay only after the repair is done.
      </p>

      <form className="cl-hero-search" onSubmit={onSearch} role="search">
        <span aria-hidden="true" style={{ color: "var(--blue)", fontSize: 18 }}>⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a repair, e.g. iPhone screen"
          aria-label="Search repairs"
        />
        <button type="submit">Find a service →</button>
      </form>

      <div className="cl-hero-ctas">
        <Link href="/services" className="cl-btn cl-btn-white cl-btn-lg">Find a service</Link>
        <Link href="/about" className="cl-btn cl-btn-ghost cl-btn-lg">How it works <span aria-hidden="true">→</span></Link>
      </div>

      <div className="cl-app-window" role="group" aria-label="FixMate operations preview">
        <div className="cl-win-titlebar">
          <div className="cl-traffic"><i className="cl-t-r" /><i className="cl-t-y" /><i className="cl-t-g" /></div>
          <div className="cl-doc-name">FixMate Ops <span className="badge">· live</span><span className="badge">Repair Console</span></div>
          <div className="cl-win-right">
            <div className="cl-avatars"><span className="cl-a1">AR</span><span className="cl-a2">MT</span><span className="cl-a3">AD</span></div>
            <button className="cl-mini-btn" type="button" onClick={() => router.push(activePage.route)}>Open page</button>
          </div>
        </div>

        <aside className="cl-sidebar">
          <div className="cl-side-label">Pages <button type="button" onClick={addPage} aria-label="Add preview page">+</button></div>
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`cl-side-item${page.id === activePageId ? " active" : ""}`}
              onClick={() => {
                setActivePageId(page.id);
                setStatusIndex(0);
              }}
              aria-label={`Open ${page.label} page in preview`}
            >
              <span className="hash">{page.hash}</span> {page.label}
            </button>
          ))}

          <div className="cl-side-label">Assets</div>
          <div className="cl-side-search"><span aria-hidden="true">⌕</span><input value={assetQuery} onChange={(event) => setAssetQuery(event.target.value)} placeholder={`Search ${activeGroup.label.toLowerCase()}…`} aria-label={`Search ${activeGroup.label}`} /></div>
          <div className="cl-asset-list">
            {assetGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`cl-side-item${group.id === activeAssetId ? " active" : ""}`}
                onClick={() => {
                  setActiveAssetId(group.id);
                  setAssetQuery("");
                }}
                aria-label={`Show ${group.label} assets`}
              >
                <span aria-hidden="true">{group.icon}</span> {group.label}
              </button>
            ))}
          </div>
          {assetItems.length ? (
            <div className="cl-asset-list" style={{ marginTop: 6, paddingLeft: 8 }}>
              {assetItems.map((item) => (
                <span className="cl-side-item" key={item} style={{ cursor: "default" }}>· {item}</span>
              ))}
            </div>
          ) : (
            <div className="cl-side-empty">No matching {activeGroup.label.toLowerCase()}.</div>
          )}
        </aside>

        <div className="cl-canvas-area">
          <div className="cl-canvas-grid" />
          <div className="cl-canvas-card">
            <div className="cl-canvas-hero">
              <h4>{activePage.title}</h4>
              <p>{activePage.subtitle}</p>
            </div>
            <div className="cl-canvas-body">
              {activePage.chips.map((chip) => <span className="cl-chip" key={chip}>{chip}</span>)}
              <span className="cl-chip" style={{ color: "var(--blue)", borderColor: "var(--blue-line)" }}>● Auto-saved</span>
            </div>
          </div>

          <div className="cl-agent-pop">
            <div className="cl-ap-head">
              <div className="cl-ap-title"><span className="cl-agent-star">✦</span> FixMate Assistant <span style={{ color: "var(--smoke)", fontWeight: 400 }}>— {activePage.label}</span></div>
              <span className="cl-model-tag">Rules v2</span>
            </div>
            <div className="cl-ap-prompt">{agent.prompt}</div>
            <div className="cl-ap-status">
              <span className="cl-typing" aria-hidden="true"><i /><i /><i /></span>
              <span>{agent.statuses[statusIndex % agent.statuses.length]}</span>
            </div>
          </div>
        </div>

        <aside className="cl-props">
          <div className="cl-side-label" style={{ marginTop: 0 }}>Inspector</div>
          {[
            ["Page", activePage.label],
            ["Route", activePage.hash],
            ["Access", activePage.access],
            ["SLA", "24h response"],
            ["Status", activePage.status],
            ["Theme", "Dark"],
          ].map(([label, value], index) => (
            <div className="cl-prop-row" key={label}>
              <b>{label}</b><span className={`cl-prop-val${index === 4 ? " hl" : ""}`}>{value}</span>
            </div>
          ))}
        </aside>
      </div>
    </header>
  );
};
