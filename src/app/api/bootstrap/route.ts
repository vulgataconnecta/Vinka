import { NextResponse } from 'next/server'
import { ensureBootstrap } from '@/lib/bootstrap'
import {
  serializeApplication,
  serializeEvent,
  serializeInvoice,
  serializeListing,
  serializeUser,
} from '@/lib/serializers'
import { getSessionUser } from '@/lib/session'
import {
  type DbCategory,
  type DbEventQuote,
  type DbEventType,
  type DbInvoice,
  type DbListing,
  type DbProviderApplication,
  type DbUser,
  getSupabaseAdmin,
} from '@/lib/supabase'

export async function GET() {
  try {
    await ensureBootstrap()
    const sessionUser = await getSessionUser()
    const supabase = getSupabaseAdmin()

    const [
      catRes,
      typeRes,
      listingRes,
      usersRes,
      eventsRes,
      invoicesRes,
      applicationsRes,
    ] = await Promise.all([
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('event_types').select('*').order('name', { ascending: true }),
      supabase.from('listings').select('*').order('createdAt', { ascending: false }),
      sessionUser?.role === 'admin'
        ? supabase.from('users').select('*').order('createdAt', { ascending: false })
        : Promise.resolve({ data: sessionUser ? [sessionUser] : [] }),
      sessionUser
        ? supabase.from('event_quotes').select('*').order('createdAt', { ascending: false })
        : Promise.resolve({ data: [] }),
      sessionUser?.role === 'admin'
        ? supabase.from('invoices').select('*').order('issuedAt', { ascending: false })
        : sessionUser
          ? sessionUser.role === 'client'
            ? supabase
                .from('invoices')
                .select('*')
                .eq('clientId', sessionUser.id)
                .order('issuedAt', { ascending: false })
            : supabase.from('invoices').select('*').order('issuedAt', { ascending: false })
          : Promise.resolve({ data: [] }),
      sessionUser?.role === 'admin'
        ? supabase
            .from('provider_applications')
            .select('*')
            .order('submittedAt', { ascending: false })
        : sessionUser
          ? supabase
              .from('provider_applications')
              .select('*')
              .eq('userId', sessionUser.id)
              .order('submittedAt', { ascending: false })
          : Promise.resolve({ data: [] }),
    ])

    const categories = (catRes.data || []) as DbCategory[]
    const eventTypes = (typeRes.data || []) as DbEventType[]
    const listings = (listingRes.data || []) as DbListing[]
    const users = (usersRes.data || []) as DbUser[]
    const events = (eventsRes.data || []) as DbEventQuote[]
    const invoices = (invoicesRes.data || []) as DbInvoice[]
    const applications = (applicationsRes.data || []) as DbProviderApplication[]

    return NextResponse.json({
      currentUser: sessionUser ? serializeUser(sessionUser) : null,
      categories,
      eventTypes: eventTypes.map((e) => e.name),
      listings: listings.map(serializeListing),
      users: users.map(serializeUser),
      events: events.map(serializeEvent),
      invoices: invoices.map(serializeInvoice),
      applications: applications.map(serializeApplication),
    })
  } catch (err) {
    console.error('GET /api/bootstrap error:', err)
    return NextResponse.json(
      {
        error:
          'Error al conectar con Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.',
      },
      { status: 500 },
    )
  }
}
