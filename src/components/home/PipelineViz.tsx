"use client";
import { useEffect, useState } from "react";

const STEPS = ["requested","accepted","in-progress","completed"];

export default function PipelineViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);
  const nodes = [
    { n: "01", label: "// INTAKE", title: "Request sent", desc: "Customer submits the repair request with device, address and problem." },
    { n: "02", label: "// ACCEPT", title: "Technician accepts", desc: "The assigned technician accepts or rejects the job into the active queue." },
    { n: "03", label: "// WORK", title: "In progress", desc: "The repair is underway. Status updates flow back to the customer live." },
    { n: "04", label: "// SETTLE", title: "Complete → Pay", desc: "Job marked complete. Pay Now unlocks — payment happens only here." },
  ];
  return (
    <div className="pipe-wrap reveal rd3">
      <div className="pipe-head"><span className="t">// JOB STATUS VISUALIZER</span><span className="t" style={{ color: "var(--accent)" }}>● LIVE DEMO</span></div>
      <div className="pipe-track">
        {nodes.map((nd, i) => (
          <div key={i} className={`pipe-node ${i <= step ? "active" : ""}`}>
            <div className="pipe-dot">{nd.n}</div>
            <div className="step-label">{nd.label}</div>
            <h4>{nd.title}</h4>
            <p>{nd.desc}</p>
          </div>
        ))}
      </div>
      <div className="pipe-status">
        {STEPS.map((s, i) => (
          <span key={s} className={`ps ${i <= step ? "on" : ""}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}
