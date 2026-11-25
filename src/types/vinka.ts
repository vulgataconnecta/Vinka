export type UserRole = 'client' | 'provider' | 'admin'

export type AppRoute =
  | 'landing'
  | 'event-builder'
  | 'client-portal'
  | 'listing-detail'
  | 'provider-onboarding'
  | 'provider-portal'
  | 'admin-portal'

export type ClientTab = 'descubrir' | 'mis-eventos' | 'favoritos' | 'facturacion' | 'mi-cuenta'
export type ProviderTab = 'agendas' | 'crud' | 'facturacion' | 'analytics'
export type AdminTab = 'proveedores' | 'usuarios' | 'eventos' | 'categorias' | 'contabilidad' | 'analytics'

export interface UserAccount {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  city?: string
  status: 'active' | 'suspended'
  createdAt: string
  // Provider specific
  providerStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

export interface CategoryItem {
  id: string
  name: string
  kind: 'espacio' | 'servicio'
  icon: string
  tone: string
  description: string
}

export interface HostProfile {
  name: string
  roleLabel: string
  verified: boolean
  memberSince: string
  responseRate: string
  responseTime: string
  eventsHosted: number
  bio: string
  city: string
  avatarInitials: string
}

export interface ListingItem {
  id: string
  providerId: string
  providerName: string
  kind: 'espacio' | 'servicio'
  title: string
  category: string
  location: string
  capacity?: number
  price: number
  priceUnit: string
  rating: number
  reviews: number
  tag: string
  description: string
  includedServices: string[]
  rules: string
  schedule: string
  offersInvoicing: boolean
  image: string
  gallery?: string[]
  host?: HostProfile
  bookedDates?: string[] // YYYY-MM-DD dates already accepted/occupied
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approvalRejectionReason?: string
  active: boolean
}

export type BookingItemStatus = 'pendiente' | 'aceptado' | 'rechazado' | 'sin_proveedor'

export interface EventBookingItem {
  id: string
  kind: 'espacio' | 'servicio'
  category: string
  listingId?: string
  listingTitle?: string
  providerId?: string
  providerName?: string
  price: number
  status: BookingItemStatus
  rejectionNote?: string
  rejectedListingIds?: string[]
}

export interface EventQuote {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  occasion: string
  dateTime: string // YYYY-MM-DDTHH:mm
  guests: number
  spaceId?: string
  spaceTitle?: string
  serviceIds: string[]
  serviceTitles: string[]
  bookingItems: EventBookingItem[]
  totalAmount: number
  commissionAmount: number
  status: 'cotizado' | 'confirmado' | 'completado' | 'cancelado'
  notes: string
  createdAt: string
  invoiceRequested?: boolean
  invoiceFolio?: string
}

export interface InvoiceRecord {
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
  status: 'emitida' | 'pendiente'
  issuedAt: string
}

export interface ProviderApplication {
  id: string
  userId: string
  email: string
  // Step 1 & 2
  offeringType: 'espacio' | 'servicio'
  subType: string
  specificDetails: string
  // Step 3: Requisitos Usuario
  fullName: string
  address: string
  curp: string
  rfc: string
  socialOrWeb?: string
  // Step 4: Requisitos Servicio/Espacio (11 items)
  location: string
  businessName: string
  businessPermitDoc: string
  photos: string[]
  categories: string[]
  cost: number
  costUnit: string
  descriptionAndIncluded: string
  invoicingService: boolean
  rules: string
  signedContractFile: string
  scheduleAndAvailability: string
  capacity?: number
  // Review state
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  submittedAt: string
}

export interface SearchFilters {
  dateTime: string
  occasion: string
  capacity: string
}

export interface PendingQuoteDraft {
  occasion: string
  dateTime: string
  guests: number
  spaceId?: string
  serviceIds: string[]
  selectedCategories?: string[]
  vibe?: string
  autoAssembled?: boolean
  notes: string
}
