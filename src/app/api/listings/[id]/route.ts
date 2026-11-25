import { NextResponse } from 'next/server'
import { serializeListing } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbListing, getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const { id } = await context.params
  const supabase = getSupabaseAdmin()

  const { data: existingRow } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const existing = existingRow as DbListing | null
  if (!existing) return NextResponse.json({ error: 'Publicación no encontrada.' }, { status: 404 })

  const body = await req.json()

  // Admin approve / reject
  if (body.action === 'approve') {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
    }
    const { data: updated } = await supabase
      .from('listings')
      .update({ approvalStatus: 'approved', approvalRejectionReason: null, active: true })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ listing: serializeListing((updated || existing) as DbListing) })
  }

  if (body.action === 'reject') {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
    }
    const { data: updated } = await supabase
      .from('listings')
      .update({
        approvalStatus: 'rejected',
        approvalRejectionReason: String(body.reason || 'Requiere ajustes.'),
        active: false,
      })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ listing: serializeListing((updated || existing) as DbListing) })
  }

  // Provider edit / pause
  if (user.role !== 'admin' && existing.providerId !== user.id) {
    return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
  }

  const canChangeActive = existing.approvalStatus === 'approved' || user.role === 'admin'
  const updateData: Record<string, unknown> = {}

  if (body.kind !== undefined) updateData.kind = body.kind
  if (body.title !== undefined) updateData.title = body.title
  if (body.category !== undefined) updateData.category = body.category
  if (body.location !== undefined) updateData.location = body.location
  if (body.capacity !== undefined) {
    updateData.capacity = body.capacity ? Number(body.capacity) : null
  }
  if (body.price !== undefined) updateData.price = Number(body.price)
  if (body.priceUnit !== undefined) updateData.priceUnit = body.priceUnit
  if (body.description !== undefined) updateData.description = body.description
  if (body.includedServices !== undefined) updateData.includedServices = body.includedServices
  if (body.rules !== undefined) updateData.rules = body.rules
  if (body.schedule !== undefined) updateData.schedule = body.schedule
  if (body.offersInvoicing !== undefined) updateData.offersInvoicing = body.offersInvoicing
  if (body.image !== undefined) updateData.image = body.image
  if (body.gallery !== undefined) updateData.gallery = body.gallery

  if (body.approvalStatus === 'pending' && existing.approvalStatus === 'rejected') {
    updateData.approvalStatus = 'pending'
    updateData.approvalRejectionReason = null
  }

  if (body.active !== undefined && canChangeActive) {
    updateData.active = Boolean(body.active)
  }

  const { data: updated } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single()

  return NextResponse.json({ listing: serializeListing((updated || existing) as DbListing) })
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const { id } = await context.params
  const supabase = getSupabaseAdmin()

  const { data: existingRow } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const existing = existingRow as DbListing | null
  if (!existing) return NextResponse.json({ error: 'No encontrado.' }, { status: 404 })
  if (user.role !== 'admin' && existing.providerId !== user.id) {
    return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
  }

  await supabase.from('listings').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
