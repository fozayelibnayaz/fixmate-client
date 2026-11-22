import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, CreditCard, Search, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Find a repair, send a request, get it fixed, and pay after the work is done.",
};

const steps = [
  { icon: <Search size={22} />, title: "Find a Service", body: "Browse trusted repairs by category, price or home visit option." },
  { icon: <Wrench size={22} />, title: "Send a Request", body: "Share your phone number, address, preferred date and what is wrong." },
  { icon: <BadgeCheck size={22} />, title: "Technician Fixes It", body: "A verified technician accepts the job and keeps you updated as work moves along." },
  { icon: <CreditCard size={22} />, title: "Pay After Completion", body: "Check the repair, then pay securely in BDT once the work is finished." },
];

const testimonials = [
  { quote: "My phone was dead after a power surge. I could see every update and only paid when it worked again.", name: "Nadia Islam", role: "Customer, Gulshan" },
  { quote: "As a technician, I finally have a clean place to show my services and speak with customers who need help.", name: "Rahim Uddin", role: "Verified Technician" },
  { quote: "The AC technician explained the price before starting work. There was no surprise bill at the end.", name: "Tanvir Ahmed", role: "Customer, Mirpur" },
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
            FixMate connects people who need a fix with technicians who can do it — and keeps the whole repair visible from request to payment.
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

      <section className="fm-section" id="trust" style={{ background: "var(--fm-surface)", borderBlock: "1px solid var(--fm-line)" }}>
        <div className="fm-container">
          <span className="fm-eyebrow">02 / Why FixMate</span>
          <h2 className="fm-h2" style={{ margin: "16px 0 44px" }}>Built around trust.</h2>
          <div className="fm-grid fm-grid-3">
            {[
              ["Verified technicians", "Every technician is checked before joining FixMate."],
              ["Clear repair updates", "Every update is in one place — no lost messages or guessing."],
              ["Pay after service", "You only pay after the repair is finished."],
            ].map(([title, body]) => (
              <div key={title} className="fm-feature">
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-section" id="stories">
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
