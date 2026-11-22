"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CATEGORIES } from "@/lib/constants";
import { money } from "@/lib/format";

const marqueeItems = [
  { label: "iPhone Screen Repair", href: "/services?category=Smartphone" },
  { label: "Battery Replacement", href: "/services?category=Smartphone" },
  { label: "AC Servicing", href: "/services?category=AC" },
  { label: "Laptop Care", href: "/services?category=Laptop%20%26%20PC" },
  { label: "Refrigerator Fix", href: "/services?category=Refrigerator" },
  { label: "TV Repair", href: "/services?category=TV" },
  { label: "Washing Machine", href: "/services?category=Washing%20Machine" },
  { label: "Electrical Check", href: "/services?category=Electrical" },
  { label: "Pay After Fix", href: "/about" },
  { label: "Verified Technicians", href: "/about" },
];

const steps = [
  { num: "01", title: "Find a Service", body: "Browse trusted repairs by category and price. Choose the service that matches your problem." },
  { num: "02", title: "Send a Request", body: "Share your phone number, address, preferred date and a short description of what is wrong." },
  { num: "03", title: "Technician Fixes It", body: "A verified technician accepts the job, starts the repair and keeps you updated." },
  { num: "04", title: "Pay After Completion", body: "Check the repair, then pay securely once the work is finished. No advance payment." },
];

const explorations = [
  { art: "/services/smartphone.svg", title: "Phone screen repair", meta: "Smartphone", category: "Smartphone" },
  { art: "/services/ac.svg", title: "AC servicing", meta: "AC", category: "AC" },
  { art: "/services/laptop.svg", title: "Laptop cleaning", meta: "Laptop & PC", category: "Laptop & PC" },
];

const trustTiles = [
  { label: "Verified technicians", title: "The right person for the job", body: "Every technician is checked before they can take a booking on FixMate." },
  { label: "Clear starting prices", title: "Know the cost before you book", body: "Every service shows a fair starting price in BDT. Any extra part cost is confirmed before work begins." },
  { label: "One place for updates", title: "No more chasing for news", body: "Your repair, messages and status changes stay together in one easy-to-follow record." },
  { label: "Pay with confidence", title: "You pay after the fix", body: "Payment opens only when your repair is complete and you have checked the work." },
  { label: "Local service areas", title: "Help close to home", body: "Book home visits across Dhanmondi, Mirpur, Gulshan, Uttara and nearby areas, or drop off at a shop." },
  { label: "Real support", title: "A team behind every repair", body: "If anything is unclear, message the FixMate team from your dashboard and we will help." },
];

const areas = ["Dhanmondi", "Mirpur", "Gulshan", "Uttara", "Banani", "Mohammadpur"];

const flowStates = [
  { id: "requested", icon: "📝", label: "Request sent", short: "You tell us what is wrong", detail: "Your request and starting price are saved. No payment is taken yet." },
  { id: "accepted", icon: "✓", label: "Accepted", short: "A technician takes the job", detail: "You can see who is handling your repair and when they plan to visit." },
  { id: "in-progress", icon: "🔧", label: "Repair underway", short: "Work has started", detail: "Follow progress in your dashboard. Any change in cost is confirmed with you first." },
  { id: "completed", icon: "✅", label: "Repair complete", short: "Your device is ready", detail: "The technician marks the job complete so you can check that everything works." },
  { id: "paid", icon: "💳", label: "Paid", short: "You settle the final cost", detail: "Pay securely in BDT after the repair is done. There is no advance payment." },
  { id: "support", icon: "💬", label: "Need help?", short: "We are here for you", detail: "Message the FixMate team from your dashboard if you have a question at any step." },
];

const showcaseItems = [
  { cls: "cl-sc-1", height: "cl-h-tall", label: "Smartphone", name: "Cracked phone screen" },
  { cls: "cl-sc-2", height: "cl-h-mid", label: "AC", name: "AC not cooling" },
  { cls: "cl-sc-3", height: "cl-h-short", label: "Laptop & PC", name: "Laptop running hot" },
  { cls: "cl-sc-4", height: "cl-h-tall", label: "Refrigerator", name: "Fridge not cooling" },
  { cls: "cl-sc-5", height: "cl-h-mid", label: "TV", name: "TV has no picture" },
  { cls: "cl-sc-6", height: "cl-h-short", label: "Washing Machine", name: "Drum will not spin" },
  { cls: "cl-sc-7", height: "cl-h-mid", label: "Electrical", name: "Unsafe wiring check" },
  { cls: "cl-sc-8", height: "cl-h-tall", label: "Home Visit", name: "Repair at your door" },
];

