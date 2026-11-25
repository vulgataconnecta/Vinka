import { NextResponse } from 'next/server'
import { serializeApplication, serializeListing } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import {
  type DbListing,
  type DbProviderApplication,
  getSupabaseAdmin,
} from '@/lib/supabase'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Solo administradores.' }, { status: 403 })
  }

  const { id } = await context.params
  const supabase = getSupabaseAdmin()

  const { data: existingApp } = await supabase
    .from('provider_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const app = existingApp as DbProviderApplication | null
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 })

  const body = await req.json()

  if (body.action === 'approve') {
    const { data: updatedApp } = await supabase
      .from('provider_applications')
      .update({ status: 'approved', rejectionReason: null })
      .eq('id', id)
      .select('*')
      .single()

    await supabase
      .from('users')
      .update({ role: 'provider', providerStatus: 'approved', rejectionReason: null })
      .eq('id', app.userId)

    const photos = Array.isArray(app.photos) ? (app.photos as string[]) : []
    const cats = Array.isArray(app.categories) ? (app.categories as string[]) : []

    const { data: createdListing } = await supabase
      .from('listings')
      .insert({
        providerId: app.userId,
        providerName: app.businessName,
        kind: app.offeringType,
        title: app.businessName,
        category: cats[0] || (app.offeringType === 'espacio' ? 'Fincas y Terrazas' : 'Decoración'),
        location: app.location,
        capacity: app.capacity,
        price: app.cost || 0,
        priceUnit: app.costUnit || 'por evento',
        tag: 'Verificado',
        description: app.descriptionAndIncluded,
        includedServices: [app.specificDetails || 'Atención personalizada'],
        rules: app.rules,
        schedule: app.scheduleAndAvailability,
        offersInvoicing: app.invoicingService,
        image: photos[0] || '',
        gallery: photos,
        host: {
          name: app.fullName,
          roleLabel: `Anfitrión Verificado · ${app.businessName}`,
          verified: true,
          memberSince: new Date().getFullYear().toString(),
          responseRate: '100%',
          responseTime: 'Menos de 1 hora',
          eventsHosted: 0,
          bio: app.descriptionAndIncluded || 'Anfitrión verificado por el equipo de Vinka.',
          city: app.location,
          avatarInitials: app.fullName
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase(),
        },
        bookedDates: [],
        approvalStatus: 'approved',
        active: true,
      })
      .select('*')
      .single()

    return NextResponse.json({
      application: serializeApplication((updatedApp || app) as DbProviderApplication),
      listing: serializeListing(createdListing as DbListing),
    })
  }

  if (body.action === 'reject') {
    const reason = String(body.reason || 'Documentación incompleta.')
    const { data: updatedApp } = await supabase
      .from('provider_applications')
      .update({ status: 'rejected', rejectionReason: reason })
      .eq('id', id)
      .select('*')
      .single()

    await supabase
      .from('users')
      .update({ providerStatus: 'rejected', rejectionReason: reason })
      .eq('id', app.userId)

    return NextResponse.json({
      application: serializeApplication((updatedApp || app) as DbProviderApplication),
    })
  }

  return NextResponse.json({ error: 'Acción inválida.' }, { status: 400 })
}
