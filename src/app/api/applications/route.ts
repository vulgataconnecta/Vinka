import { NextResponse } from 'next/server'
import { serializeApplication } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbProviderApplication, getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user || user.role !== 'provider') {
    return NextResponse.json(
      { error: 'Debes iniciar sesión con una cuenta de Proveedor.' },
      { status: 403 },
    )
  }

  const body = await req.json()
  const supabase = getSupabaseAdmin()

  const payload = {
    userId: user.id,
    email: user.email,
    offeringType: body.offeringType === 'espacio' ? 'espacio' : 'servicio',
    subType: String(body.subType || ''),
    specificDetails: String(body.specificDetails || ''),
    fullName: String(body.fullName || user.name),
    address: String(body.address || ''),
    curp: String(body.curp || '').toUpperCase(),
    rfc: String(body.rfc || '').toUpperCase(),
    socialOrWeb: body.socialOrWeb ? String(body.socialOrWeb) : null,
    location: String(body.location || ''),
    businessName: String(body.businessName || ''),
    businessPermitDoc: String(body.businessPermitDoc || ''),
    photos: Array.isArray(body.photos) ? body.photos : [],
    categories: Array.isArray(body.categories) ? body.categories : [],
    cost: Number(body.cost || 0),
    costUnit: String(body.costUnit || 'por evento'),
    descriptionAndIncluded: String(body.descriptionAndIncluded || ''),
    invoicingService: Boolean(body.invoicingService),
    rules: String(body.rules || ''),
    signedContractFile: String(body.signedContractFile || ''),
    scheduleAndAvailability: String(body.scheduleAndAvailability || ''),
    capacity: body.capacity ? Number(body.capacity) : null,
    status: 'pending',
    rejectionReason: null,
    submittedAt: new Date().toISOString(),
  }

  const { data: app, error } = await supabase
    .from('provider_applications')
    .upsert(payload, { onConflict: 'userId' })
    .select('*')
    .single()

  if (error || !app) {
    console.error('POST /api/applications error:', error)
    return NextResponse.json(
      { error: 'Error al guardar la solicitud de proveedor.' },
      { status: 500 },
    )
  }

  await supabase
    .from('users')
    .update({ providerStatus: 'pending', rejectionReason: null })
    .eq('id', user.id)

  return NextResponse.json(
    { application: serializeApplication(app as DbProviderApplication) },
    { status: 201 },
  )
}
