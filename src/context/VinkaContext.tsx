import React, { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_ADMIN_USER, DEFAULT_CATEGORIES, DEFAULT_EVENT_TYPES } from '../data/defaults'
import type {
  AdminTab,
  AppRoute,
  CategoryItem,
  ClientTab,
  EventBookingItem,
  EventQuote,
  InvoiceRecord,
  ListingItem,
  PendingQuoteDraft,
  ProviderApplication,
  ProviderTab,
  SearchFilters,
  UserAccount,
  UserRole,
} from '../types/vinka'

interface VinkaContextValue {
  route: AppRoute
  setRoute: (r: AppRoute) => void
  selectedListingId: string | null
  listingReturnRoute: AppRoute
  openListingDetail: (listingId: string, fromRoute?: AppRoute) => void
  clientTab: ClientTab
  setClientTab: (t: ClientTab) => void
  providerTab: ProviderTab
  setProviderTab: (t: ProviderTab) => void
  adminTab: AdminTab
  setAdminTab: (t: AdminTab) => void

  currentUser: UserAccount | null
  authModalOpen: boolean
  authModalIntent: 'general' | 'quote-checkout' | 'provider'
  openAuthModal: (intent?: 'general' | 'quote-checkout' | 'provider') => void
  closeAuthModal: () => void
  loginWithCredentials: (email: string, password: string) => { ok: boolean; error?: string }
  registerAccount: (data: {
    name: string
    email: string
    password: string
    role: Exclude<UserRole, 'admin'>
    city?: string
  }) => { ok: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<UserAccount>) => void

  searchFilters: SearchFilters
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>
  favorites: string[]
  toggleFavorite: (listingId: string) => void

  users: UserAccount[]
  toggleUserStatus: (userId: string) => void

  categories: CategoryItem[]
  addCategory: (cat: Omit<CategoryItem, 'id'>) => void
  deleteCategory: (id: string) => void
  eventTypes: string[]
  addEventType: (name: string) => void
  deleteEventType: (name: string) => void

  listings: ListingItem[]
  isListingAvailableOnDate: (listingId: string, dateTime?: string) => boolean
  addListing: (item: Omit<ListingItem, 'id' | 'rating' | 'reviews'>) => void
  updateListing: (id: string, patch: Partial<ListingItem>) => void
  deleteListing: (id: string) => void
  approveListing: (id: string) => void
  rejectListing: (id: string, reason: string) => void

  events: EventQuote[]
  pendingQuoteDraft: PendingQuoteDraft | null
  setPendingQuoteDraft: React.Dispatch<React.SetStateAction<PendingQuoteDraft | null>>
  submitEventQuote: (draft: PendingQuoteDraft) => {
    ok: boolean
    needsAuth?: boolean
    quote?: EventQuote
  }
  updateEventStatus: (eventId: string, status: EventQuote['status']) => void
  cancelEvent: (eventId: string) => void
  deleteEvent: (eventId: string) => void
  respondToBookingItem: (
    eventId: string,
    itemId: string,
    decision: 'aceptado' | 'rechazado',
    note?: string,
  ) => void
  replaceBookingItem: (eventId: string, itemId: string, newListingId: string) => void

  invoices: InvoiceRecord[]
  requestInvoice: (params: {
    eventId: string
    rfc: string
    razonSocial: string
    usoCfdi: string
  }) => InvoiceRecord | null

  applications: ProviderApplication[]
  submitProviderApplication: (app: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>) => void
  approveApplication: (appId: string) => void
  rejectApplication: (appId: string, reason: string) => void

  toast: string | null
  showToast: (msg: string) => void
}

const VinkaContext = createContext<VinkaContextValue | null>(null)

const STORAGE_KEY = 'vinka_prod_state_v1'

function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed[key] !== undefined ? parsed[key] : fallback
  } catch {
    return fallback
  }
}

function ensureAdminPresent(list: UserAccount[]): UserAccount[] {
  const hasAdmin = list.some(
    (u) => u.email.toLowerCase() === DEFAULT_ADMIN_USER.email.toLowerCase(),
  )
  return hasAdmin ? list : [DEFAULT_ADMIN_USER, ...list]
}

