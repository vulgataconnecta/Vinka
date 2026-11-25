import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface DbUser {
  id: string
  name: string
  email: string
  passwordHash: string
  role: string
  phone: string | null
  city: string | null
  status: string
  providerStatus: string | null
  rejectionReason: string | null
  createdAt: string | Date
}

export interface DbCategory {
  id: string
  name: string
  kind: string
  icon: string
  tone: string
  description: string
}

export interface DbEventType {
  id: string
  name: string
}

export interface DbListing {
  id: string
  providerId: string
  providerName: string
  kind: string
  title: string
  category: string
  location: string
  capacity: number | null
  price: number
  priceUnit: string
  rating: number
  reviews: number
  tag: string
  description: string
  includedServices: unknown
  rules: string
  schedule: string
  offersInvoicing: boolean
  image: string
  gallery: unknown
  host: unknown
  bookedDates: unknown
  approvalStatus: string
  approvalRejectionReason: string | null
  active: boolean
  createdAt: string | Date
}

export interface DbEventQuote {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  occasion: string
  dateTime: string
  guests: number
  spaceId: string | null
  spaceTitle: string | null
  serviceIds: unknown
  serviceTitles: unknown
  bookingItems: unknown
  totalAmount: number
  commissionAmount: number
  status: string
  notes: string
  invoiceRequested: boolean
  invoiceFolio: string | null
  createdAt: string | Date
}

export interface DbInvoice {
  id: string
  folio: string
  eventId: string
  eventOccasion: string
  clientId: string
  clientName: string
  rfc: string
  razonSocial: string
  usoCfdi: string
  providerName: string
  subtotal: number
  iva: number
  total: number
  status: string
  issuedAt: string | Date
}

export interface DbProviderApplication {
  id: string
  userId: string
  email: string
  offeringType: string
  subType: string
  specificDetails: string
  fullName: string
  address: string
  curp: string
  rfc: string
  socialOrWeb: string | null
  location: string
  businessName: string
  businessPermitDoc: string
  photos: unknown
  categories: unknown
  cost: number
  costUnit: string
  descriptionAndIncluded: string
  invoicingService: boolean
  rules: string
  signedContractFile: string
  scheduleAndAvailability: string
  capacity: number | null
  status: string
  rejectionReason: string | null
  submittedAt: string | Date
}

let cachedAdminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).',
    )
  }

  cachedAdminClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedAdminClient
}
