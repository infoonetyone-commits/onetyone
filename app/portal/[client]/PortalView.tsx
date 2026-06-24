'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  X,
  Sparkles,
  CheckCircle2,
  Clock3,
  Send,
  PencilRuler,
} from 'lucide-react'

// Brand icons (lucide v1 dropped these — inline SVGs instead)
function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function Facebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}
import type { ClientConfig } from '../../lib/clients'
import type { Post, ClientStatus } from '../../lib/notion'

// ─── Brand tokens ───────────────────────────────────────────────────────────
const PURPLE = '#5A0EA5'
const PURPLE_DEEP = '#1E0045'
const CYAN = '#0EA5A5'

// ─── Status presentation ────────────────────────────────────────────────────
const STATUS_STYLE: Record<
  ClientStatus,
  { label: string; color: string; bg: string; Icon: typeof Clock3 }
> = {
  'In Production': { label: 'In Production', color: '#8257B5', bg: '#F1ECFA', Icon: PencilRuler },
  'Awaiting Your Approval': { label: 'Needs Approval', color: '#B8860B', bg: '#FBF3DD', Icon: Clock3 },
  Scheduled: { label: 'Scheduled', color: '#1D6FB8', bg: '#E5F0FB', Icon: Send },
  Published: { label: 'Published', color: '#1F8A55', bg: '#E4F5EC', Icon: CheckCircle2 },
}

// ─── Date helpers (parse as local, no timezone drift) ───────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseDay(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

