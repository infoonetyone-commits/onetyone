// Client portal configuration. Add a new entry per client.
// The portal route /portal/[client] looks the client up by slug.

export interface BusinessConfig {
  name: string
  accent: string // hex — used for the business tag/colour
}

export interface ClientConfig {
  slug: string
  name: string
  tagline: string
  packageName: string
  businesses: BusinessConfig[]
  /** Notion database id, read from env so it never lands in git. */
  notionDatabaseId?: string
  /**
   * Unguessable secret that gates the portal link (?k=...).
   * Generate with `node scripts/new-client.mjs`. Rotate anytime by changing it.
   */
  accessKey: string
  managedBy: string
}

export const CLIENTS: Record<string, ClientConfig> = {
  'faith-property-services': {
    slug: 'faith-property-services',
    name: 'Faith Property Services',
    tagline: 'Commercial Cleaning & NDIS Services',
    packageName: 'Growth Package',
    businesses: [
      { name: 'Commercial Cleaning', accent: '#5A0EA5' },
      { name: 'NDIS Services', accent: '#0EA5A5' },
    ],
    notionDatabaseId: process.env.NOTION_FPS_DB_ID,
    accessKey: 'Fp7sK2mq9XvL4nRw8tdC',
    managedBy: 'OnetyOne',
  },
}

// OnetyOne contact details used by the portal's "Call us" / "Email us" actions.
export const AGENCY = {
  email: 'info.onetyone@gmail.com',
  // Digits only, with country code, e.g. '61412345678'. Empty = hide the Call button.
  phone: '',
}

export function getClient(slug: string): ClientConfig | undefined {
  return CLIENTS[slug]
}

/** Returns the client only if the supplied key matches — the gate. */
export function getClientWithKey(slug: string, key: string | undefined): ClientConfig | undefined {
  const cfg = CLIENTS[slug]
  if (!cfg) return undefined
  if (!key || key !== cfg.accessKey) return undefined
  return cfg
}
