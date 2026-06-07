"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Why Us", href: "#why-us" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-purple-deeper/95 backdrop-blur-md border-b border-lavender/10 shadow-lg shadow-purple-deeper/20"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-lavender/20 group-hover:border-lavender/50 transition-colors duration-200">
            <Image
              src="/logo.jpeg"
              alt="OnetyOne"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-playfair text-xl font-bold text-white tracking-[-0.02em] hidden sm:block">
            OnetyOne
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-lavender/60 hover:text-lavender transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[0.68rem] font-bold tracking-[0.16em] uppercase bg-lavender text-purple-deeper px-6 py-3 hover:bg-lavender-light transition-colors duration-200"
          >
            Free Audit
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-end gap-[5px] w-8 h-8"
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-lavender transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-[6px]" : "w-6"}`} />
          <span className={`block h-px bg-lavender transition-all duration-300 ${open ? "opacity-0 w-4" : "w-4"}`} />
          <span className={`block h-px bg-lavender transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-[6px]" : "w-6"}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-purple-deeper/98 border-t border-lavender/10 px-6 pt-4 pb-6 flex flex-col gap-3">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-xs font-semibold tracking-[0.16em] uppercase text-lavender/60 py-2 border-b border-lavender/10"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="text-xs font-bold tracking-[0.16em] uppercase bg-lavender text-purple-deeper px-6 py-3 text-center mt-2"
          >
            Free Audit
          </a>
        </div>
      )}
    </nav>
  );
}
