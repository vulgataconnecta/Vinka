import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  Compass,
  FileText,
  Heart,
  MapPin,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  User,
  Wand2,
  XCircle,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import type { ClientTab, ListingItem } from '../types/vinka'
import { EventProgressBar } from './EventProgressBar'
import { ListingDetailModal } from './ListingDetailModal'

export function ClientPortal() {
  const {
    clientTab,
    setClientTab,
    currentUser,
    openAuthModal,
    listings,
    isListingAvailableOnDate,
    categories,
    favorites,
    toggleFavorite,
    events,
    invoices,
    requestInvoice,
    updateProfile,
    setPendingQuoteDraft,
    setRoute,
    openListingDetail,
    replaceBookingItem,
    cancelEvent,
    deleteEvent,
  } = useVinka()

  // Descubrir filters
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('Todas')
  const [minCap, setMinCap] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null)

  // Mis eventos filter
  const [historyMode, setHistoryMode] = useState<'proximos' | 'pasados'>('proximos')
  const [confirmAction, setConfirmAction] = useState<{
    eventId: string
    type: 'cancel' | 'delete'
  } | null>(null)

  // Facturación form
  const [invEventId, setInvEventId] = useState('')
  const [rfc, setRfc] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [usoCfdi, setUsoCfdi] = useState('G03 - Gastos en general')

  // Profile form
  const [profName, setProfName] = useState(currentUser?.name || '')
  const [profPhone, setProfPhone] = useState(currentUser?.phone || '')
  const [profCity, setProfCity] = useState(currentUser?.city || '')

  const discoverResults = useMemo(() => {
    return listings
      .filter((l) => l.active)
      .filter((l) => {
        if (catFilter !== 'Todas' && l.category !== catFilter) return false
        if (
          query.trim() &&
          !`${l.title} ${l.location} ${l.category} ${l.description}`
            .toLowerCase()
            .includes(query.toLowerCase())
        ) {
          return false
        }
        if (minCap && l.capacity && l.capacity < Number(minCap)) return false
        if (maxPrice && l.price > Number(maxPrice)) return false
        return true
      })
  }, [listings, catFilter, query, minCap, maxPrice])

  const myEvents = useMemo(() => {
    if (!currentUser) return events
    return events.filter((e) => e.clientId === currentUser.id || currentUser.role === 'admin')
  }, [events, currentUser])

  const todayIso = new Date().toISOString().slice(0, 10)
  const filteredEvents = myEvents.filter((e) => {
    const isPast = e.dateTime.slice(0, 10) < todayIso || e.status === 'completado'
    return historyMode === 'pasados' ? isPast : !isPast
  })

  const favListings = listings.filter((l) => favorites.includes(l.id))
  const myInvoices = currentUser
    ? invoices.filter((i) => i.clientId === currentUser.id || currentUser.role === 'admin')
    : invoices

  const addToBuilder = (item: ListingItem) => {
    setPendingQuoteDraft((prev) => ({
      occasion: prev?.occasion || '',
      dateTime: prev?.dateTime || '2026-12-20T18:00',
      guests: prev?.guests || item.capacity || 100,
      spaceId: item.kind === 'espacio' ? item.id : prev?.spaceId,
      serviceIds:
        item.kind === 'servicio'
          ? Array.from(new Set([...(prev?.serviceIds ?? []), item.id]))
          : (prev?.serviceIds ?? []),
      notes: prev?.notes || '',
    }))
    setRoute('event-builder')
  }

  const tabs: { id: ClientTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'descubrir', label: 'Descubrir', icon: <Compass size={16} /> },
    { id: 'mis-eventos', label: 'Mis eventos', icon: <Calendar size={16} />, badge: myEvents.length },
    { id: 'favoritos', label: 'Favoritos', icon: <Heart size={16} />, badge: favListings.length },
    { id: 'facturacion', label: 'Facturación', icon: <Receipt size={16} /> },
    { id: 'mi-cuenta', label: 'Mi cuenta', icon: <User size={16} /> },
  ]

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee]/60 py-8 px-[5vw]">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow dark">
              <span /> Página de Clientes
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#221610] mt-0.5">
              {currentUser ? `Hola, ${currentUser.name.split(' ')[0]}` : 'Explora Vinka'}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setRoute('event-builder')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#a36b42] hover:bg-[#2d1d16] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm cursor-pointer"
          >
            <Wand2 size={16} /> Arma tu evento
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-7 border-b border-[#decfc2] pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setClientTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                clientTab === t.id
                  ? 'bg-[#2d1d16] text-white shadow-sm'
                  : 'bg-white text-[#221610] border border-[#decfc2] hover:bg-[#f3ece4]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    clientTab === t.id ? 'bg-white/20 text-white' : 'bg-[#f7f3ee] text-[#a36b42]'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: DESCUBRIR + Motor de búsqueda personalizado */}
        {clientTab === 'descubrir' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-[#decfc2] p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-[#7d6558]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar finca, ciudad o servicio..."
                  className="w-full rounded-xl border border-[#decfc2] pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-[#2d1d16]"
                />
              </div>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold outline-none focus:border-[#2d1d16]"
              >
                <option value="Todas">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={minCap}
                onChange={(e) => setMinCap(e.target.value)}
                placeholder="Capacidad mínima (invitados)"
                className="rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold outline-none focus:border-[#2d1d16]"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Presupuesto máx. ($ MXN)"
                className="rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold outline-none focus:border-[#2d1d16]"
              />
            </div>

            {discoverResults.length === 0 ? (
              <div className="rounded-3xl bg-white border border-[#decfc2] p-12 text-center space-y-3">
                <Compass size={34} className="mx-auto text-[#a36b42]" />
                <h3 className="text-lg font-extrabold text-[#221610]">
                  Aún no hay espacios o servicios publicados
                </h3>
                <p className="text-xs text-[#7d6558] max-w-md mx-auto">
                  Cuando los proveedores sean autorizados por Vinka aparecerán aquí automáticamente.
                  También puedes empezar a armar tu evento con lugar propio.
                </p>
                <button
                  type="button"
                  onClick={() => setRoute('event-builder')}
                  className="btn-vinka px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Ir a Arma tu evento
                </button>
              </div>
            ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverResults.map((item) => {
                const isFav = favorites.includes(item.id)
                return (
                  <article
                    key={item.id}
                    onClick={() => openListingDetail(item.id, 'client-portal')}
                    className="rounded-2xl bg-white border border-[#decfc2] overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 bg-[#decfc2]">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      <span className="card-tag">{item.category}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        className={`heart-button ${isFav ? 'saved' : ''}`}
                      >
                        <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-base text-[#221610]">{item.title}</h3>
                          <span className="inline-flex items-center gap-1 text-xs font-bold">
                            <Star size={13} className="text-[#a36b42]" fill="currentColor" />{' '}
                            {item.rating}
                          </span>
                        </div>
                        <p className="text-xs text-[#7d6558] flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-[#a36b42]" /> {item.location}
                        </p>
                        {item.capacity && (
                          <p className="text-[11px] text-[#7d6558] mt-1">
                            Hasta {item.capacity} invitados
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#decfc2] flex items-center justify-between">
                        <div>
                          <span className="text-sm font-extrabold text-[#221610]">
                            ${item.price.toLocaleString('es-MX')}
                          </span>{' '}
                          <span className="text-[11px] text-[#7d6558]">{item.priceUnit}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToBuilder(item)
                          }}
                          className="rounded-lg bg-[#f3ece4] hover:bg-[#2d1d16] text-[#2d1d16] hover:text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            )}
          </div>
        )}

        {/* TAB 2: MIS EVENTOS (Calendario Histórico + Progreso + Recomendaciones) */}
        {clientTab === 'mis-eventos' && (
          <div className="space-y-5">
            {myEvents.some((ev) =>
              (ev.bookingItems ?? []).some((i) => i.status === 'rechazado'),
            ) && (
              <div className="vinka-step-enter rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 space-y-1">
                  <p className="font-extrabold">
                    Un proveedor no pudo aceptar tu fecha — ¡pero tenemos recomendaciones para ti!
                  </p>
                  <p className="text-rose-800">
                    Revisa tus eventos abajo y elige una de las opciones recomendadas por Vinka con
                    un solo clic.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-xl bg-white border border-[#decfc2] p-1">
                <button
                  type="button"
                  onClick={() => setHistoryMode('proximos')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    historyMode === 'proximos' ? 'bg-[#2d1d16] text-white' : 'text-[#7d6558]'
                  }`}
                >
                  Eventos próximos
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryMode('pasados')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    historyMode === 'pasados' ? 'bg-[#2d1d16] text-white' : 'text-[#7d6558]'
                  }`}
                >
                  Eventos pasados (Histórico)
                </button>
              </div>
              <p className="text-xs text-[#7d6558]">
                Mostrando {filteredEvents.length} evento(s) en tu calendario histórico.
              </p>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#decfc2] p-10 text-center space-y-3">
                <Calendar size={32} className="mx-auto text-[#7d6558]" />
                <h3 className="font-extrabold text-[#221610]">
                  No hay eventos {historyMode === 'proximos' ? 'próximos' : 'pasados'} todavía
                </h3>
                <button
                  type="button"
                  onClick={() => setRoute('event-builder')}
                  className="btn-vinka px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Armar mi primer evento
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-5">
                {filteredEvents.map((ev) => {
                  const items = ev.bookingItems ?? []
                  const itemsNeedingChoice = items.filter(
                    (i) => i.status === 'rechazado' || i.status === 'sin_proveedor',
                  )

                  return (
                    <div
                      key={ev.id}
                      className="rounded-3xl bg-white border border-[#decfc2] p-5 flex flex-col justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-[#7d6558]">
                              {ev.dateTime.replace('T', ' · ')} · {ev.guests} invitados
                            </span>
                            <h3 className="text-lg font-extrabold text-[#221610]">{ev.occasion}</h3>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ${
                              ev.status === 'confirmado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.status === 'completado'
                                  ? 'bg-[#f3ece4] text-[#2d1d16]'
                                  : ev.status === 'cancelado'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </div>

                        {/* Animated Progress Bar */}
                        <EventProgressBar items={items} />

                        {/* Rejected / Unassigned items with Vinka Recommendations */}
                        {itemsNeedingChoice.map((item) => {
                          const excluded = new Set(item.rejectedListingIds ?? [])
                          if (item.listingId) excluded.add(item.listingId)
                          const recommendations = listings
                            .filter(
                              (l) =>
                                l.active &&
                                l.kind === item.kind &&
                                l.category === item.category &&
                                !excluded.has(l.id) &&
                                isListingAvailableOnDate(l.id, ev.dateTime),
                            )
                            .sort((a, b) => b.rating - a.rating)
                            .slice(0, 3)

                          return (
                            <div
                              key={item.id}
                              className={`rounded-2xl border p-4 space-y-3 ${
                                item.status === 'rechazado'
                                  ? 'bg-rose-50/70 border-rose-200'
                                  : 'bg-[#f7f3ee] border-[#decfc2]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 text-xs">
                                <div>
                                  <p className="font-extrabold text-[#221610] inline-flex items-center gap-1.5">
                                    {item.status === 'rechazado' ? (
                                      <>
                                        <AlertTriangle size={14} className="text-rose-600" />
                                        {item.listingTitle} no pudo aceptar ({item.category})
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles size={14} className="text-[#a36b42]" />
                                        Elige proveedor para {item.category}
                                      </>
                                    )}
                                  </p>
                                  {item.rejectionNote && (
                                    <p className="text-[11px] text-rose-800 mt-0.5">
                                      Motivo: “{item.rejectionNote}”
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#a36b42] inline-flex items-center gap-1">
                                  <RefreshCw size={12} /> Recomendaciones de Vinka en {item.category}
                                </p>
                                {recommendations.length === 0 ? (
                                  <p className="text-xs text-[#7d6558] bg-white rounded-xl border border-[#decfc2] px-3 py-2">
                                    Aún no hay otros proveedores publicados en{' '}
                                    <strong>{item.category}</strong>. En cuanto se autorice uno
                                    nuevo aparecerá aquí automáticamente.
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {recommendations.map((rec) => (
                                      <div
                                        key={rec.id}
                                        className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#decfc2] p-2.5"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <img
                                            src={rec.image}
                                            alt={rec.title}
                                            className="h-10 w-10 rounded-lg object-cover shrink-0"
                                          />
                                          <div className="min-w-0">
                                            <p className="text-xs font-extrabold text-[#221610] truncate">
                                              {rec.title}
                                            </p>
                                            <p className="text-[11px] text-[#7d6558]">
                                              ★ {rec.rating} · ${rec.price.toLocaleString('es-MX')}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => replaceBookingItem(ev.id, item.id, rec.id)}
                                          className="btn-vinka px-3 py-1.5 text-[11px] font-bold shrink-0 cursor-pointer"
                                        >
                                          Elegir este
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="pt-3 border-t border-[#decfc2] space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-base font-extrabold text-[#a36b42]">
                            ${ev.totalAmount.toLocaleString('es-MX')} MXN
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {ev.invoiceRequested ? (
                              <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                                <FileText size={14} /> Factura {ev.invoiceFolio}
                              </span>
                            ) : (
                              ev.status !== 'cancelado' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvEventId(ev.id)
                                    setClientTab('facturacion')
                                  }}
                                  className="rounded-full border border-[#2d1d16] text-[#2d1d16] hover:bg-[#2d1d16] hover:text-white px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                                >
                                  Solicitar factura
                                </button>
                              )
                            )}

                            {ev.status !== 'cancelado' && ev.status !== 'completado' && (
                              <button
                                type="button"
                                onClick={() => setConfirmAction({ eventId: ev.id, type: 'cancel' })}
                                className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                              >
                                <XCircle size={13} /> Cancelar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setConfirmAction({ eventId: ev.id, type: 'delete' })}
                              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                              aria-label="Eliminar evento"
                            >
                              <Trash2 size={13} /> Borrar
                            </button>
                          </div>
                        </div>

                        {confirmAction?.eventId === ev.id && (
                          <div className="vinka-step-enter rounded-xl bg-rose-50 border border-rose-200 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-rose-900">
                              {confirmAction.type === 'cancel'
                                ? '¿Cancelar este evento? Se liberarán las fechas reservadas.'
                                : '¿Borrar este evento permanentemente de tu calendario?'}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirmAction.type === 'cancel') cancelEvent(ev.id)
                                  else deleteEvent(ev.id)
                                  setConfirmAction(null)
                                }}
                                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 font-bold cursor-pointer"
                              >
                                Sí, {confirmAction.type === 'cancel' ? 'cancelar' : 'borrar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmAction(null)}
                                className="rounded-lg border border-[#decfc2] bg-white px-3 py-1 font-bold text-[#221610] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAVORITOS */}
        {clientTab === 'favoritos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favListings.length === 0 ? (
              <div className="col-span-full rounded-2xl bg-white border border-[#decfc2] p-10 text-center">
                <Heart size={30} className="mx-auto text-[#a36b42] mb-2" />
                <p className="text-sm font-bold text-[#221610]">Aún no tienes favoritos guardados</p>
              </div>
            ) : (
              favListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openListingDetail(item.id, 'client-portal')}
                  className="rounded-2xl bg-white border border-[#decfc2] overflow-hidden cursor-pointer hover:shadow-md transition"
                >
                  <div className="relative h-44">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="heart-button saved"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-extrabold text-[#221610]">{item.title}</h3>
                    <p className="text-xs text-[#7d6558]">{item.location}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#a36b42]">
                        ${item.price.toLocaleString('es-MX')}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToBuilder(item)}
                        className="rounded-lg bg-[#2d1d16] text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                      >
                        Cotizar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PORTAL DE FACTURACIÓN */}
        {clientTab === 'facturacion' && (
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!invEventId || !rfc.trim() || !razonSocial.trim()) return
                requestInvoice({ eventId: invEventId, rfc, razonSocial, usoCfdi })
                setInvEventId('')
                setRfc('')
                setRazonSocial('')
              }}
              className="lg:col-span-2 rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4"
            >
              <div>
                <span className="inline-block rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  Portal de Facturación CFDI 4.0
                </span>
                <h3 className="text-lg font-extrabold text-[#221610] mt-1">Solicitar factura</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">
                  Selecciona tu evento
                </label>
                <select
                  required
                  value={invEventId}
                  onChange={(e) => setInvEventId(e.target.value)}
                  className="w-full rounded-xl border border-[#decfc2] px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#2d1d16]"
                >
                  <option value="">-- Elegir evento sin facturar --</option>
                  {myEvents
                    .filter((e) => !e.invoiceRequested)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.occasion} · ${e.totalAmount.toLocaleString('es-MX')}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">RFC</label>
                <input
                  type="text"
                  required
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  placeholder="XAXX010101000"
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-xs uppercase outline-none focus:border-[#2d1d16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">Razón social</label>
                <input
                  type="text"
                  required
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  placeholder="Nombre o razón social fiscal"
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-xs outline-none focus:border-[#2d1d16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">Uso de CFDI</label>
                <select
                  value={usoCfdi}
                  onChange={(e) => setUsoCfdi(e.target.value)}
                  className="w-full rounded-xl border border-[#decfc2] px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#2d1d16]"
                >
                  <option>G03 - Gastos en general</option>
                  <option>S01 - Sin efectos fiscales</option>
                  <option>CP01 - Pagos</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#2d1d16] hover:bg-[#422d22] text-white font-bold text-xs py-3 cursor-pointer"
              >
                Generar factura fiscal
              </button>
            </form>

            <div className="lg:col-span-3 rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-[#221610]">Historial de facturas</h3>
              <div className="space-y-3">
                {myInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="rounded-xl border border-[#decfc2] p-4 flex flex-wrap items-center justify-between gap-3 bg-[#fdfcfb]"
                  >
                    <div>
                      <span className="text-xs font-extrabold text-[#2d1d16]">{inv.folio}</span>
                      <h4 className="text-sm font-extrabold text-[#221610]">{inv.eventOccasion}</h4>
                      <p className="text-[11px] text-[#7d6558]">
                        RFC: {inv.rfc} · {inv.razonSocial} · {inv.issuedAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#221610]">
                        ${inv.total.toLocaleString('es-MX')} MXN
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        ● {inv.status} (IVA ${inv.iva.toLocaleString('es-MX')})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MI CUENTA */}
        {clientTab === 'mi-cuenta' && (
          <div className="max-w-xl rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4">
            {!currentUser ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm font-bold text-[#221610]">
                  Inicia sesión para gestionar tu perfil y tus datos fiscales.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal('general')}
                  className="rounded-xl bg-[#a36b42] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Iniciar sesión / Crear cuenta
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateProfile({ name: profName, phone: profPhone, city: profCity })
                }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#221610]">Mi cuenta</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full rounded-xl border border-[#decfc2] bg-[#f7f3ee]/50 px-3.5 py-2.5 text-sm text-[#7d6558]"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={profCity}
                      onChange={(e) => setProfCity(e.target.value)}
                      className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2d1d16] hover:bg-[#422d22] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Guardar cambios
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <ListingDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSelectForEvent={addToBuilder}
      />
    </div>
  )
}
