export default function AboutPage() {
  return (
    <div className="container py-20">
      <div className="sec-index">HOW IT WORKS</div>
      <h1 className="sec-title mb-6">How <em>FixMate</em> works.</h1>
      <div className="grid md:grid-cols-4 gap-6 mt-10">
        {[
          { n: "01", t: "Find a Service", d: "Browse approved repair services by category." },
          { n: "02", t: "Send a Request", d: "Submit device details, address and preferred date." },
          { n: "03", t: "Technician Fixes It", d: "Track status from accepted to completed." },
          { n: "04", t: "Pay After Completion", d: "Pay only after the work is delivered." },
        ].map((s) => (
          <div key={s.n} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-6">
            <div className="text-[var(--accent)] font-mono text-sm mb-2">{s.n}</div>
            <h3 className="font-semibold mb-2">{s.t}</h3>
            <p className="text-sm text-[var(--muted)]">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
