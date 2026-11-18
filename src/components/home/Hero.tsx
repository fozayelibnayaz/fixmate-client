"use client";
export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="hero-glow g2" />
      <div className="container hero-content">
        <div>
          <div className="hero-meta"><span>FIXMATE · ON-DEMAND REPAIR</span><span className="live">SYSTEM ONLINE</span></div>
          <h1 className="hero-usp">Broken device? <em>Get it fixed.</em></h1>
          <p className="hero-sub">Verified technicians. Trackable jobs. Pay only after the fix.</p>
          <div className="hero-cta">
            <a href="/services" className="btn btn-primary"><span>Browse services →</span></a>
            <a href="/#pipeline" className="btn btn-ghost"><span>See how it works</span></a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hv-card">
            <div className="hv-top"><span className="tag">// LIVE JOB</span><span className="status">in-progress</span></div>
            <div className="hv-device">📱<div className="hv-scan" /></div>
            <div className="hv-info">
              <div className="hv-row"><span className="k">Service</span><span className="v">iPhone Screen</span></div>
              <div className="hv-row"><span className="k">Technician</span><span className="v">Arif Hossain</span></div>
              <div className="hv-row"><span className="k">Area</span><span className="v">Dhanmondi, Dhaka</span></div>
              <div className="hv-foot"><span className="hv-pill">Home Visit</span><span className="hv-pill go">$18</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-corner"><b>FIXMATE</b> / REPAIR SYSTEM / v2026</div>
    </header>
  );
}
