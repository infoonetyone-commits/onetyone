"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import ContactForm from "./components/ContactForm";

/* ── Helpers ────────────────────────────────────────────── */

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

/* ── Data ───────────────────────────────────────────────── */

const services = [
  {
    short: "SEO",
    title: "Search Engine Optimisation",
    desc: "Rank where it matters. Sustainable organic strategies that compound over time — driving qualified traffic month after month.",
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
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

/* ── Page ───────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-purple-deeper">
        {/* Animated orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb1 absolute top-[-100px] right-[-80px] w-[500px] h-[500px] rounded-full bg-purple/40 blur-[100px]" />
          <div className="orb2 absolute bottom-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-purple-mid/30 blur-[120px]" />
          <div className="orb3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-lavender/10 blur-[80px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(196,181,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,232,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-24 w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <div className="hero-t1 flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-lavender/60" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/70">
                Digital Marketing · Melbourne
              </span>
            </div>

            <h1 className="hero-t2 font-playfair text-[3rem] md:text-[4rem] lg:text-[5rem] leading-[1.05] font-bold text-white tracking-[-0.025em] mb-8">
              Marketing that
              <br />
              moves businesses
              <br />
              <em className="not-italic text-lavender">forward.</em>
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

          {/* Right — large logo */}
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

        {/* Bottom fade */}
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

      {/* ── Services ── */}
      <section id="services" className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-purple" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-purple">What We Do</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-[3rem] font-bold text-purple-deeper tracking-[-0.02em]">
              Services built for growth
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-px bg-purple/[0.08]">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group bg-cream p-8 lg:p-10 hover:bg-purple-deeper transition-all duration-300 cursor-pointer h-full">
                  <div className="w-8 h-px bg-purple mb-6 group-hover:bg-lavender transition-colors duration-300" />
                  <div className="text-purple/30 group-hover:text-lavender/60 transition-colors duration-300 mb-4">
                    {s.icon}
                  </div>
                  <div className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-purple group-hover:text-lavender/60 mb-2 transition-colors duration-300">
                    {s.short}
                  </div>
                  <h3 className="font-playfair text-[1.5rem] font-bold text-purple-deeper group-hover:text-white transition-colors duration-300 mb-4 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-purple-deeper/55 group-hover:text-white/60 transition-colors duration-300 leading-relaxed text-[0.9rem]">
                    {s.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-purple group-hover:text-lavender text-[0.65rem] font-bold tracking-[0.18em] uppercase transition-colors duration-300">
                    Learn more
                    <span className="group-hover:translate-x-1 transition-transform duration-200"><Arrow /></span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <section id="work" className="py-28 px-6 bg-purple-deeper relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 w-[500px] h-[500px] rounded-full bg-purple/30 blur-[140px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute right-0 bottom-0 w-[300px] h-[300px] rounded-full bg-purple-mid/20 blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-lavender/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-lavender/60">Our Work</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-[3rem] font-bold text-white tracking-[-0.02em]">
              Clients we&apos;ve built for
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
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
            ].map((client, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-8 h-full flex flex-col group hover:border-lavender/30 transition-all duration-300">
                  <div className="w-8 h-px bg-lavender/30 mb-6 group-hover:w-12 group-hover:bg-lavender transition-all duration-300" />
                  <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-lavender/50 mb-2">{client.type}</div>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-3 leading-snug">{client.name}</h3>
                  <p className="text-lavender/65 text-[0.88rem] leading-relaxed mb-6 flex-1">{client.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section id="why-us" className="bg-purple-deeper py-28 px-6 relative overflow-hidden">
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
      <section id="process" className="py-28 px-6 bg-lavender-light">
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
      <section id="founding" className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
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

            {/* Right panel */}
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
      <section id="contact" className="py-28 px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
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
