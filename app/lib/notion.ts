import { Client } from '@notionhq/client'

// ─── Types ──────────────────────────────────────────────────────────────────

export type ClientStatus =
  | 'In Production'
  | 'Awaiting Your Approval'
  | 'Scheduled'
  | 'Published'

export interface Post {
  id: string
  title: string
  business: string
  platform: string
  pillar: string
  postDate: string | null // ISO date (YYYY-MM-DD)
  status: string // raw Notion status
  clientStatus: ClientStatus // client-friendly label (internal stages hidden)
  caption: string
  graphicUrl: string | null
  clientApproval: string // the client's own Approved / Changes Requested / Pending state
  // NOTE: internal "Notes" field (consent flags etc.) is deliberately never exposed.
}

// ─── Internal → client-facing status mapping ────────────────────────────────
// The client never sees our internal production granularity.

const STATUS_MAP: Record<string, ClientStatus> = {
  Idea: 'In Production',
  Writing: 'In Production',
  Design: 'In Production',
  'Internal Review': 'In Production',
  'Client Approval': 'Awaiting Your Approval',
  Scheduled: 'Scheduled',
  Posted: 'Published',
}

function toClientStatus(raw: string): ClientStatus {
  return STATUS_MAP[raw] ?? 'In Production'
}

// ─── Notion property extractors (defensive — handle missing/typed fields) ───

/* eslint-disable @typescript-eslint/no-explicit-any */
function readTitle(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join('') ?? ''
}
function readText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
}
function readSelect(prop: any): string {
  return prop?.select?.name ?? ''
}
function readStatus(prop: any): string {
  return prop?.status?.name ?? prop?.select?.name ?? ''
}
function readDate(prop: any): string | null {
  return prop?.date?.start ?? null
}
function readUrl(prop: any): string | null {
  return prop?.url ?? (prop?.rich_text ? readText(prop) || null : null)
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch a client's posts from their Notion content database.
 * Falls back to bundled mock data when NOTION_TOKEN / databaseId are absent,
 * so the portal always renders something real-looking in development.
 */
export async function getPosts(databaseId?: string): Promise<Post[]> {
  const token = process.env.NOTION_TOKEN

  if (!token || !databaseId) {
    return MOCK_POSTS
  }

  try {
    const notion = new Client({ auth: token })

    // Notion SDK v5: querying moved from databases → data sources. A database
    // can hold multiple data sources; we query the first one.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const db = (await notion.databases.retrieve({ database_id: databaseId })) as any
    const dataSourceId: string | undefined = db?.data_sources?.[0]?.id
    if (!dataSourceId) {
      console.error('[notion] no data source found for database', databaseId)
      return MOCK_POSTS
    }
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
    })
    /* eslint-enable @typescript-eslint/no-explicit-any */

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const posts: Post[] = (res.results as any[]).map((page) => {
      const p = page.properties ?? {}
      const status = readStatus(p['Status'])
      return {
        id: page.id,
        title: readTitle(p['Post Title']) || readTitle(p['Name']),
        business: readSelect(p['Business']),
        platform: readSelect(p['Platform']),
        pillar: readSelect(p['Pillar']) || readText(p['Pillar']),
        postDate: readDate(p['Post Date']),
        status,
        clientStatus: toClientStatus(status),
        caption: readText(p['Caption']),
        graphicUrl: readUrl(p['Graphic Link']),
        clientApproval: readSelect(p['Client Status']),
      }
    })
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Sort chronologically by post date
    return posts.sort((a, b) => (a.postDate ?? '').localeCompare(b.postDate ?? ''))
  } catch (err) {
    console.error('[notion] fetch failed, falling back to mock data:', err)
    return MOCK_POSTS
  }
}

// ─── Mock data (mirrors the July 2026 FPS content calendar) ─────────────────
// Used until NOTION_TOKEN + NOTION_FPS_DB_ID are configured.

function mock(
  id: string,
  title: string,
  business: string,
  pillar: string,
  postDate: string,
  caption: string,
): Post {
  return {
    id,
    title,
    business,
    platform: 'Instagram + Facebook',
    pillar,
    postDate,
    status: 'Idea',
    clientStatus: 'In Production',
    caption,
    graphicUrl: null,
    clientApproval: '',
  }
}

/**
 * Write the client's approval decision back to their Notion page.
 * Requires a "Client Status" Select property on the database.
 * Best-effort: returns false (and logs) on any failure so callers can still
 * fall back to email notification.
 */
export async function setClientApproval(
  pageId: string,
  status: 'Approved' | 'Changes Requested' | 'Pending',
): Promise<boolean> {
  const token = process.env.NOTION_TOKEN
  if (!token || !pageId) return false
  try {
    const notion = new Client({ auth: token })
    await notion.pages.update({
      page_id: pageId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: { 'Client Status': { select: { name: status } } } as any,
    })
    return true
  } catch (err) {
    console.error('[notion] setClientApproval failed:', err)
    return false
  }
}

