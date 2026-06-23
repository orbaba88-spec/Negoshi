// lib/cf-datafeed.ts
// Parses Commission Factory XML product datafeeds into Negoshi deal objects.
// CF datafeed URL format (find yours in CF dashboard → Merchants → Datafeeds):
// https://datafeed.commissionfactory.com/feed/[AFFILIATE_ID]/xml?key=[API_KEY]

export type CFDeal = {
  cf_product_id: string
  plan_name: string
  description: string
  price: number
  retail_price: number
  affiliate_url: string
  provider_name: string
  category_slug: 'mobile' | 'internet'
  data_gb: number | null
  expires_at: string | null
}

// Maps CF merchant names to our provider slugs
const PROVIDER_MAP: Record<string, { name: string; logo_color: string; logo_text: string }> = {
  'Telstra':           { name: 'Telstra',           logo_color: '#0057B8', logo_text: 'TEL' },
  'Optus':             { name: 'Optus',             logo_color: '#FF6B00', logo_text: 'OPT' },
  'Vodafone':          { name: 'Vodafone',          logo_color: '#E60028', logo_text: 'VOD' },
  'Aussie Broadband':  { name: 'Aussie Broadband',  logo_color: '#1B4332', logo_text: 'ABB' },
  'Superloop':         { name: 'Superloop',         logo_color: '#8B1CF5', logo_text: 'SLP' },
  'Boost Mobile':      { name: 'Boost Mobile',      logo_color: '#FF3300', logo_text: 'BST' },
  'ALDImobile':        { name: 'ALDImobile',        logo_color: '#00539B', logo_text: 'ALD' },
  'TPG':               { name: 'TPG',               logo_color: '#D4222A', logo_text: 'TPG' },
  'iiNet':             { name: 'iiNet',             logo_color: '#FF6600', logo_text: 'IIN' },
}

// Detect category from CF product category or product name
function detectCategory(cfCategory: string, productName: string): 'mobile' | 'internet' {
  const combined = `${cfCategory} ${productName}`.toLowerCase()
  if (combined.includes('nbn') || combined.includes('broadband') || combined.includes('internet') || combined.includes('fibre')) {
    return 'internet'
  }
  return 'mobile'
}

// Extract data GB from product name e.g. "30GB Plan" → 30
function extractDataGb(productName: string): number | null {
  const match = productName.match(/(\d+)\s*GB/i)
  return match ? parseInt(match[1]) : null
}

// Parse CF XML datafeed string into CFDeal[]
export function parseCFDatafeed(xmlString: string): CFDeal[] {
  const deals: CFDeal[] = []

  // Simple regex-based XML parsing (avoids needing a DOM parser in Edge Runtime)
  // CF XML structure: <product> ... </product> blocks
  const productBlocks = xmlString.match(/<product>[\s\S]*?<\/product>/g) ?? []

  for (const block of productBlocks) {
    const get = (tag: string) => {
      const match = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>`))
      return (match?.[1] ?? match?.[2] ?? '').trim()
    }

    const merchant   = get('merchant_name') || get('brand')
    const name       = get('name') || get('product_name')
    const price      = parseFloat(get('price') || get('sale_price') || '0')
    const rrp        = parseFloat(get('rrp') || get('retail_price') || get('original_price') || '0')
    const trackUrl   = get('tracking_url') || get('buy_url') || get('affiliate_link')
    const productId  = get('id') || get('product_id') || get('sku')
    const desc       = get('description') || get('short_description')
    const expiry     = get('expiry_date') || get('end_date') || null

    // Skip incomplete records
    if (!name || !trackUrl || price <= 0) continue

    const provider = PROVIDER_MAP[merchant] ?? null
    if (!provider) continue // Skip merchants we don't support yet

    const category = detectCategory(get('category'), name)
    const retailPrice = rrp > price ? rrp : price * 1.4 // Estimate retail if not provided

    deals.push({
      cf_product_id: productId,
      plan_name:     name,
      description:   desc || `${name} — available through Negoshi`,
      price:         Math.round(price * 100) / 100,
      retail_price:  Math.round(retailPrice * 100) / 100,
      affiliate_url: trackUrl,
      provider_name: provider.name,
      category_slug: category,
      data_gb:       extractDataGb(name),
      expires_at:    expiry ? new Date(expiry).toISOString() : null,
    })
  }

  return deals
}

export { PROVIDER_MAP }
