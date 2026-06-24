#!/usr/bin/env node
// Scaffold a new client portal entry.
// Usage:  node scripts/new-client.mjs "Kraft Cafe" "kraft-cafe"
//         node scripts/new-client.mjs "Kraft Cafe"          (slug auto-derived)

import { randomBytes } from 'node:crypto'

const name = process.argv[2]
if (!name) {
  console.error('Usage: node scripts/new-client.mjs "Client Name" [slug]')
  process.exit(1)
}

const slug =
  process.argv[3] ??
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// 20-char URL-safe secret
const key = randomBytes(15).toString('base64url').slice(0, 20)
const envVar = `NOTION_${slug.toUpperCase().replace(/-/g, '_')}_DB_ID`

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  New client: ${name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1) Add this block to CLIENTS in app/lib/clients.ts:

  '${slug}': {
    slug: '${slug}',
    name: '${name}',
    tagline: 'TODO — short tagline',
    packageName: 'Growth Package',
    businesses: [
      { name: '${name}', accent: '#5A0EA5' },
    ],
    notionDatabaseId: process.env.${envVar},
    accessKey: '${key}',
    managedBy: 'OnetyOne',
  },

2) Add to .env.local (and to Vercel env):

  ${envVar}=<their Notion database id>

3) Share their Notion database with the "OnetyOne Portal" integration.

4) Their private link to send:

  https://www.onetyone.com.au/portal/${slug}?k=${key}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
