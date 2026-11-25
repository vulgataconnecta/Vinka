import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
  }
  const { id } = await context.params
  const supabase = getSupabaseAdmin()
  await supabase.from('categories').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
