import { NextResponse } from 'next/server'
import { serializeEvent } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbEventQuote, type DbListing, getSupabaseAdmin } from '@/lib/supabase'
import type { EventBookingItem } from '@/types/vinka'

async function releaseEventDates(eventId: string, dateKey: string, items: EventBookingItem[]) {
  const listingIds = items.map((i) => i.listingId).filter((id): id is string => Boolean(id))
  if (!listingIds.length || !dateKey) return

  const supabase = getSupabaseAdmin()
  const { data: otherRows } = await supabase
    .from('event_quotes')
    .select('*')
    .neq('id', eventId)
    .neq('status', 'cancelado')
    .like('dateTime', `${dateKey}%`)

  const otherEvents = (otherRows || []) as DbEventQuote[]

  for (const listingId of listingIds) {
    const stillBooked = otherEvents.some((ev) => {
      const bItems = Array.isArray(ev.bookingItems)
        ? (ev.bookingItems as unknown as EventBookingItem[])
        : []
      return bItems.some((i) => i.listingId === listingId && i.status === 'aceptado')
    })
    if (stillBooked) continue

    const { data: listingRow } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .maybeSingle()

    const listing = listingRow as DbListing | null
    if (!listing) continue
    const currentDates = Array.isArray(listing.bookedDates) ? (listing.bookedDates as string[]) : []
    if (currentDates.includes(dateKey)) {
      await supabase
        .from('listings')
        .update({ bookedDates: currentDates.filter((d) => d !== dateKey) })
        .eq('id', listingId)
    }
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const { id } = await context.params
  const supabase = getSupabaseAdmin()

  const { data: existingRow } = await supabase
    .from('event_quotes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const existing = existingRow as DbEventQuote | null
  if (!existing) return NextResponse.json({ error: 'Evento no encontrado.' }, { status: 404 })

  const body = await req.json()
  const items: EventBookingItem[] = Array.isArray(existing.bookingItems)
    ? (existing.bookingItems as unknown as EventBookingItem[])
    : []
  const dateKey = existing.dateTime.slice(0, 10)

  // 1. Cancel event
  if (body.action === 'cancel') {
    if (user.role !== 'admin' && existing.clientId !== user.id) {
      return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
    }
    await releaseEventDates(existing.id, dateKey, items)
    const { data: updated } = await supabase
      .from('event_quotes')
      .update({ status: 'cancelado' })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ event: serializeEvent((updated || existing) as DbEventQuote) })
  }

  // 2. Provider accept/reject booking item
  if (body.action === 'respondItem') {
    const itemId = String(body.itemId || '')
    const decision = body.decision === 'aceptado' ? 'aceptado' : 'rechazado'
    const note = body.note ? String(body.note) : undefined

    const targetItem = items.find((i) => i.id === itemId)
    if (!targetItem) return NextResponse.json({ error: 'Elemento no encontrado.' }, { status: 404 })
    if (user.role !== 'admin' && targetItem.providerId !== user.id) {
      return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
    }

    if (decision === 'aceptado' && targetItem.listingId && dateKey) {
      const { data: listingRow } = await supabase
        .from('listings')
        .select('*')
        .eq('id', targetItem.listingId)
        .maybeSingle()

      const listing = listingRow as DbListing | null
      if (listing) {
        const currentDates = Array.isArray(listing.bookedDates)
          ? (listing.bookedDates as string[])
          : []
        if (!currentDates.includes(dateKey)) {
          await supabase
            .from('listings')
            .update({ bookedDates: [...currentDates, dateKey] })
            .eq('id', listing.id)
        }
      }
    }

    const updatedItems = items.map((item) => {
      if (item.id !== itemId) return item
      const rejectedIds =
        decision === 'rechazado' && item.listingId
          ? Array.from(new Set([...(item.rejectedListingIds ?? []), item.listingId]))
          : (item.rejectedListingIds ?? [])
      return {
        ...item,
        status: decision,
        rejectionNote: decision === 'rechazado' ? note : undefined,
        rejectedListingIds: rejectedIds,
      }
    })

    const allAccepted = updatedItems.length > 0 && updatedItems.every((i) => i.status === 'aceptado')
    const { data: updated } = await supabase
      .from('event_quotes')
      .update({
        bookingItems: updatedItems,
        status: allAccepted
          ? 'confirmado'
          : existing.status === 'completado'
            ? 'completado'
            : 'cotizado',
      })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ event: serializeEvent((updated || existing) as DbEventQuote) })
  }

  // 3. Client replace rejected/unassigned item with recommended listing
  if (body.action === 'replaceItem') {
    if (user.role !== 'admin' && existing.clientId !== user.id) {
      return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
    }
    const itemId = String(body.itemId || '')
    const { data: newListingRow } = await supabase
      .from('listings')
      .select('*')
      .eq('id', String(body.newListingId || ''))
      .maybeSingle()

    const newListing = newListingRow as DbListing | null
    if (!newListing) return NextResponse.json({ error: 'Proveedor no encontrado.' }, { status: 404 })

    const updatedItems: EventBookingItem[] = items.map((item) => {
      if (item.id !== itemId) return item
      return {
        ...item,
        listingId: newListing.id,
        listingTitle: newListing.title,
        providerId: newListing.providerId,
        providerName: newListing.providerName,
        price: newListing.price,
        status: 'pendiente',
        rejectionNote: undefined,
      }
    })

    const spaceItem = updatedItems.find((i) => i.kind === 'espacio')
    const serviceItems = updatedItems.filter((i) => i.kind === 'servicio' && i.listingId)
    const totalAmount = updatedItems.reduce((sum, i) => sum + i.price, 0)

    const { data: updated } = await supabase
      .from('event_quotes')
      .update({
        bookingItems: updatedItems,
        spaceId: spaceItem?.listingId ?? null,
        spaceTitle: spaceItem?.listingTitle ?? null,
        serviceIds: serviceItems.map((i) => i.listingId!).filter(Boolean),
        serviceTitles: serviceItems.map((i) => i.listingTitle!).filter(Boolean),
        totalAmount,
        commissionAmount: Math.round(totalAmount * 0.1),
      })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ event: serializeEvent((updated || existing) as DbEventQuote) })
  }

  // 4. Admin update event status
  if (body.status) {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
    }
    if (body.status === 'cancelado') {
      await releaseEventDates(existing.id, dateKey, items)
    }
    const { data: updated } = await supabase
      .from('event_quotes')
      .update({ status: String(body.status) })
      .eq('id', id)
      .select('*')
      .single()

    return NextResponse.json({ event: serializeEvent((updated || existing) as DbEventQuote) })
  }

  return NextResponse.json({ error: 'Acción no reconocida.' }, { status: 400 })
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const { id } = await context.params
  const supabase = getSupabaseAdmin()

  const { data: existingRow } = await supabase
    .from('event_quotes')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const existing = existingRow as DbEventQuote | null
  if (!existing) return NextResponse.json({ error: 'No encontrado.' }, { status: 404 })
  if (user.role !== 'admin' && existing.clientId !== user.id) {
    return NextResponse.json({ error: 'Sin permisos.' }, { status: 403 })
  }

  const items: EventBookingItem[] = Array.isArray(existing.bookingItems)
    ? (existing.bookingItems as unknown as EventBookingItem[])
    : []
  await releaseEventDates(existing.id, existing.dateTime.slice(0, 10), items)
  await supabase.from('event_quotes').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
