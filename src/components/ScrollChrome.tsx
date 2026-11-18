"use client";
import { useEffect, useState } from "react";

export default function ScrollChrome() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const sc = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(sc);
      setShowTop(h.scrollTop > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }} />
      <button id="toTop" className={showTop ? "show" : ""} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </>
  );
}
