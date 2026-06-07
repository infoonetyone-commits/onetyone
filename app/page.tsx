"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Navbar from "./components/Navbar";
import ContactForm from "./components/ContactForm";

/* ── Helpers ───────────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    className="text-purple flex-shrink-0 mt-0.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className={`font-playfair text-lg md:text-xl font-bold transition-colors duration-200 ${open ? "text-purple" : "text-purple-deeper"}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-purple/20 flex items-center justify-center text-purple group-hover:border-purple/50 transition-colors duration-200"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 1v10M1 6h10" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-purple-deeper/60 leading-relaxed pb-6 text-[0.95rem] max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpotlightCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let mx = -1000, my = -1000, cx = -1000, cy = -1000;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -1000; my = -1000; };
    const draw = () => {
      cx += (mx - cx) * 0.07; cy += (my - cy) * 0.07;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mx !== -1000) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
        g.addColorStop(0, "rgba(196,181,232,0.055)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998] hidden md:block" />;
}

function StatCounter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return ctrl.stop;
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-14 right-4 md:bottom-7 md:right-7 z-40 flex items-center gap-2 bg-purple text-white text-[0.62rem] font-bold tracking-[0.18em] uppercase px-5 py-3.5 rounded-full hover:bg-purple-dark transition-colors duration-200 group"
        >
          Free Audit
          <span className="group-hover:translate-x-0.5 transition-transform duration-200"><Arrow /></span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ── Scroll animation helpers ───────────────────────────────── */

