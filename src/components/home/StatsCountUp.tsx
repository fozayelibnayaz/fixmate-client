"use client";
import { useEffect, useRef, useState } from "react";

function Count({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 50));
          const tick = () => {
            cur += step;
            if (cur >= target) { setVal(target); io.unobserve(el); return; }
            setVal(cur);
            requestAnimationFrame(tick);
          };
          tick();
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function StatsCountUp() {
  return (
    <div className="stats-grid">
      <div className="stat-cell reveal"><div className="lab">Verified Technicians</div><div className="num"><Count target={200} suffix="+" /><em></em></div></div>
      <div className="stat-cell reveal rd1"><div className="lab">Jobs Completed</div><div className="num"><Count target={1200} suffix="+" /><em></em></div></div>
      <div className="stat-cell reveal rd2"><div className="lab">Repair Categories</div><div className="num"><Count target={7} /></div></div>
      <div className="stat-cell reveal rd3"><div className="lab">Pay After Work</div><div className="num">100<em>%</em></div></div>
    </div>
  );
}
