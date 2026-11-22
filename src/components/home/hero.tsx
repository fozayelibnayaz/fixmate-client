"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { money } from "@/lib/format";

type RepairExample = {
  id: string;
  label: string;
  when: string;
  device: string;
  problem: string;
  area: string;
  technician: string;
  status: string;
  next: string;
  price: number;
  steps: string[];
  completedSteps: number;
};

const repairExamples: RepairExample[] = [
  {
    id: "phone",
    label: "iPhone screen",
    when: "Today",
    device: "iPhone 13",
    problem: "Cracked screen",
    area: "Dhanmondi, Dhaka",
    technician: "Rahim Uddin",
    status: "Repair in progress",
    next: "We'll message you when it is ready to collect.",
    price: 10500,
    steps: ["Request sent", "Technician accepted", "Repair started", "Ready to pay"],
    completedSteps: 3,
  },
  {
    id: "ac",
    label: "AC servicing",
    when: "Today",
    device: "Split AC · 1.5 ton",
    problem: "AC not cooling",
    area: "Mirpur, Dhaka",
    technician: "Karim Ahmed",
    status: "Technician accepted",
    next: "Karim will arrive at your preferred time.",
    price: 3000,
    steps: ["Request sent", "Technician accepted", "Repair started", "Ready to pay"],
    completedSteps: 2,
  },
  {
    id: "fridge",
    label: "Fridge repair",
    when: "Yesterday",
    device: "Double-door fridge",
    problem: "Fridge not cooling",
    area: "Gulshan, Dhaka",
    technician: "Karim Ahmed",
    status: "Waiting for technician",
    next: "You'll be notified as soon as a technician accepts.",
    price: 3500,
    steps: ["Request sent", "Technician accepted", "Repair started", "Ready to pay"],
    completedSteps: 1,
  },
  {
    id: "laptop",
    label: "Laptop cleaning",
    when: "Last week",
    device: "HP Pavilion",
    problem: "Laptop running hot",
    area: "Dhanmondi, Dhaka",
    technician: "Rahim Uddin",
    status: "Ready to pay",
    next: "Your repair is complete. Pay securely whenever you're ready.",
    price: 2000,
    steps: ["Request sent", "Technician accepted", "Repair started", "Ready to pay"],
    completedSteps: 4,
  },
];

const nextSteps = [
  "A verified technician reviews your request",
  "You follow every update in one place",
  "You pay only after the repair is complete",
];

export const Hero = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("phone");

  const active = repairExamples.find((item) => item.id === activeId) ?? repairExamples[0];

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

  return (
    <header className="cl-hero cl-grain" ref={heroRef}>
      <Link className="cl-hero-pill" href="/about">
        <span className="dot">New</span> Trusted technicians across Dhaka <span aria-hidden="true">→</span>
      </Link>

      <h1>
        Broken device?<br />
        <span className="grad">Fixed.</span>
      </h1>
      <p className="cl-hero-sub">
        Describe the problem — FixMate matches you with a verified technician, keeps every step visible, and lets you pay only after the repair is done.
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

      <div className="cl-app-window" role="group" aria-label="See how FixMate tracks a repair">
        <div className="cl-win-titlebar">
          <div className="cl-traffic"><i className="cl-t-r" /><i className="cl-t-y" /><i className="cl-t-g" /></div>
          <div className="cl-doc-name">FixMate Repair Tracker <span className="badge">Live updates</span></div>
          <div className="cl-win-right">
            <Link className="cl-mini-btn" href="/dashboard/customer/bookings">View my repairs</Link>
          </div>
        </div>

        <aside className="cl-sidebar">
          <div className="cl-side-label">Your repairs</div>
          {repairExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              className={`cl-side-item${example.id === activeId ? " active" : ""}`}
              onClick={() => setActiveId(example.id)}
              aria-label={`View ${example.label} repair`}
            >
              <span className="hash">{example.when}</span> {example.label}
            </button>
          ))}
          <div className="cl-side-label">Why FixMate</div>
          <div className="cl-asset-list">
            <span className="cl-side-item">✓ Verified technicians</span>
            <span className="cl-side-item">✓ Clear prices</span>
            <span className="cl-side-item">✓ Pay after the fix</span>
          </div>
        </aside>

        <div className="cl-canvas-area">
          <div className="cl-canvas-grid" />
          <div className="cl-canvas-card" aria-live="polite">
            <div className="cl-canvas-hero">
              <span className="cl-chip cl-tracker-status">{active.status}</span>
              <h4>{active.problem}</h4>
              <p>{active.device} · {active.area}</p>
            </div>
            <div className="cl-canvas-body cl-tracker-body">
              <div className="cl-tracker-steps">
                {active.steps.map((step, index) => (
                  <span
                    className={`cl-tracker-step${index < active.completedSteps ? " done" : ""}${index === active.completedSteps - 1 ? " current" : ""}`}
                    key={step}
                  >
                    <i aria-hidden="true">{index < active.completedSteps ? "✓" : index + 1}</i>
                    {step}
                  </span>
                ))}
              </div>
              <p className="cl-tracker-note">{active.next}</p>
              <div className="cl-tracker-foot">
                <span>Technician <b>{active.technician}</b></span>
                <span>Starting price <b>{money(active.price)}</b></span>
              </div>
            </div>
          </div>
        </div>

        <aside className="cl-props">
          <div className="cl-side-label" style={{ marginTop: 0 }}>What happens next</div>
          {nextSteps.map((step, index) => (
            <div className="cl-prop-row cl-next-row" key={step}>
              <b>{index + 1}</b><span className="cl-prop-val">{step}</span>
            </div>
          ))}
          <div className="cl-side-label" style={{ marginTop: 18 }}>Need a hand?</div>
          <div className="cl-prop-row cl-next-row">
            <span className="cl-prop-val">Message the FixMate team from your dashboard.</span>
          </div>
        </aside>
      </div>
    </header>
  );
};