/* Word-by-word text reveal — each word tied to a scroll range */
function RevealWord({
  word,
  progress,
  start,
  end,
  className = "",
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [20, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${className}`}>
      {word}
    </motion.span>
  );
}

/* Scroll progress bar — colour morphs from lavender → deep purple */
function ColorMorph() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const background = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    ["#C4B5E8", "#7B2FCF", "#5A0EA5", "#1E0045"]
  );
  return (
    <motion.div
      style={{ scaleX, background, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none"
    />
  );
}

/* ── Data ───────────────────────────────────────────────────── */

const services = [
  {
    short: "SEO",
    title: "Search Engine Optimisation",
    desc: "Rank where it matters. Sustainable organic strategies that compound over time — driving qualified traffic month after month.",
    bullets: ["Keyword research & mapping", "On-page & technical SEO", "Link building strategy", "Monthly performance reports"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    short: "PPC",
    title: "Paid Advertising",
    desc: "Every dollar working harder. Precision-targeted campaigns across Google & Meta that maximise ROAS and eliminate wasted spend.",
    bullets: ["Google Ads & Meta Ads", "Landing page optimisation", "A/B ad creative testing", "ROAS-focused bidding"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    short: "Social",
    title: "Social Media Management",
    desc: "Presence with purpose. Consistent content that builds your brand, grows your audience, and converts followers into buyers.",
    bullets: ["Content calendar & creation", "Community management", "Influencer coordination", "Insights & analytics"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
  },
  {
    short: "Content",
    title: "Content Marketing",
    desc: "Content that converts. From blog posts to long-form guides — content that ranks, educates, and drives measurable action.",
    bullets: ["Blog & article writing", "Email marketing content", "Long-form SEO guides", "Content distribution"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

const clients = [
  {
    name: "Faith Property Services",
    type: "Property Services",
    desc: "Full-stack digital presence built from the ground up — website, ongoing SEO, paid ads, content strategy, and a custom mobile app for client management.",
    services: ["Website", "SEO", "Google Ads", "Content", "Mobile App"],
    href: null,
  },
  {
    name: "Events by Sonder Clicks",
    type: "Events & Experiences",
    desc: "End-to-end digital strategy to drive event bookings and build a recognisable brand online — from search visibility to paid acquisition.",
    services: ["Website", "SEO", "Google Ads", "Content"],
    href: null,
  },
  {
    name: "Sonder Clicks",
    type: "Digital Agency",
    desc: "Full-service digital partnership — website, search visibility, paid campaigns, content, social media management, and a custom web app experience.",
    services: ["Website", "SEO", "Google Ads", "Content", "Social Media", "Web App"],
    href: "https://sonderclicks.com.au",
  },
];

const whyUs = [
  { title: "Transparent Reporting", desc: "You see exactly where every dollar goes and what it produces. No smoke, no mirrors — just clear numbers every month." },
  { title: "No Lock-In Contracts", desc: "We earn your business every single month. If we stop delivering, you're free to walk. That's how we stay sharp." },
  { title: "Direct Access", desc: "No junior account managers playing telephone. Work directly with the strategists running your campaigns." },
  { title: "Results First", desc: "We measure everything that matters — leads, revenue, and ROI. Vanity metrics aren't on our scorecards." },
];

const steps = [
  { num: "01", title: "Discover", desc: "We audit your current marketing, understand your goals, and map the highest-leverage growth opportunities." },
  { num: "02", title: "Strategise", desc: "We build a tailored roadmap with clear KPIs, a channel mix matched to your audience, and a 90-day plan." },
  { num: "03", title: "Execute", desc: "We run, test, and optimise relentlessly. Every campaign and every ad dollar is accountable to results." },
];

const foundingPerks = [
  "Heavily discounted monthly retainer",
  "Weekly strategy calls — direct team access",
  "Priority onboarding within 48 hours",
  "First 30 days free — prove results before you pay",
  "Lock in your rate for 12 months",
  "Co-created case study showcasing your growth",
];

const marqueeItems = [
  "SEO", "·", "Paid Ads", "·", "Social Media", "·", "Content Marketing", "·",
  "Melbourne Agency", "·", "Data-Driven Results", "·", "No Lock-In Contracts", "·",
  "SEO", "·", "Paid Ads", "·", "Social Media", "·", "Content Marketing", "·",
  "Melbourne Agency", "·", "Data-Driven Results", "·", "No Lock-In Contracts", "·",
];

/* ── Particle constellation — hero background ───────────────── */

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let mx = -9999, my = -9999;
    let scrollY = 0;

    const N = 100;
    const LINK_DIST = 135;

    interface Pt {
      x: number; y: number;
      vx: number; vy: number;
      ox: number; oy: number;
      svx: number; svy: number;
      r: number; phase: number;
    }

    let pts: Pt[] = [];

    const init = () => {
      pts = Array.from({ length: N }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          svx: (Math.random() - 0.5) * 5,
          svy: (Math.random() - 0.5) * 5,
          r: Math.random() * 1.3 + 0.6,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const heroEl = canvas.parentElement;

    const draw = () => {
      const heroH = heroEl?.offsetHeight ?? window.innerHeight;
      const sf = Math.min(1, scrollY / (heroH * 0.65));
      const ga = 1 - sf;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (ga > 0.01) {
        const t = Date.now() * 0.0003;

        for (const p of pts) {
          /* Mouse repulsion */
          const dx = p.x - mx, dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95 && d > 0) {
            const f = ((95 - d) / 95) * 0.55;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }

          /* Scroll scatter */
          p.vx += p.svx * sf * 0.038;
          p.vy += p.svy * sf * 0.038;

          /* Gentle spring to origin when calm */
          if (sf < 0.04) {
            p.vx += (p.ox - p.x) * 0.0025;
            p.vy += (p.oy - p.y) * 0.0025;
          }

          p.vx *= 0.93;
          p.vy *= 0.93;

          /* Ambient drift */
          p.x += p.vx + Math.sin(t + p.phase) * 0.14;
          p.y += p.vy + Math.cos(t + p.phase * 1.3) * 0.09;

          /* Wrap edges (while calm) */
          if (sf < 0.25) {
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,181,232,${0.78 * ga})`;
          ctx.fill();
        }

        /* Connections */
        ctx.lineWidth = 0.5;
        for (let i = 0; i < pts.length - 1; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < LINK_DIST) {
              ctx.strokeStyle = `rgba(196,181,232,${(1 - d / LINK_DIST) * 0.28 * ga})`;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove  = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -9999; my = -9999; };
    const onScroll = () => { scrollY = window.scrollY; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none hidden md:block"
    />
  );
}

/* ── Sticky scroll narrative — services swap as you scroll ── */
function StickyServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActive(Math.min(3, Math.floor(v * 4)));
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} id="services" style={{ height: "300vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-cream">
        {/* Ambient light */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-lavender/[0.07] blur-[130px] translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col pt-24 pb-10">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <span className="w-8 h-px bg-purple" />
            <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">What We Do</span>
          </div>

          <div className="flex-1 grid lg:grid-cols-2 gap-0 min-h-0">
            {/* Left: animated service content */}
            <div className="flex flex-col justify-center pr-0 lg:pr-20 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="font-playfair text-[3.5rem] md:text-[7rem] font-bold text-purple/[0.07] leading-none mb-1 select-none tabular-nums">
                    0{active + 1}
                  </div>
                  <div className="text-purple/35 mb-3">{services[active].icon}</div>
                  <div className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-purple mb-2">
                    {services[active].short}
                  </div>
                  <h2 className="font-playfair text-[1.9rem] md:text-[2.6rem] font-bold text-purple-deeper mb-5 leading-snug">
                    {services[active].title}
                  </h2>
                  <p className="text-purple-deeper/55 leading-relaxed text-[0.93rem] max-w-[420px] mb-6">
                    {services[active].desc}
                  </p>
                  <ul className="space-y-2">
                    {services[active].bullets.map((b, bi) => (
                      <motion.li
                        key={bi}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.18 + bi * 0.055 }}
                        className="flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple flex-shrink-0" />
                        <span className="text-[0.84rem] text-purple-deeper/60">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: service navigation — desktop only */}
            <div className="hidden lg:flex flex-col justify-center pl-20 border-l border-purple/[0.06]">
              <div className="space-y-6">
                {services.map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: active === i ? 1 : 0.2 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      animate={{ width: active === i ? 28 : 8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-px bg-purple flex-shrink-0"
                      style={{ minWidth: 8 }}
                    />
                    <div>
                      <div className={`text-[0.55rem] font-bold tracking-[0.2em] uppercase mb-0.5 transition-colors duration-300 ${active === i ? "text-purple" : "text-purple/30"}`}>
                        {s.short}
                      </div>
                      <span className={`font-playfair text-xl font-bold transition-colors duration-300 ${active === i ? "text-purple-deeper" : "text-purple-deeper/22"}`}>
                        {s.title}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress pills */}
              <div className="mt-12 flex items-center gap-2">
                {services.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ width: active === i ? 24 : 6, opacity: active === i ? 1 : 0.22 }}
                    transition={{ duration: 0.3 }}
                    className="h-1 rounded-full bg-purple"
                    style={{ minWidth: 6 }}
                  />
                ))}
                <span className="text-[0.57rem] tracking-[0.16em] uppercase text-purple/30 ml-2">Scroll to explore</span>
              </div>
            </div>

            {/* Mobile progress pills */}
            <div className="flex lg:hidden items-center gap-2 mt-6 self-end">
              {services.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ width: active === i ? 20 : 5, opacity: active === i ? 1 : 0.22 }}
                  transition={{ duration: 0.3 }}
                  className="h-1 rounded-full bg-purple"
                  style={{ minWidth: 5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Horizontal scroll work section — cards slide sideways ── */
function HorizontalWork() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <WorkMobile /> : <WorkDesktop />;
}

function WorkMobile() {
  return (
    <section id="work" className="bg-purple-deeper py-20 px-6">
      <div className="pointer-events-none absolute left-0 w-[300px] h-[300px] rounded-full bg-purple/30 blur-[120px] -translate-x-1/2" />
      <div className="relative max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-lavender/50" />
          <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/60">Our Work</span>
        </div>
        <h2 className="font-playfair text-[2rem] font-bold text-white tracking-[-0.02em] mb-10">
          Clients we&apos;ve built for
        </h2>
        <div className="flex flex-col gap-6">
          {clients.map((client, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="glass rounded-2xl p-7">
                <div className="w-6 h-px bg-lavender/30 mb-5" />
                <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-lavender/50 mb-1">{client.type}</div>
                <h3 className="font-playfair text-[1.5rem] font-bold text-white mb-3 leading-snug">{client.name}</h3>
                <p className="text-lavender/65 text-[0.88rem] leading-relaxed mb-5">{client.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {client.services.map((s) => (
                    <span key={s} className="text-[0.58rem] font-bold tracking-[0.14em] uppercase px-3 py-1.5 bg-lavender/10 text-lavender/70 rounded-full border border-lavender/15">
                      {s}
                    </span>
                  ))}
                </div>
                {client.href && (
                  <a href={client.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lavender text-[0.68rem] font-bold tracking-[0.16em] uppercase">
                    Visit site <Arrow />
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Non-linear map: dwell on each card, quick transition between */
  const x = useTransform(
    scrollYProgress,
    [0, 0.12, 0.38, 0.5, 0.62, 0.88, 1],
    ["0vw", "0vw", "-100vw", "-100vw", "-100vw", "-200vw", "-200vw"]
  );

  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v < 0.44) setActiveCard(0);
      else if (v < 0.75) setActiveCard(1);
      else setActiveCard(2);
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} id="work" style={{ height: "400vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-purple-deeper">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 w-[500px] h-[500px] rounded-full bg-purple/30 blur-[140px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute right-0 bottom-0 w-[300px] h-[300px] rounded-full bg-purple-mid/20 blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Header — pinned above cards */}
        <div className="absolute top-0 left-0 right-0 pt-16 px-12 lg:px-20 z-10">
          <div className="max-w-7xl mx-auto flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-lavender/50" />
                <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/60">Our Work</span>
              </div>
              <h2 className="font-playfair text-[2.6rem] font-bold text-white tracking-[-0.02em]">
                Clients we&apos;ve built for
              </h2>
            </div>
            {/* Card counter */}
            <div className="flex items-baseline gap-1 mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeCard}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25 }}
                  className="font-playfair text-[2.6rem] font-bold text-white tabular-nums leading-none"
                >
                  0{activeCard + 1}
                </motion.span>
              </AnimatePresence>
              <span className="text-[0.65rem] font-bold tracking-[0.1em] text-lavender/30 mb-1">/ 03</span>
            </div>
          </div>
        </div>

        {/* Scrolling cards strip */}
        <motion.div
          style={{ x, width: "300vw" }}
          className="absolute top-0 left-0 flex h-full will-change-transform"
        >
          {clients.map((client, i) => (
            <div
              key={i}
              className="relative w-screen h-full flex-shrink-0 flex items-center px-12 lg:px-20 pt-36 pb-16"
            >
              {/* Ghost number */}
              <div className="pointer-events-none select-none absolute right-20 top-1/2 -translate-y-1/2 font-playfair font-bold text-white/[0.04] text-[14rem] leading-none tabular-nums">
                0{i + 1}
              </div>

              <div className="relative max-w-2xl w-full">
                <div className="glass rounded-2xl p-12">
                  <div className="w-8 h-px bg-lavender/30 mb-6" />
                  <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-lavender/50 mb-2">{client.type}</div>
                  <h3 className="font-playfair text-[2.2rem] font-bold text-white mb-4 leading-snug">{client.name}</h3>
                  <p className="text-lavender/65 text-[0.9rem] leading-relaxed mb-7 max-w-lg">{client.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {client.services.map((s) => (
                      <span key={s} className="text-[0.6rem] font-bold tracking-[0.14em] uppercase px-3 py-1.5 bg-lavender/10 text-lavender/70 rounded-full border border-lavender/15">
                        {s}
                      </span>
                    ))}
                  </div>
                  {client.href && (
                    <a href={client.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lavender text-[0.68rem] font-bold tracking-[0.16em] uppercase hover:gap-3 transition-all duration-200">
                      Visit site <Arrow />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress pills */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {clients.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: activeCard === i ? 28 : 7, opacity: activeCard === i ? 1 : 0.28 }}
              transition={{ duration: 0.35 }}
              className="h-1 rounded-full bg-lavender"
              style={{ minWidth: 7 }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ opacity: activeCard === 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-10 right-20 flex items-center gap-2 text-lavender/30 z-10"
        >
          <span className="text-[0.58rem] font-bold tracking-[0.16em] uppercase">Scroll</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function Home() {
  const { scrollY } = useScroll();

  return (
    <>
      <Navbar />
      <SpotlightCursor />
      <FloatingCTA />
      <ColorMorph />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-purple-deeper">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb1 absolute top-[-100px] right-[-80px] w-[500px] h-[500px] rounded-full bg-purple/40 blur-[100px]" />
          <div className="orb2 absolute bottom-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-purple-mid/30 blur-[120px]" />
          <div className="orb3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-lavender/10 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(196,181,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,232,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Particle constellation */}
        <ParticleField />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 md:pt-36 pb-16 md:pb-24 w-full grid lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
          <div>
            <div className="hero-t1 flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-lavender/60" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/70">
                Digital Marketing · Melbourne
              </span>
            </div>

            {/* Word-by-word reveal headline */}
            <h1 className="font-playfair text-[2.4rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] leading-[1.05] font-bold text-white tracking-[-0.025em] mb-8">
              <RevealWord word="Marketing" progress={scrollY} start={0} end={80} />{" "}
              <RevealWord word="that" progress={scrollY} start={60} end={140} />
              <br />
              <RevealWord word="moves" progress={scrollY} start={120} end={200} />{" "}
              <RevealWord word="businesses" progress={scrollY} start={180} end={260} />
              <br />
              <RevealWord word="forward." progress={scrollY} start={240} end={320} className="text-lavender" />
            </h1>

            <p className="hero-t3 text-[1.05rem] text-lavender/60 max-w-[440px] leading-relaxed mb-12">
              We build data-driven strategies that turn clicks into customers — and ad budgets into compounding, measurable revenue.
            </p>

            <div className="hero-t4 flex flex-wrap gap-4">
              <a href="#contact"
                className="inline-flex items-center gap-3 bg-lavender text-purple-deeper text-[0.7rem] font-bold tracking-[0.14em] uppercase px-8 py-4 hover:bg-white transition-colors duration-200 group">
                Get a Free Audit
                <span className="group-hover:translate-x-1 transition-transform duration-200"><Arrow /></span>
              </a>
              <a href="#founding"
                className="inline-flex items-center gap-3 border-2 border-lavender/40 text-lavender text-[0.7rem] font-bold tracking-[0.14em] uppercase px-8 py-4 hover:border-lavender hover:bg-lavender/10 transition-all duration-200">
                Founding Client Offer
              </a>
            </div>
          </div>

          <div className="hero-t3 hidden lg:flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-lavender/20 blur-3xl scale-110" />
              <div className="relative w-64 h-64 xl:w-80 xl:h-80 rounded-3xl overflow-hidden border border-lavender/20 shadow-2xl shadow-purple/40">
                <Image src="/logo.jpeg" alt="OnetyOne" fill className="object-cover" priority />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-deeper to-transparent pointer-events-none" />
      </section>

      {/* ── Marquee ── */}
      <div className="bg-purple py-4 overflow-hidden border-y border-lavender/15">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className={`px-4 text-[0.7rem] font-bold tracking-[0.18em] uppercase whitespace-nowrap ${
                item === "·" ? "text-lavender/30" : "text-lavender/70"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Services — sticky scroll narrative ── */}
      <StickyServices />

      {/* ── Work — horizontal scroll ── */}
      <HorizontalWork />

      {/* ── Stats ── */}
      <section className="bg-purple-deeper py-16 md:py-20 px-6 border-y border-lavender/[0.08]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-lavender/10">
          {[
            { to: 3, suffix: "", label: "Active Clients" },
            { to: 6, suffix: "+", label: "Services Delivered" },
            { to: 100, suffix: "%", label: "Transparent Reporting" },
            { to: 0, suffix: "", label: "Lock-in Contracts", prefix: "No " },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.1} className="flex flex-col items-center text-center md:px-8">
              <div className="font-playfair text-[3.2rem] md:text-[4rem] font-bold text-white leading-none mb-2 tabular-nums">
                {s.prefix && <span className="text-lavender">{s.prefix}</span>}
                <StatCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-lavender/40">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section id="why-us" className="bg-purple-deeper py-16 md:py-28 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full bg-purple/40 blur-[120px] translate-x-1/2 -translate-y-1/3" />
          <div className="absolute left-0 bottom-0 w-[300px] h-[300px] rounded-full bg-purple-mid/20 blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-lavender/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/60">Why OnetyOne</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-[3rem] font-bold text-white tracking-[-0.02em]">
              A different kind of agency
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((w, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass p-8 rounded-2xl hover:border-lavender/30 transition-all duration-300 group">
                  <div className="w-8 h-px bg-lavender/50 mb-6 group-hover:w-12 group-hover:bg-lavender transition-all duration-300" />
                  <h3 className="font-playfair text-xl font-bold text-white mb-3">{w.title}</h3>
                  <p className="text-lavender/75 text-[0.88rem] leading-relaxed">{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="py-16 md:py-28 px-6 bg-lavender-light">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-purple" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">Our Approach</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-[3rem] font-bold text-purple-deeper tracking-[-0.02em]">
              How we work
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="relative">
                  <div className="font-playfair text-[5rem] font-bold text-purple/20 leading-none mb-4 select-none">
                    {s.num}
                  </div>
                  <div className="w-8 h-px bg-purple mb-6" />
                  <h3 className="font-playfair text-2xl font-bold text-purple-deeper mb-4">{s.title}</h3>
                  <p className="text-purple-deeper/55 leading-relaxed text-[0.9rem]">{s.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 right-[-32px] lg:right-[-40px] text-purple/20 text-2xl select-none pointer-events-none">→</div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding Clients ── */}
      <section id="founding" className="py-16 md:py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <FadeIn>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-purple" />
                <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">Limited Availability</span>
              </div>
              <h2 className="font-playfair text-4xl md:text-[2.8rem] font-bold text-purple-deeper tracking-[-0.02em] mb-6 leading-tight">
                Become a<br />
                <em className="not-italic text-purple">Founding Client.</em>
              </h2>
              <p className="text-purple-deeper/70 leading-relaxed mb-4">
                We&apos;re a young, results-driven agency with real client work behind us — and we&apos;re opening just{" "}
                <strong className="text-purple-deeper">5 founding client spots</strong> at a heavily discounted rate to grow our portfolio.
              </p>
              <p className="text-purple-deeper/70 leading-relaxed mb-10">
                In exchange, we ask for honest feedback and the chance to share your results as a case study. No hidden terms — just a partnership built on mutual growth.
              </p>

              <ul className="space-y-4 mb-10">
                {foundingPerks.map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <Check />
                    <span className="text-[0.9rem] text-purple-deeper/75">{p}</span>
                  </motion.li>
                ))}
              </ul>

              <a href="#contact"
                className="inline-flex items-center gap-3 bg-purple text-white text-[0.7rem] font-bold tracking-[0.16em] uppercase px-8 py-4 hover:bg-purple-dark transition-colors duration-200 group">
                Apply for a Founding Spot
                <span className="group-hover:translate-x-1 transition-transform duration-200"><Arrow /></span>
              </a>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:pt-16">
              <div className="bg-purple-deeper rounded-2xl p-10 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple/40 blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/50 mb-8">
                  What you get
                </div>
                <div className="space-y-7">
                  {[
                    ["Deep-dive audit", "We map every gap and opportunity across your current marketing."],
                    ["Custom 90-day strategy", "A clear, prioritised plan with KPIs tied to your goals."],
                    ["Full execution", "We run everything — ads, content, social, SEO."],
                    ["Monthly reviews", "Sit down with your team, review the numbers, adjust the plan."],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-7 h-7 bg-lavender/10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-lavender text-[0.6rem] font-bold">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold mb-1">{title}</div>
                        <div className="text-lavender/40 text-[0.82rem] leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-16 md:py-28 px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <FadeIn>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-purple" />
                <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">Get in Touch</span>
              </div>
              <h2 className="font-playfair text-4xl md:text-[2.8rem] font-bold text-purple-deeper tracking-[-0.02em] mb-6 leading-tight">
                Let&apos;s talk about<br />
                <em className="not-italic text-purple">your growth.</em>
              </h2>
              <p className="text-purple-deeper/55 leading-relaxed mb-10 max-w-sm">
                Whether you&apos;re curious about the founding client offer, want a free audit, or just have questions — we&apos;d love to hear from you.
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Email",
                    value: "info.onetyone@gmail.com",
                    href: "mailto:info.onetyone@gmail.com",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                  },
                  {
                    label: "Phone",
                    value: "+61 416 316 119",
                    href: "tel:+61416316119",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9A16 16 0 0 0 15 16.09l1.27-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Location",
                    value: "Melbourne, VIC, Australia",
                    href: null,
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl border border-purple/20 bg-purple/5 flex items-center justify-center flex-shrink-0 text-purple">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-purple-deeper/40 mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-purple-deeper font-medium hover:text-purple transition-colors duration-200 text-sm">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-purple-deeper font-medium text-sm">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-28 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-purple" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">FAQ</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-[3rem] font-bold text-purple-deeper tracking-[-0.02em]">
              Common questions
            </h2>
          </FadeIn>
          <div className="divide-y divide-purple/[0.08]">
            {[
              { q: "How much do your services cost?", a: "We tailor pricing to each business. Most clients start between $500–$2,000/month depending on services and scope. Book a free audit and we'll give you a clear number — no vague quotes." },
              { q: "Do I need to sign a long-term contract?", a: "No. We work month-to-month. You stay because we deliver results, not because you're locked in. That's what keeps us sharp." },
              { q: "How long before I see results?", a: "Paid ads can show results within the first week. SEO typically takes 3–6 months to compound and grow. We'll set honest expectations from day one — no inflated promises." },
              { q: "What do I need to get started?", a: "Just a conversation. We audit your current marketing, identify the highest-leverage opportunities, and build a 90-day plan. No commitment required for the initial audit." },
              { q: "Do you work with businesses outside Melbourne?", a: "Yes. We work with businesses across Australia and can work remotely with anyone. Most of our work is digital and doesn't require us to be in the same city." },
              { q: "What's the Founding Client offer?", a: "We're opening 5 spots at a heavily discounted rate in exchange for honest feedback and a case study. You get full service — SEO, ads, content, or whatever you need — at a fraction of the normal price." },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="about" className="bg-purple-deeper border-t border-lavender/[0.08] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-lavender/20">
                  <Image src="/logo.jpeg" alt="OnetyOne" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <span className="font-playfair text-2xl font-bold text-white tracking-[-0.02em]">OnetyOne</span>
              </div>
              <p className="text-lavender/35 text-sm leading-relaxed max-w-sm mb-4">
                A results-first digital marketing agency helping ambitious businesses grow through SEO, paid advertising, social media, and content marketing.
              </p>
              <p className="text-lavender/20 text-xs">Melbourne, VIC, Australia</p>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-lavender/40 mb-5">Services</div>
              <ul className="flex flex-col gap-2.5">
                {["SEO", "Paid Ads", "Social Media", "Content Marketing"].map((s) => (
                  <li key={s}>
                    <a href="#services" className="text-lavender/35 hover:text-lavender/65 text-sm transition-colors duration-200">{s}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-lavender/40 mb-5">Contact</div>
              <ul className="flex flex-col gap-2.5">
                <li><a href="mailto:info.onetyone@gmail.com" className="text-lavender/35 hover:text-lavender/65 text-sm transition-colors duration-200">info.onetyone@gmail.com</a></li>
                <li><a href="tel:+61416316119" className="text-lavender/35 hover:text-lavender/65 text-sm transition-colors duration-200">+61 416 316 119</a></li>
                <li className="pt-2">
                  <a href="#founding" className="text-lavender/60 hover:text-lavender text-sm font-medium transition-colors duration-200">→ Founding Client Offer</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-lavender/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-lavender/20 text-[0.7rem] tracking-wider">
              © {new Date().getFullYear()} OnetyOne Digital. All rights reserved.
            </p>
            <p className="text-lavender/20 text-[0.7rem] tracking-wider">
              Melbourne, VIC · info.onetyone@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