export const MOCK_POSTS: Post[] = [
  // ── Commercial Cleaning ──
  mock('c1', '5 signs your office needs a professional clean', 'Commercial Cleaning', 'Value / Educational', '2026-07-06', 'Is your workspace working against you? 🧽 Here are 5 signs it\'s time to call in the pros.'),
  mock('c2', 'Strata & common area cleaning', 'Commercial Cleaning', 'Service Spotlight', '2026-07-08', 'Lobbies, stairwells, car parks — the spaces everyone sees but nobody wants to clean. 🏢'),
  mock('c3', 'Client testimonial feature', 'Commercial Cleaning', 'Social Proof', '2026-07-10', '"Reliable, thorough, and always on time." ⭐⭐⭐⭐⭐'),
  mock('c4', 'How a clean workspace boosts productivity', 'Commercial Cleaning', 'Value / Educational', '2026-07-13', 'A tidy desk = a tidy mind. 🧠 Clean workspaces reduce sick days and boost focus.'),
  mock('c5', 'End-of-lease before & after', 'Commercial Cleaning', 'Before / After', '2026-07-15', 'Swipe to see the transformation 👉 End-of-lease cleans done right.'),
  mock('c6', 'Meet the team — police-checked & insured', 'Commercial Cleaning', 'Team / BTS', '2026-07-17', 'The people behind the shine ✨ Fully insured and police-checked.'),
  mock('c7', 'Office hygiene tips for flu season', 'Commercial Cleaning', 'Value / Educational', '2026-07-20', 'Cold & flu season is here 🤧 High-touch surfaces are hotspots.'),
  mock('c8', 'Medical & gym cleaning', 'Commercial Cleaning', 'Service Spotlight', '2026-07-22', 'Some spaces can\'t afford to cut corners on hygiene. 🏋️'),
  mock('c9', 'Why property managers choose us', 'Commercial Cleaning', 'Social Proof', '2026-07-24', 'Property managers have enough to juggle 🤝 We make cleaning the one thing they never worry about.'),
  mock('c10', 'What\'s included in a commercial clean', 'Commercial Cleaning', 'Value / Educational', '2026-07-27', 'Not all cleans are equal. 📋 Here\'s exactly what\'s included.'),
  mock('c11', 'After-hours office cleaning', 'Commercial Cleaning', 'Service Spotlight', '2026-07-29', 'Your team works 9–5. We work after. 🌙'),
  mock('c12', '5-star review feature', 'Commercial Cleaning', 'Social Proof', '2026-07-31', 'Another happy client, another 5 stars ⭐'),
  // ── NDIS Services ──
  mock('n1', 'Understanding your NDIS plan categories', 'NDIS Services', 'Education', '2026-07-06', 'NDIS plans can feel overwhelming 💙 Core, Capacity Building, Capital — what do they mean?'),
  mock('n2', 'The supports we offer', 'NDIS Services', 'Service Explainer', '2026-07-08', 'Wondering how we can support you? 🤝 From daily living to community access.'),
  mock('n3', 'Participant story', 'NDIS Services', 'Social Proof', '2026-07-10', 'Every journey is unique 💙 How we\'ve supported one of our participants.'),
  mock('n4', 'How NDIS funding works', 'NDIS Services', 'Education', '2026-07-13', 'Where does your NDIS funding actually go? 💰'),
  mock('n5', 'How we help you live independently', 'NDIS Services', 'Participant Value', '2026-07-15', 'Independence looks different for everyone 🌱'),
  mock('n6', 'Meet our support workers', 'NDIS Services', 'Team', '2026-07-17', 'The heart of what we do ❤️ Trained, compassionate, and here for you.'),
  mock('n7', 'Plan management vs self-managed', 'NDIS Services', 'Education', '2026-07-20', 'Plan-managed, self-managed, or agency-managed? 🤔'),
  mock('n8', 'Community access & social support', 'NDIS Services', 'Service Explainer', '2026-07-22', 'Connection matters 🌟 Our community access supports help you get out and stay social.'),
  mock('n9', 'Disability awareness feature', 'NDIS Services', 'Awareness', '2026-07-24', 'Inclusion is everyone\'s responsibility 💙'),
  mock('n10', 'How to get the most from your plan review', 'NDIS Services', 'Education', '2026-07-27', 'Plan review coming up? 📝 Preparation is everything.'),
  mock('n11', 'Personal care & daily living supports', 'NDIS Services', 'Service Explainer', '2026-07-29', 'Dignified, respectful support for everyday life 💙'),
  mock('n12', 'Family testimonial', 'NDIS Services', 'Social Proof', '2026-07-31', '"They treat our son like family." 💙'),
]