const stories = [
  { name: "Nadia Islam", role: "Customer · Gulshan", quote: "My phone was dead after a power surge. I could see every update and only paid when it worked again." },
  { name: "Rahim Uddin", role: "Verified Technician", quote: "FixMate gives me a clean way to show my services and speak directly with customers who need help." },
  { name: "Tanvir Ahmed", role: "Customer · Mirpur", quote: "The AC technician explained the price before starting work. No surprise bill at the end." },
  { name: "Karim Ahmed", role: "Verified Technician", quote: "I can see the problem before I arrive, bring the right tools and finish the job faster." },
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
  Smartphone: 2200,
  "Laptop & PC": 1800,
  AC: 3000,
  Refrigerator: 2200,
  TV: 7000,
  "Washing Machine": 4500,
  Electrical: 1800,
};

const faqs = [
  {
    question: "How much will my repair cost?",
    answer: "Every service shows a clear starting price in BDT. If a part is needed, the technician confirms the final cost with you before doing the work.",
  },
  {
    question: "Do I have to pay when I request a repair?",
    answer: "No. You only pay after the repair is finished and you have checked that everything works.",
  },
  {
    question: "Can a technician come to my home?",
    answer: "Yes. Many services offer a home visit. You can also choose a shop drop-off service if that is easier for you.",
  },
  {
    question: "What if I need to cancel?",
    answer: "You can cancel an open request from My Bookings before the repair starts.",
  },
];

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

export const HowItWorksSection = () => (
  <section className="cl-section cl-reveal" id="how-it-works" data-reveal>
    <div className="cl-container">
      <div className="cl-feature-head">
        <span className="cl-eyebrow">FixMate flow</span>
        <h2>From request to repair,<br />without the guesswork</h2>
        <p>Four simple steps, one clear repair record, and payment that only opens after the work is done.</p>
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
            <div className="cl-explore-art">
              <img src={exploration.art} alt="" aria-hidden="true" />
            </div>
            <div className="cl-explore-meta">{exploration.title}<span>{exploration.meta}</span></div>
          </Link>
        ))}
      </div>
      <div className="cl-center-link"><Link className="cl-text-link" href="/services">Browse all services <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>
);

export const TrustSection = () => (
  <section className="cl-section cl-reveal" id="trust" data-reveal style={{ background: "var(--panel)", borderTop: "var(--hairline)", borderBottom: "var(--hairline)" }}>
    <div className="cl-container">
      <div className="cl-feature-head">
        <span className="cl-eyebrow">Why FixMate</span>
        <h2>Repairs you can<br />actually rely on</h2>
        <p>We built FixMate around the things customers ask us about most: trust, price, updates and when to pay.</p>
      </div>

      <div className="cl-bento">
        {trustTiles.map((tile) => (
          <article className="cl-tile cl-span-2" key={tile.title}>
            <div className="cl-tile-label">{tile.label}</div>
            <h3>{tile.title}</h3>
            <p className="cl-tile-cap" style={{ marginTop: "auto" }}>{tile.body}</p>
          </article>
        ))}
        <article className="cl-tile cl-span-4">
          <div className="cl-tile-label">Service areas</div>
          <h3>Fixing devices across Dhaka</h3>
          <div className="cl-area-list">
            {areas.map((area) => <span key={area}>{area}</span>)}
          </div>
          <p className="cl-tile-cap" style={{ marginTop: "auto" }}>Not sure if we cover your area? Send a request and we will let you know.</p>
        </article>
        <article className="cl-tile cl-span-2">
          <div className="cl-tile-label">Need help?</div>
          <h3>We are one message away</h3>
          <p className="cl-tile-cap" style={{ marginTop: "auto" }}>Message the FixMate team from your dashboard if you need help with a booking or payment.</p>
          <Link className="cl-text-link" href="/about">Contact FixMate →</Link>
        </article>
      </div>
    </div>
  </section>
);

