import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuthorised(request: Request): boolean {
  const auth = request.headers.get('x-admin-password')
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return auth === expected
}

export async function GET(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const { data, error } = await supabase
    .from('deals')
    .select(`id, plan_name, price, retail_price, is_active, is_featured, is_member_exclusive, affiliate_url, description, expires_at, cf_product_id, providers ( name, logo_color, logo_text ), categories ( name, slug )`)
    .order('price', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const body = await request.json()
  const { error, data } = await supabase
    .from('deals')
    .insert({
      plan_name: body.plan_name,
      description: body.description,
      price: body.price,
      retail_price: body.retail_price,
      affiliate_url: body.affiliate_url,
      provider_id: body.provider_id,
      category_id: body.category_id,
      data_gb: body.data_gb ?? null,
      expires_at: body.expires_at ?? null,
      is_active: body.is_active ?? true,
      is_featured: body.is_featured ?? false,
      is_member_exclusive: body.is_member_exclusive ?? false,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/')
  return NextResponse.json(data, { status: 201 })
}

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
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabase.from('deals').update({ is_active: false }).eq('id', id)
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
