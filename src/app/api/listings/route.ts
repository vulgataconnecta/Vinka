import { NextResponse } from 'next/server'
import { serializeListing } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbListing, getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user || user.role !== 'provider' || user.providerStatus !== 'approved') {
    return NextResponse.json(
      {
        error:
          'Solo los proveedores dados de alta y autorizados pueden publicar espacios o servicios.',
      },
      { status: 403 },
    )
  }

  const body = await req.json()
  const supabase = getSupabaseAdmin()
  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString()

  const { data: created, error } = await supabase
    .from('listings')
    .insert({
      providerId: user.id,
      providerName: user.name,
      kind: body.kind === 'espacio' ? 'espacio' : 'servicio',
      title: String(body.title || '').trim(),
      category: String(body.category || 'Decoración'),
      location: String(body.location || ''),
      capacity: body.kind === 'espacio' && body.capacity ? Number(body.capacity) : null,
      price: Number(body.price || 0),
      priceUnit: String(body.priceUnit || 'por evento'),
      tag: String(body.tag || 'Disponible'),
      description: String(body.description || ''),
      includedServices: Array.isArray(body.includedServices) ? body.includedServices : [],
      rules: String(body.rules || ''),
      schedule: String(body.schedule || ''),
      offersInvoicing: Boolean(body.offersInvoicing),
      image: String(body.image || ''),
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      host: {
        name: user.name,
        roleLabel: `Anfitrión Verificado · ${user.name}`,
        verified: true,
        memberSince: memberYear,
        responseRate: '100%',
        responseTime: 'Menos de 1 hora',
        eventsHosted: 0,
        bio: String(body.description || 'Anfitrión verificado en Vinka.'),
        city: String(body.location || user.city || ''),
        avatarInitials: user.name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
      },
      bookedDates: [],
      approvalStatus: 'pending',
      active: false,
    })
    .select('*')
    .single()

  if (error || !created) {
    console.error('POST /api/listings error:', error)
    return NextResponse.json({ error: 'Error al crear la publicación.' }, { status: 500 })
  }

  return NextResponse.json({ listing: serializeListing(created as DbListing) }, { status: 201 })
}
