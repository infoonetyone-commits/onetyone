"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="font-playfair text-5xl lg:text-[3.5rem] font-bold text-gold mb-2 tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-white/50 text-[0.65rem] tracking-[0.2em] uppercase font-semibold">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-navy py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-14">
        <Stat value={120} suffix="+" label="Clients Served" />
        <Stat value={420} suffix="%" label="Average ROAS" />
        <Stat value={28} suffix="M+" label="Ad Spend Managed" />
        <Stat value={94} suffix="%" label="Client Retention" />
      </div>
    </section>
  );
}
