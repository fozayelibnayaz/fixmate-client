import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import PipelineViz from "@/components/home/PipelineViz";
import LiveTracker from "@/components/home/LiveTracker";
import StatsCountUp from "@/components/home/StatsCountUp";

const CATEGORIES = [
  { ic: "📱", name: "Smartphone", cnt: "06 services · screen · battery · camera", big: true },
  { ic: "💻", name: "Laptop & PC", cnt: "05 services" },
  { ic: "❄️", name: "AC", cnt: "04 services" },
  { ic: "🧊", name: "Refrigerator", cnt: "03 services" },
  { ic: "📺", name: "TV", cnt: "03 services" },
  { ic: "🌀", name: "Washing Machine", cnt: "03 services" },
  { ic: "🔌", name: "Electrical", cnt: "03 services" },
];

export default function Home() {
  return (
    <>
      <Hero />
      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: "contents" }}>
              {["FM-204 iPhone Screen · in-progress","FM-205 AC Service · accepted","FM-206 Laptop Tune-up · requested","FM-207 Fridge Repair · completed","FM-208 TV Panel · accepted","FM-209 Washing Machine · in-progress","FM-210 Electrical · requested"].map((t, i) => (
                <span key={i} className="ticker-item"><span className="d">●</span> <b>{t.split(" ")[0]}</b> {t.split(" ").slice(1).join(" ")}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="sec-index reveal">001 / SERVICE GRID</div>
          <h2 className="sec-title reveal rd1">Approved repairs, <em>ready to book.</em></h2>
          <p className="sec-sub reveal rd2">Every service is listed by a verified technician and approved by our team before it goes live. Equal cards, clear prices, one click to details.</p>
          <FeaturedServices />
        </div>
      </section>
      {/* BIG MARQUEE */}
      <div className="big-marquee">
        <div className="bm-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: "contents" }}>
              <span className="bm-item">Verified Technicians <span className="s">✦</span></span>
              <span className="bm-item">Trackable Jobs <span className="s">✦</span></span>
              <span className="bm-item">Pay After Completion <span className="s">✦</span></span>
            </span>
          ))}
        </div>
      </div>
      {/* PIPELINE */}
      <section className="section" id="pipeline">
        <div className="container">
          <div className="sec-index reveal">002 / THE PIPELINE</div>
          <h2 className="sec-title reveal rd1">From request to <em>payment,</em> mapped.</h2>
          <p className="sec-sub reveal rd2">A fixed four-stage pipeline. The job moves one step forward — and payment unlocks only at the final node.</p>
          <PipelineViz />
        </div>
      </section>
      {/* CATEGORIES */}
      <section className="section" id="categories">
        <div className="container">
          <div className="sec-index reveal">003 / CATEGORY INDEX</div>
          <h2 className="sec-title reveal rd1">What gets <em>fixed.</em></h2>
          <p className="sec-sub reveal rd2">Seven repair disciplines, one unified system. Tap a cell to filter the grid.</p>
          <div className="bento">
            {CATEGORIES.map((c, i) => (
              <a key={c.name} href={`/services?category=${encodeURIComponent(c.name)}`} className={`bento-cell ${c.big ? "big" : ""} reveal ${i ? `rd${Math.min(i,3)}` : ""}`}>
                <span className="ic">{c.ic}</span>
                <div><h3>{c.name}</h3><span className="cnt">{c.cnt}</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* TRACKER */}
      <section className="section" id="tracker">
        <div className="container">
          <div className="sec-index reveal">004 / LIVE TRACKER</div>
          <h2 className="sec-title reveal rd1">Jobs moving <em>through the system.</em></h2>
          <p className="sec-sub reveal rd2">A live feed of repair requests and their current status. Every job is trackable, every status is visible — and it updates on its own.</p>
          <LiveTracker />
        </div>
      </section>
      {/* STATS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sec-index reveal">005 / TELEMETRY</div>
          <h2 className="sec-title reveal rd1">The platform, <em>by the numbers.</em></h2>
          <StatsCountUp />
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sec-index reveal">006 / FIELD REPORTS</div>
          <h2 className="sec-title reveal rd1">From the <em>job queue.</em></h2>
          <div className="testi-grid">
            <div className="testi reveal"><div className="q">&quot;</div><p>Handed over my cracked phone with no fear of paying upfront. FixMate tracked the whole job and I paid only after the screen was fixed. Exactly how repair should feel.</p><div className="who"><div className="av">SR</div><div><b>Sara Rahman</b><small>CUSTOMER · DHANMONDI</small></div></div></div>
            <div className="testi reveal rd1"><div className="q">&quot;</div><p>My AC request was accepted in minutes and I watched every status change. No guessing, no surprises. The pay-after-completion rule made me trust the entire process.</p><div className="who"><div className="av">TK</div><div><b>Tariq Khan</b><small>CUSTOMER · GULSHAN</small></div></div></div>
            <div className="testi reveal rd2"><div className="q">&quot;</div><p>Listing my services and managing incoming requests in one console changed how I work. FixMate is built for real repair workflows, not just a listing page.</p><div className="who"><div className="av">AH</div><div><b>Arif Hossain</b><small>TECHNICIAN · VERIFIED</small></div></div></div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta reveal">
            <h2>Something broken? <em>Get it fixed.</em></h2>
            <p>Browse approved repair services, send a request, and watch the job move — payment only after the work is done.</p>
            <a href="#services" className="btn btn-primary"><span>Browse services →</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
