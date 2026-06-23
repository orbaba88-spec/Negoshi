// app/api/admin/deals/route.ts
// Simple admin API — protected by ADMIN_PASSWORD env var

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuthorised(request: Request): boolean {
  const auth = request.headers.get('x-admin-password')
  return auth === process.env.ADMIN_PASSWORD
}

// GET /api/admin/deals — list all deals for admin view
export async function GET(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('deals')
    .select(`
      id, plan_name, price, retail_price, is_active, is_featured,
      is_member_exclusive, affiliate_url, description, expires_at, cf_product_id,
      providers ( name, logo_color, logo_text ),
      categories ( name, slug )
    `)
    .order('is_active', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('price', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/deals — create a new deal
export async function POST(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  const { error, data } = await supabase
    .from('deals')
    .insert({
      plan_name:           body.plan_name,
      description:         body.description,
      price:               body.price,
      retail_price:        body.retail_price,
      affiliate_url:       body.affiliate_url,
      provider_id:         body.provider_id,
      category_id:         body.category_id,
      data_gb:             body.data_gb ?? null,
      expires_at:          body.expires_at ?? null,
      is_active:           body.is_active ?? true,
      is_featured:         body.is_featured ?? false,
      is_member_exclusive: body.is_member_exclusive ?? false,
      cf_product_id:       null, // Manually entered deals have no CF ID
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/deals')
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/admin/deals — update a deal
export async function PATCH(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error, data } = await supabase
    .from('deals')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/deals')
  return NextResponse.json(data)
}

// DELETE /api/admin/deals — soft-delete (set inactive) or hard delete
export async function DELETE(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id   = searchParams.get('id')
  const hard = searchParams.get('hard') === 'true'

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if (hard) {
    await supabase.from('deals').delete().eq('id', id)
  } else {
    await supabase.from('deals').update({ is_active: false }).eq('id', id)
  }

  revalidatePath('/')
  revalidatePath('/deals')
  return NextResponse.json({ ok: true })
}