export default function PortalView({ config, posts }: { config: ClientConfig; posts: Post[] }) {
  const [business, setBusiness] = useState<string>('All')
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [active, setActive] = useState<Post | null>(null)

  const accentFor = (name: string) =>
    config.businesses.find((b) => b.name === name)?.accent ?? PURPLE

  const filtered = useMemo(
    () => posts.filter((p) => business === 'All' || p.business === business),
    [posts, business],
  )

  // Derive the calendar month from the first dated post.
  const firstDated = posts.find((p) => p.postDate)?.postDate
  const { y: year, m: month } = firstDated
    ? parseDay(firstDated)
    : { y: new Date().getFullYear(), m: new Date().getMonth() }

  const stats = useMemo(() => {
    const perBusiness = config.businesses.map((b) => ({
      name: b.name,
      count: posts.filter((p) => p.business === b.name).length,
    }))
    return { total: posts.length, perBusiness }
  }, [posts, config.businesses])

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9FF', color: PURPLE_DEEP }}>
      {/* Entrance animation (inline <style> — proven reliable in this codebase) */}
      <style>{`
        @keyframes portalRise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .p-rise { animation: portalRise 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .p-d1 { animation-delay: 0.04s; }
        .p-d2 { animation-delay: 0.13s; }
        .p-d3 { animation-delay: 0.22s; }
        .p-d4 { animation-delay: 0.31s; }
        @media (prefers-reduced-motion: reduce) {
          .p-rise { animation: none; }
        }
      `}</style>

      {/* ════════ TOP BAR ════════ */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3"
        style={{ background: 'rgba(250,249,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E7E0F5' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg overflow-hidden" style={{ width: 34, height: 34, boxShadow: '0 2px 10px rgba(90,14,165,0.25)' }}>
            <Image src="/logo.jpeg" alt="OnetyOne" width={68} height={68} className="w-full h-full object-cover" />
          </div>
          <div className="leading-none">
            <span className="block text-sm font-bold" style={{ fontFamily: 'var(--font-playfair-var), serif' }}>OnetyOne</span>
            <span className="block text-[10px] tracking-[0.18em] uppercase" style={{ color: '#9B8BC2' }}>Client Hub</span>
          </div>
        </div>
        <span
          className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full tracking-[0.1em] uppercase"
          style={{ background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`, color: '#fff' }}
        >
          {config.packageName}
        </span>
      </header>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden px-5 sm:px-8 pt-12 pb-14" style={{ background: `linear-gradient(150deg, ${PURPLE_DEEP} 0%, ${PURPLE} 55%, #7B2FCF 100%)` }}>
        {/* floating orbs */}
        <div className="orb1 absolute pointer-events-none" style={{ width: 320, height: 320, top: -120, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)', borderRadius: '50%' }} />
        <div className="orb2 absolute pointer-events-none" style={{ width: 260, height: 260, bottom: -120, left: -40, background: `radial-gradient(circle, ${CYAN}33, transparent 70%)`, borderRadius: '50%' }} />

        <div className="relative max-w-5xl mx-auto">
          <p className="p-rise p-d1 text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: '#C4B5E8' }}>
            Social Media Content Hub
          </p>
          <h1 className="p-rise p-d2 font-bold text-white" style={{ fontFamily: 'var(--font-playfair-var), serif', fontSize: 'clamp(2.2rem, 7vw, 4rem)', lineHeight: 1.05 }}>
            {config.name}
          </h1>
          <p className="p-rise p-d3 mt-3 text-base sm:text-lg" style={{ color: '#D9CCF2' }}>
            {config.tagline}
          </p>

          {/* stat pills */}
          <div className="p-rise p-d4 mt-8 flex flex-wrap gap-3">
            <StatPill label="Posts This Month" value={String(stats.total)} />
            {stats.perBusiness.map((b) => (
              <StatPill key={b.name} label={b.name} value={String(b.count)} dot={accentFor(b.name)} />
            ))}
            <StatPill label="Cadence" value="3×/week" />
          </div>
        </div>
      </section>

      {/* ════════ CONTROLS ════════ */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-7 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl"
          style={{ background: '#fff', boxShadow: '0 8px 30px rgba(90,14,165,0.10)', border: '1px solid #EFEAF8' }}>
          {/* business filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterChip active={business === 'All'} onClick={() => setBusiness('All')} label="All" />
            {config.businesses.map((b) => (
              <FilterChip key={b.name} active={business === b.name} onClick={() => setBusiness(b.name)} label={b.name} dot={b.accent} />
            ))}
          </div>
          {/* view toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl self-start sm:self-auto" style={{ background: '#F4F0FB' }}>
            <ViewBtn active={view === 'calendar'} onClick={() => setView('calendar')} Icon={CalendarIcon} label="Calendar" />
            <ViewBtn active={view === 'list'} onClick={() => setView('list')} Icon={LayoutGrid} label="List" />
          </div>
        </div>
      </div>

      {/* ════════ CONTENT ════════ */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-playfair-var), serif' }}>
          {MONTHS[month]} {year}
        </h2>

        {view === 'calendar'
          ? <CalendarView year={year} month={month} posts={filtered} accentFor={accentFor} onSelect={setActive} />
          : <ListView posts={filtered} accentFor={accentFor} onSelect={setActive} />}
      </main>

      {/* ════════ FOOTER ════════ */}
      <footer className="px-5 sm:px-8 py-10 text-center" style={{ borderTop: '1px solid #EBE4F7' }}>
        <p className="text-xs" style={{ color: '#9B8BC2' }}>
          Managed by <span className="font-semibold" style={{ color: PURPLE }}>{config.managedBy}</span>
          {' · '}
          <a href="mailto:info.onetyone@gmail.com" className="hover:underline" style={{ color: '#9B8BC2' }}>info.onetyone@gmail.com</a>
        </p>
        <p className="text-[11px] mt-1.5" style={{ color: '#C4B5E8' }}>
          © {new Date().getFullYear()} {config.managedBy}. This hub is private to {config.name}.
        </p>
      </footer>

      {/* ════════ POST DETAIL MODAL ════════ */}
      {active && (
        <PostModal post={active} accent={accentFor(active.business)} onClose={() => setActive(null)} />
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)' }}>
      <div className="flex items-center gap-1.5">
        {dot && <span className="rounded-full" style={{ width: 7, height: 7, background: dot, boxShadow: `0 0 0 2px rgba(255,255,255,0.25)` }} />}
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <span className="text-[10px] tracking-wide uppercase" style={{ color: '#C4B5E8' }}>{label}</span>
    </div>
  )
}

function FilterChip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{ background: active ? PURPLE : 'transparent', color: active ? '#fff' : '#6B5B95' }}>
      {dot && <span className="rounded-full" style={{ width: 7, height: 7, background: active ? '#fff' : dot }} />}
      {label}
    </button>
  )
}

function ViewBtn({ active, onClick, Icon, label }: { active: boolean; onClick: () => void; Icon: typeof CalendarIcon; label: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
      style={{ background: active ? '#fff' : 'transparent', color: active ? PURPLE : '#9B8BC2', boxShadow: active ? '0 1px 4px rgba(90,14,165,0.12)' : 'none' }}>
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function PlatformIcons({ platform }: { platform: string }) {
  const ig = /insta/i.test(platform)
  const fb = /face/i.test(platform)
  return (
    <span className="inline-flex items-center gap-1" style={{ color: '#9B8BC2' }}>
      {ig && <Instagram className="w-3 h-3" />}
      {fb && <Facebook className="w-3 h-3" />}
    </span>
  )
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: s.bg, color: s.color }}>
      <s.Icon className="w-2.5 h-2.5" />
      {s.label}
    </span>
  )
}

// ─── Calendar view ────────────────────────────────────────────────────────────

function CalendarView({ year, month, posts, accentFor, onSelect }: {
  year: number; month: number; posts: Post[]; accentFor: (n: string) => string; onSelect: (p: Post) => void
}) {
  const byDay = useMemo(() => {
    const map: Record<number, Post[]> = {}
    posts.forEach((p) => {
      if (!p.postDate) return
      const { y, m, d } = parseDay(p.postDate)
      if (y === year && m === month) (map[d] ??= []).push(p)
    })
    return map
  }, [posts, year, month])

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const today = new Date()
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #EBE4F7', background: '#fff' }}>
      {/* weekday header */}
      <div className="grid grid-cols-7" style={{ background: '#F7F3FD' }}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2.5 text-center text-[10px] sm:text-xs font-semibold tracking-wider uppercase" style={{ color: '#9B8BC2' }}>
            <span className="sm:hidden">{w[0]}</span><span className="hidden sm:inline">{w}</span>
          </div>
        ))}
      </div>
      {/* day grid */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="min-h-[80px] sm:min-h-[116px] p-1.5 border-t border-l first:border-l-0" style={{ borderColor: '#F0EBF9' }}>
            {d && (
              <>
                <span className="inline-flex items-center justify-center text-[11px] sm:text-xs font-semibold mb-1"
                  style={isToday(d)
                    ? { width: 20, height: 20, borderRadius: '50%', background: PURPLE, color: '#fff' }
                    : { color: '#B0A2CE' }}>
                  {d}
                </span>
                <div className="space-y-1">
                  {(byDay[d] ?? []).map((p) => (
                    <button key={p.id} onClick={() => onSelect(p)}
                      className="w-full text-left px-1.5 py-1 rounded-md transition-transform hover:scale-[1.02]"
                      style={{ background: `${accentFor(p.business)}12`, borderLeft: `2.5px solid ${accentFor(p.business)}` }}>
                      <span className="block text-[9px] sm:text-[10px] font-medium leading-tight line-clamp-2" style={{ color: PURPLE_DEEP }}>
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({ posts, accentFor, onSelect }: {
  posts: Post[]; accentFor: (n: string) => string; onSelect: (p: Post) => void
}) {
  const sorted = [...posts].sort((a, b) => (a.postDate ?? '').localeCompare(b.postDate ?? ''))
  if (sorted.length === 0) {
    return <p className="text-center py-16 text-sm" style={{ color: '#9B8BC2' }}>No posts to show.</p>
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {sorted.map((p) => {
        const accent = accentFor(p.business)
        const { d, m } = p.postDate ? parseDay(p.postDate) : { d: 0, m: 0 }
        return (
          <button key={p.id} onClick={() => onSelect(p)}
            className="text-left p-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: '#fff', border: '1px solid #EBE4F7', borderTop: `3px solid ${accent}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: accent }}>
                <span className="rounded-full" style={{ width: 7, height: 7, background: accent }} />
                {p.business}
              </span>
              {p.postDate && (
                <span className="text-[11px] font-semibold" style={{ color: '#9B8BC2' }}>
                  {WEEKDAYS[new Date(p.postDate).getDay()]} {MONTHS[m].slice(0, 3)} {d}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1.5 leading-snug">{p.title}</h3>
            <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#7A6BA0' }}>{p.caption}</p>
            <div className="flex items-center justify-between">
              <StatusBadge status={p.clientStatus} />
              <PlatformIcons platform={p.platform} />
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── Post detail modal ────────────────────────────────────────────────────────

function PostModal({ post, accent, onClose }: { post: Post; accent: string; onClose: () => void }) {
  const { d, m, y } = post.postDate ? parseDay(post.postDate) : { d: 0, m: 0, y: 0 }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 portal-modal-backdrop"
      style={{ background: 'rgba(30,0,69,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden portal-modal-card"
        style={{ background: '#fff', maxHeight: '88vh' }}>
        {/* header band */}
        <div className="relative px-6 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${accent}, ${PURPLE_DEEP})` }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} aria-label="Close">
            <X className="w-4 h-4 text-white" />
          </button>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            <span className="rounded-full" style={{ width: 6, height: 6, background: '#fff' }} />
            {post.business}
          </span>
          <h3 className="text-white font-bold text-xl leading-snug" style={{ fontFamily: 'var(--font-playfair-var), serif' }}>{post.title}</h3>
          {post.postDate && (
            <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {WEEKDAYS[new Date(post.postDate).getDay()]}, {MONTHS[m]} {d}, {y}
            </p>
          )}
        </div>

        {/* body */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(88vh - 160px)' }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <StatusBadge status={post.clientStatus} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#F1ECFA', color: '#8257B5' }}>
              <Sparkles className="w-2.5 h-2.5" />{post.pillar}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#F4F0FB', color: '#6B5B95' }}>
              <PlatformIcons platform={post.platform} />{post.platform}
            </span>
          </div>

          <p className="text-[11px] font-semibold tracking-wider uppercase mb-2" style={{ color: '#9B8BC2' }}>Caption</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#3D2A66' }}>{post.caption}</p>

          {/* graphic */}
          <p className="text-[11px] font-semibold tracking-wider uppercase mt-5 mb-2" style={{ color: '#9B8BC2' }}>Graphic</p>
          {post.graphicUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.graphicUrl} alt={post.title} className="w-full rounded-xl" />
          ) : (
            <div className="w-full rounded-xl flex flex-col items-center justify-center gap-1.5 py-10" style={{ background: '#F7F3FD', border: '1px dashed #D9CCF2' }}>
              <PencilRuler className="w-5 h-5" style={{ color: '#C4B5E8' }} />
              <span className="text-xs" style={{ color: '#9B8BC2' }}>Graphic in production</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
