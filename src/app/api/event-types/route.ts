import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
  }
  const body = await req.json()
  const name = String(body.name || '').trim()
  if (!name) return NextResponse.json({ error: 'Nombre requerido.' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  await supabase.from('event_types').upsert({ name }, { onConflict: 'name' })
  return NextResponse.json({ name }, { status: 201 })
}

export async function DELETE(req: Request) {
  const user = await getSessionUser()
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
  }
  const body = await req.json()
  const name = String(body.name || '').trim()
  if (!name) return NextResponse.json({ error: 'Nombre requerido.' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  await supabase.from('event_types').delete().eq('name', name)
  return NextResponse.json({ ok: true })
}