export function VinkaProvider({ children }: { children: React.ReactNode }) {
  const [route, setRouteRaw] = useState<AppRoute>('landing')
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)
  const [listingReturnRoute, setListingReturnRoute] = useState<AppRoute>('client-portal')
  const [clientTab, setClientTab] = useState<ClientTab>('descubrir')
  const [providerTab, setProviderTab] = useState<ProviderTab>('agendas')
  const [adminTab, setAdminTab] = useState<AdminTab>('proveedores')

  const [users, setUsers] = useState<UserAccount[]>(() =>
    ensureAdminPresent(loadSaved<UserAccount[]>('users', [DEFAULT_ADMIN_USER])),
  )
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadSaved<string | null>('currentUserId', null),
  )
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    loadSaved<CategoryItem[]>('categories', DEFAULT_CATEGORIES),
  )
  const [eventTypes, setEventTypes] = useState<string[]>(() =>
    loadSaved<string[]>('eventTypes', DEFAULT_EVENT_TYPES),
  )
  const [listings, setListings] = useState<ListingItem[]>(() =>
    loadSaved<ListingItem[]>('listings', []),
  )
  const [events, setEvents] = useState<EventQuote[]>(() => loadSaved<EventQuote[]>('events', []))
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() =>
    loadSaved<InvoiceRecord[]>('invoices', []),
  )
  const [applications, setApplications] = useState<ProviderApplication[]>(() =>
    loadSaved<ProviderApplication[]>('applications', []),
  )
  const [favorites, setFavorites] = useState<string[]>(() => loadSaved<string[]>('favorites', []))

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    dateTime: '',
    occasion: '',
    capacity: '',
  })
  const [pendingQuoteDraft, setPendingQuoteDraft] = useState<PendingQuoteDraft | null>(null)

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalIntent, setAuthModalIntent] = useState<'general' | 'quote-checkout' | 'provider'>(
    'general',
  )
  const [toast, setToast] = useState<string | null>(null)

  const currentUser = users.find((u) => u.id === currentUserId) ?? null

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users,
          currentUserId,
          categories,
          eventTypes,
          listings,
          events,
          invoices,
          applications,
          favorites,
        }),
      )
    } catch {
      // ignore storage quota errors
    }
  }, [users, currentUserId, categories, eventTypes, listings, events, invoices, applications, favorites])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev))
    }, 3800)
  }

  const setRoute = (next: AppRoute) => {
    if (next === 'admin-portal' && currentUser?.role !== 'admin') {
      showToast('Acceso restringido al administrador.')
      openAuthModal('general')
      return
    }
    if (
      next === 'provider-portal' &&
      !(currentUser?.role === 'provider' && currentUser.providerStatus === 'approved')
    ) {
      showToast('Debes darte de alta y estar autorizado como proveedor para publicar espacios.')
      setRouteRaw('provider-onboarding')
      return
    }
    setRouteRaw(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openListingDetail = (listingId: string, fromRoute: AppRoute = 'client-portal') => {
    setSelectedListingId(listingId)
    setListingReturnRoute(fromRoute)
    setRouteRaw('listing-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAuthModal = (intent: 'general' | 'quote-checkout' | 'provider' = 'general') => {
    setAuthModalIntent(intent)
    setAuthModalOpen(true)
  }
  const closeAuthModal = () => setAuthModalOpen(false)

  const navigateAfterAuth = (
    user: UserAccount,
    intent: 'general' | 'quote-checkout' | 'provider',
  ) => {
    if (intent === 'quote-checkout') {
      setRouteRaw('event-builder')
      return
    }
    if (intent === 'provider' && user.role === 'provider') {
      setRouteRaw(user.providerStatus === 'approved' ? 'provider-portal' : 'provider-onboarding')
      return
    }
    if (user.role === 'admin') {
      setRouteRaw('admin-portal')
    } else if (user.role === 'provider') {
      setRouteRaw(user.providerStatus === 'approved' ? 'provider-portal' : 'provider-onboarding')
    } else {
      setClientTab('descubrir')
      setRouteRaw('client-portal')
    }
  }

  const loginWithCredentials = (email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    const found = users.find((u) => u.email.toLowerCase() === normalized)
    if (!found) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }
    if (found.status === 'suspended') {
      return { ok: false, error: 'Esta cuenta se encuentra suspendida.' }
    }
    if (found.password !== password) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }
    setCurrentUserId(found.id)
    setAuthModalOpen(false)
    showToast(`Bienvenido, ${found.name}`)
    navigateAfterAuth(found, authModalIntent)
    return { ok: true }
  }

  const registerAccount = (data: {
    name: string
    email: string
    password: string
    role: Exclude<UserRole, 'admin'>
    city?: string
  }) => {
    const normalized = data.email.trim().toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con este correo.' }
    }
    if (data.password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
    }
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: normalized,
      password: data.password,
      role: data.role,
      city: data.city?.trim() || '',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      providerStatus: data.role === 'provider' ? 'none' : undefined,
    }
    setUsers((prev) => [newUser, ...prev])
    setCurrentUserId(newUser.id)
    setAuthModalOpen(false)
    showToast(`Cuenta creada para ${newUser.name}`)
    navigateAfterAuth(newUser, authModalIntent)
    return { ok: true }
  }

  const logout = () => {
    setCurrentUserId(null)
    setRouteRaw('landing')
    showToast('Has cerrado sesión.')
  }

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!currentUser) return
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u)))
    showToast('Perfil actualizado correctamente.')
  }

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId],
    )
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId && u.role !== 'admin'
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u,
      ),
    )
  }

  const addCategory = (cat: Omit<CategoryItem, 'id'>) => {
    setCategories((prev) => [...prev, { ...cat, id: `cat-${Date.now()}` }])
    showToast(`Categoría "${cat.name}" agregada.`)
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    showToast('Categoría eliminada.')
  }

  const addEventType = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || eventTypes.includes(trimmed)) return
    setEventTypes((prev) => [...prev, trimmed])
    showToast(`Tipo de evento "${trimmed}" agregado.`)
  }

  const deleteEventType = (name: string) => {
    setEventTypes((prev) => prev.filter((e) => e !== name))
  }

  const isListingAvailableOnDate = (listingId: string, dateTime?: string) => {
    if (!dateTime) return true
    const dateKey = dateTime.slice(0, 10)
    if (!dateKey) return true
    const listing = listings.find((l) => l.id === listingId)
    if (listing?.bookedDates?.includes(dateKey)) return false
    const hasAcceptedBooking = events.some(
      (ev) =>
        ev.status !== 'cancelado' &&
        ev.dateTime.slice(0, 10) === dateKey &&
        (ev.bookingItems ?? []).some(
          (item) => item.listingId === listingId && item.status === 'aceptado',
        ),
    )
    return !hasAcceptedBooking
  }

  const createListingRecord = (item: Omit<ListingItem, 'id' | 'rating' | 'reviews'>) => {
    const created: ListingItem = {
      ...item,
      id: `${item.kind === 'espacio' ? 'sp' : 'sv'}-${Date.now()}`,
      rating: 5.0,
      reviews: 0,
    }
    setListings((prev) => [created, ...prev])
    return created
  }

  const addListing = (item: Omit<ListingItem, 'id' | 'rating' | 'reviews'>) => {
    if (!currentUser || currentUser.role !== 'provider' || currentUser.providerStatus !== 'approved') {
      showToast('Solo los proveedores dados de alta y autorizados pueden publicar espacios o servicios.')
      return
    }
    createListingRecord({
      ...item,
      approvalStatus: 'pending',
      active: false,
    })
    showToast(`"${item.title}" enviado a revisión del administrador para su publicación.`)
  }

  const approveListing = (id: string) => {
    const target = listings.find((l) => l.id === id)
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, approvalStatus: 'approved', approvalRejectionReason: undefined, active: true }
          : l,
      ),
    )
    if (target) showToast(`"${target.title}" aprobado y publicado en el catálogo.`)
  }

  const rejectListing = (id: string, reason: string) => {
    const target = listings.find((l) => l.id === id)
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              approvalStatus: 'rejected',
              approvalRejectionReason: reason,
              active: false,
            }
          : l,
      ),
    )
    if (target) showToast(`"${target.title}" declinado. Se notificó al proveedor.`)
  }

  const updateListing = (id: string, patch: Partial<ListingItem>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
    showToast('Publicación actualizada.')
  }

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    showToast('Publicación eliminada.')
  }

  const submitEventQuote = (draft: PendingQuoteDraft) => {
    if (!currentUser) {
      setPendingQuoteDraft(draft)
      openAuthModal('quote-checkout')
      return { ok: false, needsAuth: true }
    }
    const space = listings.find((l) => l.id === draft.spaceId)
    const selectedServices = listings.filter((l) => draft.serviceIds.includes(l.id))

    if (space && !isListingAvailableOnDate(space.id, draft.dateTime)) {
      showToast(`"${space.title}" ya no tiene disponible esa fecha. Elige otra fecha o espacio.`)
      return { ok: false }
    }
    const unavailableService = selectedServices.find(
      (sv) => !isListingAvailableOnDate(sv.id, draft.dateTime),
    )
    if (unavailableService) {
      showToast(
        `"${unavailableService.title}" ya tiene ocupada esa fecha. Selecciona otro proveedor o fecha.`,
      )
      return { ok: false }
    }
    const bookingItems: EventBookingItem[] = []

    if (space) {
      bookingItems.push({
        id: `bi-sp-${Date.now()}`,
        kind: 'espacio',
        category: space.category,
        listingId: space.id,
        listingTitle: space.title,
        providerId: space.providerId,
        providerName: space.providerName,
        price: space.price,
        status: 'pendiente',
        rejectedListingIds: [],
      })
    }

    selectedServices.forEach((sv, idx) => {
      bookingItems.push({
        id: `bi-sv-${Date.now()}-${idx}`,
        kind: 'servicio',
        category: sv.category,
        listingId: sv.id,
        listingTitle: sv.title,
        providerId: sv.providerId,
        providerName: sv.providerName,
        price: sv.price,
        status: 'pendiente',
        rejectedListingIds: [],
      })
    })

    // Include selected categories that don't have a specific provider chosen yet
    const coveredCategories = new Set(selectedServices.map((s) => s.category))
    ;(draft.selectedCategories ?? []).forEach((catName, idx) => {
      if (!coveredCategories.has(catName)) {
        bookingItems.push({
          id: `bi-cat-${Date.now()}-${idx}`,
          kind: 'servicio',
          category: catName,
          price: 0,
          status: 'sin_proveedor',
          rejectedListingIds: [],
        })
      }
    })

    const totalAmount = bookingItems.reduce((acc, item) => acc + item.price, 0)
    const commissionAmount = Math.round(totalAmount * 0.1)

    const quote: EventQuote = {
      id: `evt-${Date.now()}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      occasion: draft.occasion || 'Celebración en Vinka',
      dateTime: draft.dateTime || new Date().toISOString().slice(0, 16),
      guests: draft.guests || 80,
      spaceId: space?.id,
      spaceTitle: space?.title,
      serviceIds: selectedServices.map((s) => s.id),
      serviceTitles: selectedServices.map((s) => s.title),
      bookingItems,
      totalAmount,
      commissionAmount,
      status: 'cotizado',
      notes: draft.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setEvents((prev) => [quote, ...prev])
    setPendingQuoteDraft(null)
    showToast('¡Evento creado! Enviamos tu solicitud a cada proveedor seleccionado.')
    return { ok: true, quote }
  }

  const releaseDatesForEvent = (targetEvent: EventQuote, remainingEvents: EventQuote[]) => {
    const dateKey = targetEvent.dateTime.slice(0, 10)
    if (!dateKey) return
    const affectedListingIds = new Set(
      (targetEvent.bookingItems ?? [])
        .map((i) => i.listingId)
        .filter((id): id is string => Boolean(id)),
    )
    if (affectedListingIds.size === 0) return

    setListings((prev) =>
      prev.map((l) => {
        if (!affectedListingIds.has(l.id) || !l.bookedDates?.includes(dateKey)) return l
        const stillBookedElsewhere = remainingEvents.some(
          (ev) =>
            ev.id !== targetEvent.id &&
            ev.status !== 'cancelado' &&
            ev.dateTime.slice(0, 10) === dateKey &&
            (ev.bookingItems ?? []).some(
              (item) => item.listingId === l.id && item.status === 'aceptado',
            ),
        )
        if (stillBookedElsewhere) return l
        return {
          ...l,
          bookedDates: l.bookedDates.filter((d) => d !== dateKey),
        }
      }),
    )
  }

  const updateEventStatus = (eventId: string, status: EventQuote['status']) => {
    const target = events.find((e) => e.id === eventId)
    if (status === 'cancelado' && target) {
      releaseDatesForEvent(target, events)
    }
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status } : e)))
    showToast(`Estado del evento actualizado a "${status}".`)
  }

  const cancelEvent = (eventId: string) => {
    const target = events.find((e) => e.id === eventId)
    if (!target) return
    releaseDatesForEvent(target, events)
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: 'cancelado' } : e)))
    showToast('Evento cancelado. Las fechas reservadas han sido liberadas.')
  }

  const deleteEvent = (eventId: string) => {
    const target = events.find((e) => e.id === eventId)
    if (!target) return
    const remaining = events.filter((e) => e.id !== eventId)
    releaseDatesForEvent(target, remaining)
    setEvents(remaining)
    showToast('Evento eliminado de tu calendario.')
  }

  const respondToBookingItem = (
    eventId: string,
    itemId: string,
    decision: 'aceptado' | 'rechazado',
    note?: string,
  ) => {
    const targetEvent = events.find((e) => e.id === eventId)
    const targetItem = targetEvent?.bookingItems?.find((i) => i.id === itemId)
    const dateKey = targetEvent?.dateTime.slice(0, 10)

    if (decision === 'aceptado' && targetItem?.listingId && dateKey) {
      setListings((prev) =>
        prev.map((l) => {
          if (l.id !== targetItem.listingId) return l
          const currentDates = l.bookedDates ?? []
          if (currentDates.includes(dateKey)) return l
          return { ...l, bookedDates: [...currentDates, dateKey] }
        }),
      )
    }

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev
        const updatedItems = (ev.bookingItems ?? []).map((item) => {
          if (item.id !== itemId) return item
          const rejectedIds =
            decision === 'rechazado' && item.listingId
              ? Array.from(new Set([...(item.rejectedListingIds ?? []), item.listingId]))
              : (item.rejectedListingIds ?? [])
          return {
            ...item,
            status: decision,
            rejectionNote: decision === 'rechazado' ? note : undefined,
            rejectedListingIds: rejectedIds,
          }
        })
        const allAccepted =
          updatedItems.length > 0 && updatedItems.every((i) => i.status === 'aceptado')
        return {
          ...ev,
          bookingItems: updatedItems,
          status: allAccepted ? 'confirmado' : ev.status === 'completado' ? 'completado' : 'cotizado',
        }
      }),
    )
    showToast(
      decision === 'aceptado'
        ? 'Has aceptado tu participación en el evento.'
        : 'Evento rechazado. Se notificará al cliente con nuevas recomendaciones.',
    )
  }

  const replaceBookingItem = (eventId: string, itemId: string, newListingId: string) => {
    const replacement = listings.find((l) => l.id === newListingId)
    if (!replacement) return
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev
        const updatedItems = (ev.bookingItems ?? []).map((item) => {
          if (item.id !== itemId) return item
          return {
            ...item,
            listingId: replacement.id,
            listingTitle: replacement.title,
            providerId: replacement.providerId,
            providerName: replacement.providerName,
            price: replacement.price,
            status: 'pendiente' as const,
            rejectionNote: undefined,
          }
        })
        const spaceItem = updatedItems.find((i) => i.kind === 'espacio')
        const serviceItems = updatedItems.filter((i) => i.kind === 'servicio' && i.listingId)
        const totalAmount = updatedItems.reduce((sum, i) => sum + i.price, 0)
        return {
          ...ev,
          bookingItems: updatedItems,
          spaceId: spaceItem?.listingId,
          spaceTitle: spaceItem?.listingTitle,
          serviceIds: serviceItems.map((i) => i.listingId!).filter(Boolean),
          serviceTitles: serviceItems.map((i) => i.listingTitle!).filter(Boolean),
          totalAmount,
          commissionAmount: Math.round(totalAmount * 0.1),
        }
      }),
    )
    showToast(`Solicitud enviada a ${replacement.title}. Esperando confirmación.`)
  }

  const requestInvoice = (params: {
    eventId: string
    rfc: string
    razonSocial: string
    usoCfdi: string
  }) => {
    const evt = events.find((e) => e.id === params.eventId)
    if (!evt) return null
    const folio = `VNK-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`
    const subtotal = Number((evt.totalAmount / 1.16).toFixed(2))
    const iva = Number((evt.totalAmount - subtotal).toFixed(2))
    const inv: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      folio,
      eventId: evt.id,
      eventOccasion: evt.occasion,
      clientId: evt.clientId,
      clientName: evt.clientName,
      rfc: params.rfc.toUpperCase(),
      razonSocial: params.razonSocial.toUpperCase(),
      usoCfdi: params.usoCfdi,
      providerName: evt.spaceTitle || evt.serviceTitles[0] || 'Vinka Servicios',
      subtotal,
      iva,
      total: evt.totalAmount,
      status: 'emitida',
      issuedAt: new Date().toISOString().slice(0, 10),
    }
    setInvoices((prev) => [inv, ...prev])
    setEvents((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, invoiceRequested: true, invoiceFolio: folio } : e)),
    )
    showToast(`Factura ${folio} generada correctamente.`)
    return inv
  }

  const submitProviderApplication = (
    app: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>,
  ) => {
    const newApp: ProviderApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10),
    }
    setApplications((prev) => [newApp, ...prev.filter((a) => a.userId !== app.userId)])
    setUsers((prev) =>
      prev.map((u) =>
        u.id === app.userId ? { ...u, providerStatus: 'pending', rejectionReason: undefined } : u,
      ),
    )
    showToast('Solicitud enviada a revisión por el equipo Vinka.')
  }

  const approveApplication = (appId: string) => {
    const app = applications.find((a) => a.id === appId)
    if (!app) return
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: 'approved', rejectionReason: undefined } : a,
      ),
    )
    setUsers((prev) =>
      prev.map((u) =>
        u.id === app.userId
          ? { ...u, role: 'provider', providerStatus: 'approved', rejectionReason: undefined }
          : u,
      ),
    )
    createListingRecord({
      providerId: app.userId,
      providerName: app.businessName,
      kind: app.offeringType,
      title: app.businessName,
      category:
        app.categories[0] || (app.offeringType === 'espacio' ? 'Fincas y Terrazas' : 'Decoración'),
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
      image: app.photos[0] || '',
      gallery: app.photos,
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
      active: true,
      approvalStatus: 'approved',
    })
    showToast(`Proveedor "${app.businessName}" autorizado y publicado.`)
  }

  const rejectApplication = (appId: string, reason: string) => {
    const app = applications.find((a) => a.id === appId)
    if (!app) return
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected', rejectionReason: reason } : a)),
    )
    setUsers((prev) =>
      prev.map((u) =>
        u.id === app.userId ? { ...u, providerStatus: 'rejected', rejectionReason: reason } : u,
      ),
    )
    showToast(`Solicitud rechazada. Notificación enviada a ${app.email}.`)
  }

  return (
    <VinkaContext.Provider
      value={{
        route,
        setRoute,
        selectedListingId,
        listingReturnRoute,
        openListingDetail,
        clientTab,
        setClientTab,
        providerTab,
        setProviderTab,
        adminTab,
        setAdminTab,
        currentUser,
        authModalOpen,
        authModalIntent,
        openAuthModal,
        closeAuthModal,
        loginWithCredentials,
        registerAccount,
        logout,
        updateProfile,
        searchFilters,
        setSearchFilters,
        favorites,
        toggleFavorite,
        users,
        toggleUserStatus,
        categories,
        addCategory,
        deleteCategory,
        eventTypes,
        addEventType,
        deleteEventType,
        listings,
        isListingAvailableOnDate,
        addListing,
        updateListing,
        deleteListing,
        approveListing,
        rejectListing,
        events,
        pendingQuoteDraft,
        setPendingQuoteDraft,
        submitEventQuote,
        updateEventStatus,
        cancelEvent,
        deleteEvent,
        respondToBookingItem,
        replaceBookingItem,
        invoices,
        requestInvoice,
        applications,
        submitProviderApplication,
        approveApplication,
        rejectApplication,
        toast,
        showToast,
      }}
    >
      {children}
    </VinkaContext.Provider>
  )
}

export function useVinka() {
  const ctx = useContext(VinkaContext)
  if (!ctx) throw new Error('useVinka must be used within VinkaProvider')
  return ctx
}
