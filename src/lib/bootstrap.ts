import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from './supabase'

const DEFAULT_CATEGORIES = [
  {
    name: 'Fincas y Terrazas',
    kind: 'espacio',
    icon: 'garden',
    tone: '#efe7de',
    description: 'Jardines, quintas y terrazas al aire libre.',
  },
  {
    name: 'Fotografía',
    kind: 'servicio',
    icon: 'camera',
    tone: '#efe7de',
    description: 'Cobertura editorial, video y dron.',
  },
  {
    name: 'Banquetes',
    kind: 'servicio',
    icon: 'food',
    tone: '#efe7de',
    description: 'Catering de autor, barras y postres.',
  },
  {
    name: 'Música y DJ',
    kind: 'servicio',
    icon: 'music',
    tone: '#efe7de',
    description: 'DJs, grupos versátiles, audio e iluminación.',
  },
  {
    name: 'Flores',
    kind: 'servicio',
    icon: 'flower',
    tone: '#efe7de',
    description: 'Diseño floral y ambientación botánica.',
  },
  {
    name: 'Decoración',
    kind: 'servicio',
    icon: 'sparkle',
    tone: '#efe7de',
    description: 'Mobiliario lounge, carpas y styling.',
  },
]

const DEFAULT_EVENT_TYPES = [
  'Boda',
  'XV años',
  'Cumpleaños',
  'Bautizo',
  'Primera comunión',
  'Graduación',
  'Reunión familiar',
  'Aniversario',
]

let bootstrapped = false

export async function ensureBootstrap() {
  if (bootstrapped) return

  const supabase = getSupabaseAdmin()
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vinka.club').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'VinkaAdmin2026!'

  const { data: existingAdmin, error: adminErr } = await supabase
    .from('users')
    .select('id')
    .eq('email', adminEmail)
    .maybeSingle()

  if (adminErr) {
    throw adminErr
  }

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await supabase.from('users').insert({
      name: 'Administrador Vinka',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      city: 'México',
      status: 'active',
    })
  }

  const { count: catCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })

  if (!catCount || catCount === 0) {
    await supabase.from('categories').upsert(DEFAULT_CATEGORIES, {
      onConflict: 'name',
      ignoreDuplicates: true,
    })
  }

  const { count: typeCount } = await supabase
    .from('event_types')
    .select('id', { count: 'exact', head: true })

  if (!typeCount || typeCount === 0) {
    await supabase.from('event_types').upsert(
      DEFAULT_EVENT_TYPES.map((name) => ({ name })),
      { onConflict: 'name', ignoreDuplicates: true },
    )
  }

  bootstrapped = true
}
