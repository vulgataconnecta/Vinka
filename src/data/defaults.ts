import type { CategoryItem, UserAccount } from '../types/vinka'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vinka.club'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'VinkaAdmin2026!'

export const DEFAULT_ADMIN_USER: UserAccount = {
  id: 'usr-admin-root',
  name: 'Administrador Vinka',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: 'admin',
  city: 'México',
  status: 'active',
  createdAt: new Date().toISOString().slice(0, 10),
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Fincas y Terrazas',
    kind: 'espacio',
    icon: 'garden',
    tone: '#efe7de',
    description: 'Jardines, quintas y terrazas al aire libre.',
  },
  {
    id: 'cat-2',
    name: 'Fotografía',
    kind: 'servicio',
    icon: 'camera',
    tone: '#efe7de',
    description: 'Cobertura editorial, video y dron.',
  },
  {
    id: 'cat-3',
    name: 'Banquetes',
    kind: 'servicio',
    icon: 'food',
    tone: '#efe7de',
    description: 'Catering de autor, barras y postres.',
  },
  {
    id: 'cat-4',
    name: 'Música y DJ',
    kind: 'servicio',
    icon: 'music',
    tone: '#efe7de',
    description: 'DJs, grupos versátiles, audio e iluminación.',
  },
  {
    id: 'cat-5',
    name: 'Flores',
    kind: 'servicio',
    icon: 'flower',
    tone: '#efe7de',
    description: 'Diseño floral y ambientación botánica.',
  },
  {
    id: 'cat-6',
    name: 'Decoración',
    kind: 'servicio',
    icon: 'sparkle',
    tone: '#efe7de',
    description: 'Mobiliario lounge, carpas y styling.',
  },
]

export const DEFAULT_EVENT_TYPES: string[] = [
  'Boda',
  'XV años',
  'Cumpleaños',
  'Bautizo',
  'Primera comunión',
  'Graduación',
  'Reunión familiar',
  'Aniversario',
]
