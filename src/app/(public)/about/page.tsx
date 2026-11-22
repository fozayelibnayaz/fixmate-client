import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, CreditCard, Search, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Find a service, send a request, get it fixed, and pay after completion.",
};

const steps = [
  { icon: <Search size={22} />, title: "Find a Service", body: "Browse approved services by category, price or service mode." },
  { icon: <Wrench size={22} />, title: "Send a Request", body: "Share your phone, address, preferred date and the problem." },
  { icon: <BadgeCheck size={22} />, title: "Technician Fixes It", body: "Watch the job move from Accepted to In Progress to Completed." },
  { icon: <CreditCard size={22} />, title: "Pay After Completion", body: "Pay securely with Stripe once the work is actually delivered." },
];

const testimonials = [
  { quote: "My phone was dead after a surge. I could see every status change and only paid when it worked again.", name: "Nadia Islam", role: "Customer, Gulshan" },
  { quote: "As a technician, I finally have a clean place to show my services and manage incoming jobs.", name: "Rahim Uddin", role: "Verified Technician" },
  { quote: "Approvals, roles and transactions are all in one dashboard. Moderation takes minutes.", name: "FixMate Admin", role: "Operations" },
];

export default function AboutPage() {
  return (
    <>
      <section className="fm-hero" style={{ paddingBottom: 70 }}>
        <div className="fm-container">
          <span className="fm-eyebrow">How it works</span>
          <h1 className="fm-display" style={{ marginTop: 18, fontSize: "clamp(48px, 7vw, 92px)" }}>
            Repair, without the <span className="fm-gradient-text">guesswork.</span>
          </h1>
          <p className="fm-lead">
            FixMate connects people who need a fix with technicians who can do it — and keeps the whole job visible from request to payment.
          </p>
          <Link href="/services" className="fm-btn fm-btn-blue" style={{ marginTop: 28 }}>
            Browse services <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="fm-section">
        <div className="fm-container">
          <span className="fm-eyebrow">01 / The flow</span>
          <h2 className="fm-h2" style={{ margin: "16px 0 44px" }}>Four steps. Zero surprises.</h2>
          <div className="fm-grid fm-grid-4">
            {steps.map((step, index) => (
              <article key={step.title} className="fm-feature">
                <div>
                  <div className="fm-feature-num">STEP 0{index + 1}</div>
                  <span style={{ color: "var(--fm-blue)", display: "inline-block", marginTop: 14 }}>{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-section" style={{ background: "var(--fm-surface)", borderBlock: "1px solid var(--fm-line)" }}>
        <div className="fm-container">
          <span className="fm-eyebrow">02 / Why FixMate</span>
          <h2 className="fm-h2" style={{ margin: "16px 0 44px" }}>Built around trust.</h2>
          <div className="fm-grid fm-grid-3">
            {[
              ["Verified technicians", "Every service is moderated by an admin before it appears publicly."],
              ["Live job tracking", "Status history is stored on each booking — no lost messages or guessing."],
              ["Pay after service", "Stripe Checkout only opens for completed, unpaid jobs."],
            ].map(([title, body]) => (
              <div key={title} className="fm-feature">
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-section">
        <div className="fm-container">
          <span className="fm-eyebrow">03 / Stories</span>
          <h2 className="fm-h2" style={{ margin: "16px 0 44px" }}>What people say.</h2>
          <div className="fm-grid fm-grid-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="fm-feature" style={{ margin: 0 }}>
                <p style={{ fontSize: 16, color: "var(--fm-ink)", lineHeight: 1.7 }}>“{item.quote}”</p>
                <footer style={{ marginTop: 20, fontSize: 13 }}>
                  <strong>{item.name}</strong>
                  <span className="fm-muted"> · {item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
