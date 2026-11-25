'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type {
  AdminTab,
  AppRoute,
  CategoryItem,
  ClientTab,
  EventQuote,
  InvoiceRecord,
  ListingItem,
  PendingQuoteDraft,
  ProviderApplication,
  ProviderTab,
  SearchFilters,
  UserAccount,
  UserRole,
} from '@/types/vinka'

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

  loadingData: boolean
  refreshData: () => Promise<void>

  currentUser: UserAccount | null
  authModalOpen: boolean
  authModalIntent: 'general' | 'quote-checkout' | 'provider'
  openAuthModal: (intent?: 'general' | 'quote-checkout' | 'provider') => void
  closeAuthModal: () => void
  loginWithCredentials: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  registerAccount: (data: {
    name: string
    email: string
    password: string
    role: Exclude<UserRole, 'admin'>
    city?: string
  }) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserAccount>) => Promise<void>

  searchFilters: SearchFilters
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>
  favorites: string[]
  toggleFavorite: (listingId: string) => void

  users: UserAccount[]
  toggleUserStatus: (userId: string) => Promise<void>

  categories: CategoryItem[]
  addCategory: (cat: Omit<CategoryItem, 'id'>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  eventTypes: string[]
  addEventType: (name: string) => Promise<void>
  deleteEventType: (name: string) => Promise<void>

  listings: ListingItem[]
  isListingAvailableOnDate: (listingId: string, dateTime?: string) => boolean
  addListing: (item: Omit<ListingItem, 'id' | 'rating' | 'reviews'>) => Promise<void>
  updateListing: (id: string, patch: Partial<ListingItem>) => Promise<void>
  deleteListing: (id: string) => Promise<void>
  approveListing: (id: string) => Promise<void>
  rejectListing: (id: string, reason: string) => Promise<void>

  events: EventQuote[]
  pendingQuoteDraft: PendingQuoteDraft | null
  setPendingQuoteDraft: React.Dispatch<React.SetStateAction<PendingQuoteDraft | null>>
  submitEventQuote: (draft: PendingQuoteDraft) => Promise<{
    ok: boolean
    needsAuth?: boolean
    quote?: EventQuote
  }>
  updateEventStatus: (eventId: string, status: EventQuote['status']) => Promise<void>
  cancelEvent: (eventId: string) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  respondToBookingItem: (
    eventId: string,
    itemId: string,
    decision: 'aceptado' | 'rechazado',
    note?: string,
  ) => Promise<void>
  replaceBookingItem: (eventId: string, itemId: string, newListingId: string) => Promise<void>

  invoices: InvoiceRecord[]
  requestInvoice: (params: {
    eventId: string
    rfc: string
    razonSocial: string
    usoCfdi: string
  }) => Promise<InvoiceRecord | null>

  applications: ProviderApplication[]
  submitProviderApplication: (
    app: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>,
  ) => Promise<void>
  approveApplication: (appId: string) => Promise<void>
  rejectApplication: (appId: string, reason: string) => Promise<void>

  toast: string | null
  showToast: (msg: string) => void
}

const VinkaContext = createContext<VinkaContextValue | null>(null)

const FAVORITES_KEY = 'vinka_favorites_v2'

