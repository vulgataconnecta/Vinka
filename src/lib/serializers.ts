import type {
  EventBookingItem,
  EventQuote,
  HostProfile,
  InvoiceRecord,
  ListingItem,
  ProviderApplication,
  UserAccount,
  UserRole,
} from '@/types/vinka'
import type {
  DbEventQuote,
  DbInvoice,
  DbListing,
  DbProviderApplication,
  DbUser,
} from './supabase'

function toDateSlice(val: Date | string | null | undefined): string {
  if (!val) return new Date().toISOString().slice(0, 10)
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return String(val).slice(0, 10)
}

export function serializeUser(u: DbUser): UserAccount {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as UserRole,
    phone: u.phone ?? undefined,
    city: u.city ?? undefined,
    status: (u.status as 'active' | 'suspended') || 'active',
    providerStatus: (u.providerStatus as UserAccount['providerStatus']) ?? undefined,
    rejectionReason: u.rejectionReason ?? undefined,
    createdAt: toDateSlice(u.createdAt),
  }
}

export function serializeListing(l: DbListing): ListingItem {
  return {
    id: l.id,
    providerId: l.providerId,
    providerName: l.providerName,
    kind: l.kind as 'espacio' | 'servicio',
    title: l.title,
    category: l.category,
    location: l.location,
    capacity: l.capacity ?? undefined,
    price: l.price,
    priceUnit: l.priceUnit,
    rating: l.rating,
    reviews: l.reviews,
    tag: l.tag,
    description: l.description,
    includedServices: Array.isArray(l.includedServices) ? (l.includedServices as string[]) : [],
    rules: l.rules,
    schedule: l.schedule,
    offersInvoicing: l.offersInvoicing,
    image: l.image,
    gallery: Array.isArray(l.gallery) ? (l.gallery as string[]) : [],
    host: (l.host as HostProfile | null) ?? undefined,
    bookedDates: Array.isArray(l.bookedDates) ? (l.bookedDates as string[]) : [],
    approvalStatus: l.approvalStatus as 'pending' | 'approved' | 'rejected',
    approvalRejectionReason: l.approvalRejectionReason ?? undefined,
    active: l.active,
  }
}

export function serializeEvent(e: DbEventQuote): EventQuote {
  return {
    id: e.id,
    clientId: e.clientId,
    clientName: e.clientName,
    clientEmail: e.clientEmail,
    occasion: e.occasion,
    dateTime: e.dateTime,
    guests: e.guests,
    spaceId: e.spaceId ?? undefined,
    spaceTitle: e.spaceTitle ?? undefined,
    serviceIds: Array.isArray(e.serviceIds) ? (e.serviceIds as string[]) : [],
    serviceTitles: Array.isArray(e.serviceTitles) ? (e.serviceTitles as string[]) : [],
    bookingItems: Array.isArray(e.bookingItems) ? (e.bookingItems as EventBookingItem[]) : [],
    totalAmount: e.totalAmount,
    commissionAmount: e.commissionAmount,
    status: e.status as EventQuote['status'],
    notes: e.notes,
    invoiceRequested: e.invoiceRequested,
    invoiceFolio: e.invoiceFolio ?? undefined,
    createdAt: toDateSlice(e.createdAt),
  }
}

export function serializeInvoice(i: DbInvoice): InvoiceRecord {
  return {
    id: i.id,
    folio: i.folio,
    eventId: i.eventId,
    eventOccasion: i.eventOccasion,
    clientId: i.clientId,
    clientName: i.clientName,
    rfc: i.rfc,
    razonSocial: i.razonSocial,
    usoCfdi: i.usoCfdi,
    providerName: i.providerName,
    subtotal: i.subtotal,
    iva: i.iva,
    total: i.total,
    status: i.status as 'emitida' | 'pendiente',
    issuedAt: toDateSlice(i.issuedAt),
  }
}

export function serializeApplication(a: DbProviderApplication): ProviderApplication {
  return {
    id: a.id,
    userId: a.userId,
    email: a.email,
    offeringType: a.offeringType as 'espacio' | 'servicio',
    subType: a.subType,
    specificDetails: a.specificDetails,
    fullName: a.fullName,
    address: a.address,
    curp: a.curp,
    rfc: a.rfc,
    socialOrWeb: a.socialOrWeb ?? undefined,
    location: a.location,
    businessName: a.businessName,
    businessPermitDoc: a.businessPermitDoc,
    photos: Array.isArray(a.photos) ? (a.photos as string[]) : [],
    categories: Array.isArray(a.categories) ? (a.categories as string[]) : [],
    cost: a.cost,
    costUnit: a.costUnit,
    descriptionAndIncluded: a.descriptionAndIncluded,
    invoicingService: a.invoicingService,
    rules: a.rules,
    signedContractFile: a.signedContractFile,
    scheduleAndAvailability: a.scheduleAndAvailability,
    capacity: a.capacity ?? undefined,
    status: a.status as 'pending' | 'approved' | 'rejected',
    rejectionReason: a.rejectionReason ?? undefined,
    submittedAt: toDateSlice(a.submittedAt),
  }
}
