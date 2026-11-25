import { NextResponse } from 'next/server'
import { serializeInvoice } from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import { type DbEventQuote, type DbInvoice, getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const body = await req.json()
  const supabase = getSupabaseAdmin()

  const { data: evtRow } = await supabase
    .from('event_quotes')
    .select('*')
    .eq('id', String(body.eventId || ''))
    .maybeSingle()

  const evt = evtRow as DbEventQuote | null
  if (!evt) return NextResponse.json({ error: 'Evento no encontrado.' }, { status: 404 })

  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })

  const folio = `VNK-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`
  const subtotal = Number((evt.totalAmount / 1.16).toFixed(2))
  const iva = Number((evt.totalAmount - subtotal).toFixed(2))
  const serviceTitles = Array.isArray(evt.serviceTitles) ? (evt.serviceTitles as string[]) : []

  const { data: created, error } = await supabase
    .from('invoices')
    .insert({
      folio,
      eventId: evt.id,
      eventOccasion: evt.occasion,
      clientId: evt.clientId,
      clientName: evt.clientName,
      rfc: String(body.rfc || '').toUpperCase(),
      razonSocial: String(body.razonSocial || '').toUpperCase(),
      usoCfdi: String(body.usoCfdi || 'G03 - Gastos en general'),
      providerName: evt.spaceTitle || serviceTitles[0] || 'Vinka Servicios',
      subtotal,
      iva,
      total: evt.totalAmount,
      status: 'emitida',
    })
    .select('*')
    .single()

  if (error || !created) {
    console.error('POST /api/invoices error:', error)
    return NextResponse.json({ error: 'Error al emitir la factura.' }, { status: 500 })
  }

  await supabase
    .from('event_quotes')
    .update({ invoiceRequested: true, invoiceFolio: folio })
    .eq('id', evt.id)

  return NextResponse.json({ invoice: serializeInvoice(created as DbInvoice) }, { status: 201 })
}