export function VinkaProvider({ children }: { children: React.ReactNode }) {
  const [route, setRouteRaw] = useState<AppRoute>('landing')
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)
  const [listingReturnRoute, setListingReturnRoute] = useState<AppRoute>('client-portal')
  const [clientTab, setClientTab] = useState<ClientTab>('descubrir')
  const [providerTab, setProviderTab] = useState<ProviderTab>('agendas')
  const [adminTab, setAdminTab] = useState<AdminTab>('proveedores')

  const [loadingData, setLoadingData] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [users, setUsers] = useState<UserAccount[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [listings, setListings] = useState<ListingItem[]>([])
  const [events, setEvents] = useState<EventQuote[]>([])
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [applications, setApplications] = useState<ProviderApplication[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

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

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev))
    }, 3800)
  }, [])

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setCurrentUser(data.currentUser ?? null)
      setCategories(data.categories ?? [])
      setEventTypes(data.eventTypes ?? [])
      setListings(data.listings ?? [])
      setUsers(data.users ?? [])
      setEvents(data.events ?? [])
      setInvoices(data.invoices ?? [])
      setApplications(data.applications ?? [])
    } catch {
      // ignore network error during initial hydration
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    void refreshData()
    try {
      const rawFav = localStorage.getItem(FAVORITES_KEY)
      if (rawFav) setFavorites(JSON.parse(rawFav))
    } catch {
      // ignore
    }
  }, [refreshData])

  const openAuthModal = (intent: 'general' | 'quote-checkout' | 'provider' = 'general') => {
    setAuthModalIntent(intent)
    setAuthModalOpen(true)
  }
  const closeAuthModal = () => setAuthModalOpen(false)

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

  const loginWithCredentials = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'Error al iniciar sesión.' }
    await refreshData()
    setAuthModalOpen(false)
    showToast(`Bienvenido, ${data.user.name}`)
    navigateAfterAuth(data.user, authModalIntent)
    return { ok: true }
  }

  const registerAccount = async (payload: {
    name: string
    email: string
    password: string
    role: Exclude<UserRole, 'admin'>
    city?: string
  }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'No se pudo crear la cuenta.' }
    await refreshData()
    setAuthModalOpen(false)
    showToast(`Cuenta creada para ${data.user.name}`)
    navigateAfterAuth(data.user, authModalIntent)
    return { ok: true }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    setRouteRaw('landing')
    await refreshData()
    showToast('Has cerrado sesión.')
  }

  const updateProfile = async (patch: Partial<UserAccount>) => {
    if (!currentUser) return
    const res = await fetch(`/api/users/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      await refreshData()
      showToast('Perfil actualizado correctamente.')
    }
  }

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const toggleUserStatus = async (userId: string) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleStatus' }),
    })
    if (res.ok) await refreshData()
  }

  const addCategory = async (cat: Omit<CategoryItem, 'id'>) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    })
    if (res.ok) {
      await refreshData()
      showToast(`Categoría "${cat.name}" agregada.`)
    }
  }

  const deleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      await refreshData()
      showToast('Categoría eliminada.')
    }
  }

  const addEventType = async (name: string) => {
    const res = await fetch('/api/event-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      await refreshData()
      showToast(`Tipo de evento "${name}" agregado.`)
    }
  }

  const deleteEventType = async (name: string) => {
    const res = await fetch('/api/event-types', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) await refreshData()
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

  const addListing = async (item: Omit<ListingItem, 'id' | 'rating' | 'reviews'>) => {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    const data = await res.json()
    if (!res.ok) {
      showToast(data.error || 'No se pudo publicar.')
      return
    }
    await refreshData()
    showToast(`"${item.title}" enviado a revisión del administrador para su publicación.`)
  }

  const updateListing = async (id: string, patch: Partial<ListingItem>) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      await refreshData()
      showToast('Publicación actualizada.')
    }
  }

  const deleteListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      await refreshData()
      showToast('Publicación eliminada.')
    }
  }

  const approveListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Espacio / servicio aprobado y publicado en el catálogo.')
    }
  }

  const rejectListing = async (id: string, reason: string) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', reason }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Publicación declinada. Se notificó al proveedor.')
    }
  }

  const submitEventQuote = async (draft: PendingQuoteDraft) => {
    if (!currentUser) {
      setPendingQuoteDraft(draft)
      openAuthModal('quote-checkout')
      return { ok: false, needsAuth: true }
    }
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const data = await res.json()
    if (!res.ok) {
      showToast(data.error || 'No se pudo crear el evento.')
      return { ok: false }
    }
    setPendingQuoteDraft(null)
    await refreshData()
    showToast('¡Evento creado! Enviamos tu solicitud a cada proveedor seleccionado.')
    return { ok: true, quote: data.event as EventQuote }
  }

  const updateEventStatus = async (eventId: string, status: EventQuote['status']) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      await refreshData()
      showToast(`Estado del evento actualizado a "${status}".`)
    }
  }

  const cancelEvent = async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Evento cancelado. Las fechas reservadas han sido liberadas.')
    }
  }

  const deleteEvent = async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
    if (res.ok) {
      await refreshData()
      showToast('Evento eliminado de tu calendario.')
    }
  }

  const respondToBookingItem = async (
    eventId: string,
    itemId: string,
    decision: 'aceptado' | 'rechazado',
    note?: string,
  ) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'respondItem', itemId, decision, note }),
    })
    if (res.ok) {
      await refreshData()
      showToast(
        decision === 'aceptado'
          ? 'Has aceptado tu participación y la fecha quedó bloqueada.'
          : 'Evento rechazado. Se notificará al cliente con nuevas recomendaciones.',
      )
    }
  }

  const replaceBookingItem = async (eventId: string, itemId: string, newListingId: string) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'replaceItem', itemId, newListingId }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Solicitud enviada al nuevo proveedor recomendado.')
    }
  }

  const requestInvoice = async (params: {
    eventId: string
    rfc: string
    razonSocial: string
    usoCfdi: string
  }) => {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) return null
    const data = await res.json()
    await refreshData()
    showToast(`Factura ${data.invoice.folio} generada correctamente.`)
    return data.invoice as InvoiceRecord
  }

  const submitProviderApplication = async (
    app: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>,
  ) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    })
    if (res.ok) {
      await refreshData()
      showToast('Solicitud enviada a revisión por el equipo Vinka.')
    }
  }

  const approveApplication = async (appId: string) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Proveedor autorizado y publicado.')
    }
  }

  const rejectApplication = async (appId: string, reason: string) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', reason }),
    })
    if (res.ok) {
      await refreshData()
      showToast('Solicitud rechazada. Notificación enviada al proveedor.')
    }
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
        loadingData,
        refreshData,
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