export const StatusSection = () => {
  const [flowId, setFlowId] = useState("requested");
  const flow = flowStates.find((item) => item.id === flowId) ?? flowStates[0];

  return (
    <section className="cl-section cl-reveal" id="tracking" data-reveal>
      <div className="cl-container">
        <div className="cl-feature-head">
          <span className="cl-eyebrow">Live tracking</span>
          <h2>Always know what is<br />happening with your repair</h2>
          <p>No more guessing. Follow each step from the moment you send a request to the moment you pay.</p>
        </div>

        <div className="cl-wheel-wrap cl-wheel-single">
          <div className="cl-status-copy">
            <span className="cl-eyebrow">{flow.label}</span>
            <h3>{flow.short}</h3>
            <p>{flow.detail}</p>
            <Link className="cl-text-link" href="/about">See the full repair journey →</Link>
          </div>
          <div className="cl-wheel" aria-label="FixMate repair journey">
            <div className="cl-wheel-ring" />
            {flowStates.map((state, index) => (
              <button
                key={state.id}
                type="button"
                className={`cl-wheel-item cl-wi-${index + 1}${state.id === flowId ? " active" : ""}`}
                onClick={() => setFlowId(state.id)}
                aria-label={`Show ${state.label} step`}
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
      </div>
    </section>
  );
};

export const FaqSection = () => (
  <section className="cl-section cl-reveal" id="help" data-reveal style={{ background: "var(--panel)", borderTop: "var(--hairline)" }}>
    <div className="cl-container">
      <div className="cl-feature-head">
        <span className="cl-eyebrow">Common questions</span>
        <h2>Good to know<br />before you book</h2>
      </div>
      <div className="cl-faq-list">
        {faqs.map((faq) => (
          <details className="cl-faq" key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export const ShowcaseSection = () => (
  <section className="cl-section cl-reveal" id="showcase" data-reveal style={{ paddingTop: 40 }}>
    <div className="cl-container">
      <div className="cl-feature-head" style={{ marginBottom: 44 }}>
        <span className="cl-eyebrow">Repairs</span>
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
          <span className="cl-eyebrow">Community</span>
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
        <div className="cl-center-link"><Link className="cl-text-link" href="/about">More about FixMate <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>
  );
};

export const MarketplaceSection = () => (
  <section className="cl-section cl-reveal" id="categories" data-reveal>
    <div className="cl-container">
      <div className="cl-feature-head" style={{ marginBottom: 44 }}>
        <span className="cl-eyebrow">Categories</span>
        <h2>Popular repairs<br />near you</h2>
        <p>Pick a category and find a trusted technician for the job.</p>
      </div>
      <div className="cl-templates-grid">
        {CATEGORIES.map((category, index) => (
          <Link className="cl-tpl" href={`/services?category=${encodeURIComponent(category)}`} key={category}>
            <div className={`cl-tpl-art cl-ta-${(index % 6) + 1}`}><span aria-hidden="true">{categoryIcons[category] ?? "🔧"}</span></div>
            <div className="cl-tpl-body">
              <b>{category}</b>
              <small>Trusted technicians available</small>
              <span className="cl-tpl-price">From {money(categoryPrices[category] ?? 1500)}</span>
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
        <span className="cl-eyebrow">Start a repair</span>
        <h2 style={{ marginTop: 18 }}>Book your fix<br /><span className="cl-blue-grad">today.</span></h2>
        <form className="cl-prompt-box" onSubmit={submit}>
          <span aria-hidden="true" style={{ color: "var(--blue)", fontSize: 18 }}>⌕</span>
          <input ref={inputRef} type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Describe your repair…" aria-label="Describe your repair" autoComplete="off" />
          <button type="submit">Search services →</button>
        </form>
        <div className="cl-prompt-chips">
          {["Fix my iPhone screen", "Book AC servicing", "Repair a laptop", "Service a refrigerator"].map((chip) => (
            <button className="cl-prompt-chip" type="button" key={chip} onClick={() => pickChip(chip)}>{chip}</button>
          ))}
        </div>
        <Link className="cl-start-without" href="/services">Browse all services instead →</Link>
      </div>
    </section>
  );
};
