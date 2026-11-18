"use client";
import { useEffect, useState } from "react";

const INIT = [
  { id: "FM-204", svc: "iPhone Screen", cat: "Smartphone · Dhanmondi", who: "Sara R.", st: "in-progress", amt: 18 },
  { id: "FM-205", svc: "AC Service", cat: "AC · Gulshan", who: "Tariq K.", st: "accepted", amt: 30 },
  { id: "FM-206", svc: "Laptop Tune-up", cat: "Laptop & PC · Mirpur", who: "Nazneen", st: "requested", amt: 25 },
  { id: "FM-207", svc: "Fridge Repair", cat: "Refrigerator · Dhanmondi", who: "Imran H.", st: "completed", amt: 28 },
  { id: "FM-208", svc: "TV Panel", cat: "TV · Gulshan", who: "Fatima", st: "accepted", amt: 24 },
  { id: "FM-209", svc: "Washing Machine", cat: "Wash. Machine · Mirpur", who: "Kabir", st: "in-progress", amt: 20 },
  { id: "FM-210", svc: "Electrical Wiring", cat: "Electrical · Dhanmondi", who: "Rina", st: "requested", amt: 26 },
];
const ORDER = ["requested", "accepted", "in-progress", "completed"];

export default function LiveTracker() {
  const [jobs, setJobs] = useState(INIT);
  useEffect(() => {
    const t = setInterval(() => {
      setJobs((prev) => {
        const next = [...prev];
        const j = next[Math.floor(Math.random() * next.length)];
        const idx = ORDER.indexOf(j.st);
        j.st = ORDER[(idx + 1) % ORDER.length];
        return next;
      });
    }, 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="tracker reveal rd3">
      <div className="tr-head">
        <div className="t"><span className="dot" />DISPATCH FEED · AUTO-UPDATING</div>
        <div className="cnt">{String(jobs.length).padStart(2, "0")} JOBS</div>
      </div>
      <div className="tr-list">
        {jobs.map((j) => (
          <div key={j.id} className="tr-row">
            <span className="tr-id">{j.id}</span>
            <span className="tr-svc">{j.svc}<small>{j.cat}</small></span>
            <span className="tr-who">{j.who}</span>
            <span className={`tr-st st-${j.st}`}>{j.st.replace("-", " ")}</span>
            <span className="tr-amt">${j.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
