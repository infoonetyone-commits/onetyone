import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientWithKey } from '../../lib/clients'
import { getPosts } from '../../lib/notion'
import PortalView from './PortalView'

// Per-request (the access key is in the query string) — no static caching of the gate.
export const dynamic = 'force-dynamic'
// Still revalidate the Notion data every 5 minutes via the fetch layer.
export const revalidate = 300

// Always private — never index any portal URL, key or no key.
export const metadata: Metadata = {
  title: 'Client Hub · OnetyOne',
  robots: { index: false, follow: false },
}

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ client: string }>
  searchParams: Promise<{ k?: string }>
}) {
  const { client } = await params
  const { k } = await searchParams

  // Wrong or missing key → indistinguishable from a non-existent page.
  const cfg = getClientWithKey(client, k)
  if (!cfg) notFound()

  const posts = await getPosts(cfg.notionDatabaseId)

  return <PortalView config={cfg} posts={posts} />
}
