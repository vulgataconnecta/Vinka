import { NextResponse } from 'next/server'
import { serializeEvent } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbEventQuote, type DbListing, getSupabaseAdmin } from '@/lib/supabase'
import type { EventBookingItem } from '@/types/vinka'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Debes iniciar sesión para cotizar.' }, { status: 401 })
  }

  const body = await req.json()
  const dateTime = String(body.dateTime || new Date().toISOString().slice(0, 16))
  const dateKey = dateTime.slice(0, 10)
  const spaceId = body.spaceId ? String(body.spaceId) : undefined
  const serviceIds: string[] = Array.isArray(body.serviceIds) ? body.serviceIds : []
  const selectedCategories: string[] = Array.isArray(body.selectedCategories)
    ? body.selectedCategories
    : []

  const supabase = getSupabaseAdmin()
  const targetIds = [...(spaceId ? [spaceId] : []), ...serviceIds]
  let targetListings: DbListing[] = []

  if (targetIds.length > 0) {
    const { data } = await supabase.from('listings').select('*').in('id', targetIds)
    targetListings = (data || []) as DbListing[]
  }

  for (const l of targetListings) {
    const booked = Array.isArray(l.bookedDates) ? (l.bookedDates as string[]) : []
    if (booked.includes(dateKey)) {
      return NextResponse.json(
        { error: `"${l.title}" ya no tiene disponible esa fecha. Elige otra fecha o proveedor.` },
        { status: 409 },
      )
    }
  }

  const space = spaceId ? targetListings.find((l) => l.id === spaceId) : undefined
  const selectedServices = targetListings.filter((l) => serviceIds.includes(l.id))
  const bookingItems: EventBookingItem[] = []

  if (space) {
    bookingItems.push({
      id: `bi-sp-${Date.now()}`,
      kind: 'espacio',
      category: space.category,
      listingId: space.id,
      listingTitle: space.title,
      providerId: space.providerId,
      providerName: space.providerName,
      price: space.price,
      status: 'pendiente',
      rejectedListingIds: [],
    })
  }

  selectedServices.forEach((sv, idx) => {
    bookingItems.push({
      id: `bi-sv-${Date.now()}-${idx}`,
      kind: 'servicio',
      category: sv.category,
      listingId: sv.id,
      listingTitle: sv.title,
      providerId: sv.providerId,
      providerName: sv.providerName,
      price: sv.price,
      status: 'pendiente',
      rejectedListingIds: [],
    })
  })

  const covered = new Set(selectedServices.map((s) => s.category))
  selectedCategories.forEach((catName, idx) => {
    if (!covered.has(catName)) {
      bookingItems.push({
        id: `bi-cat-${Date.now()}-${idx}`,
        kind: 'servicio',
        category: catName,
        price: 0,
        status: 'sin_proveedor',
        rejectedListingIds: [],
      })
    }
  })

  const totalAmount = bookingItems.reduce((sum, i) => sum + i.price, 0)
  const commissionAmount = Math.round(totalAmount * 0.1)

  const { data: created, error } = await supabase
    .from('event_quotes')
    .insert({
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      occasion: String(body.occasion || 'Celebración en Vinka'),
      dateTime,
      guests: Number(body.guests || 80),
      spaceId: space?.id ?? null,
      spaceTitle: space?.title ?? null,
      serviceIds: selectedServices.map((s) => s.id),
      serviceTitles: selectedServices.map((s) => s.title),
      bookingItems,
      totalAmount,
      commissionAmount,
      status: 'cotizado',
      notes: String(body.notes || ''),
    })
    .select('*')
    .single()

  if (error || !created) {
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Error al registrar la cotización.' }, { status: 500 })
  }

  return NextResponse.json({ event: serializeEvent(created as DbEventQuote) }, { status: 201 })
}
