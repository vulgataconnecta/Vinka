import { NextResponse } from 'next/server'
import { serializeUser } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbUser, getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await req.json()
  const supabase = getSupabaseAdmin()

  // Admin toggling status
  if (body.action === 'toggleStatus') {
    if (sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
    }
    const { data: targetRow } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    const target = targetRow as DbUser | null
    if (!target || target.role === 'admin') {
      return NextResponse.json({ error: 'Operación no permitida.' }, { status: 400 })
    }

    const { data: updated } = await supabase
      .from('users')
      .update({ status: target.status === 'active' ? 'suspended' : 'active' })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ user: serializeUser((updated || target) as DbUser) })
  }

  // User updating own profile
  if (sessionUser.id !== id && sessionUser.role !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
  }

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = String(body.name).trim()
  if (body.phone !== undefined) updateData.phone = String(body.phone).trim()
  if (body.city !== undefined) updateData.city = String(body.city).trim()

  const { data: updated } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single()

  return NextResponse.json({ user: serializeUser((updated || sessionUser) as DbUser) })
}
