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
  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name,
      kind: body.kind === 'espacio' ? 'espacio' : 'servicio',
      icon: String(body.icon || 'sparkle'),
      tone: String(body.tone || '#efe7de'),
      description: String(body.description || ''),
    })
    .select('*')
    .single()

  if (error || !category) {
    return NextResponse.json({ error: 'No se pudo crear la categoría.' }, { status: 500 })
  }

  return NextResponse.json({ category }, { status: 201 })
}
