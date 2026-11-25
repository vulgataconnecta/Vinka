import { useState } from 'react'
import {
  BarChart3,
  Calendar,
  Check,
  Edit3,
  LayoutGrid,
  PauseCircle,
  PlayCircle,
  Plus,
  Receipt,
  Trash2,
  X,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import type { ListingItem, ProviderTab } from '../types/vinka'
import { PhotoUploader } from './PhotoUploader'

export function ProviderPortal() {
  const {
    providerTab,
    setProviderTab,
    currentUser,
    listings,
    categories,
    events,
    invoices,
    addListing,
    updateListing,
    deleteListing,
    respondToBookingItem,
    setRoute,
  } = useVinka()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<'espacio' | 'servicio'>('espacio')
  const [category, setCategory] = useState(categories[0]?.name || 'Fincas y Terrazas')
  const [location, setLocation] = useState('Monterrey, Nuevo León')
  const [price, setPrice] = useState(25000)
  const [priceUnit, setPriceUnit] = useState('por evento')
  const [capacity, setCapacity] = useState(150)
  const [schedule, setSchedule] = useState('Lunes a Domingo · 09:00 AM a 01:00 AM')
  const [rules, setRules] = useState('Sujeto a disponibilidad de agenda.')
  const [includedText, setIncludedText] = useState('Atención personalizada, Confirmación directa')
  const [offersInvoicing, setOffersInvoicing] = useState(true)
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [rejectingKey, setRejectingKey] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setKind('espacio')
    setCategory(categories[0]?.name || 'Fincas y Terrazas')
    setLocation('Monterrey, Nuevo León')
    setPrice(25000)
    setPriceUnit('por evento')
    setCapacity(150)
    setSchedule('Lunes a Domingo · 09:00 AM a 01:00 AM')
    setRules('Sujeto a disponibilidad de agenda.')
    setIncludedText('Atención personalizada, Confirmación directa')
    setOffersInvoicing(true)
    setDescription('')
    setPhotos([])
    setShowForm(false)
  }

  const openEditForm = (item: ListingItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setKind(item.kind)
    setCategory(item.category)
    setLocation(item.location)
    setPrice(item.price)
    setPriceUnit(item.priceUnit)
    setCapacity(item.capacity || 100)
    setSchedule(item.schedule)
    setRules(item.rules)
    setIncludedText(item.includedServices.join(', '))
    setOffersInvoicing(item.offersInvoicing)
    setDescription(item.description)
    setPhotos(item.gallery?.length ? item.gallery : item.image ? [item.image] : [])
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isApprovedProvider =
    currentUser?.role === 'provider' && currentUser.providerStatus === 'approved'

  if (!isApprovedProvider) {
    return (
      <div className="min-h-[calc(100vh-78px)] bg-[#f7f3ee] py-14 px-4">
        <div className="vinka-modal-card max-w-lg mx-auto rounded-3xl bg-white border border-[#decfc2] p-8 text-center space-y-4 shadow-md">
          <h1 className="text-2xl font-extrabold text-[#1e140f]">
            Acceso exclusivo para proveedores autorizados
          </h1>
          <p className="text-sm text-[#7d6558] leading-relaxed">
            Para publicar un espacio o servicio en Vinka primero debes darte de alta como proveedor
            y contar con la autorización del administrador.
          </p>
          <button
            type="button"
            onClick={() => setRoute('provider-onboarding')}
            className="btn-vinka px-6 py-3 text-xs font-extrabold cursor-pointer"
          >
            Ir al alta de proveedor
          </button>
        </div>
      </div>
    )
  }

  const myListings = listings.filter((l) => l.providerId === currentUser.id)
  const myListingIds = new Set(myListings.map((l) => l.id))
  const myBookings = events.filter(
    (e) =>
      (e.spaceId && myListingIds.has(e.spaceId)) ||
      e.serviceIds.some((id) => myListingIds.has(id)),
  )

  const totalRevenue = myBookings
    .filter((e) => e.status !== 'cancelado')
    .reduce((acc, e) => acc + e.totalAmount, 0)

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const fallbackImg =
      kind === 'espacio'
        ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85'
        : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85'
    const finalGallery = photos.length ? photos : [fallbackImg]
    const parsedIncluded = includedText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingId) {
      const existing = myListings.find((l) => l.id === editingId)
      const wasRejected = existing?.approvalStatus === 'rejected'
      updateListing(editingId, {
        kind,
        title: title.trim(),
        category,
        location: location.trim(),
        capacity: kind === 'espacio' ? capacity : undefined,
        price,
        priceUnit: priceUnit.trim() || (kind === 'espacio' ? 'por evento' : 'paquete base'),
        description: description.trim() || 'Servicio verificado en plataforma Vinka.',
        includedServices: parsedIncluded.length ? parsedIncluded : ['Atención personalizada'],
        rules: rules.trim() || 'Sujeto a disponibilidad de agenda.',
        schedule: schedule.trim() || 'Lunes a Domingo · 09:00 AM a 01:00 AM',
        offersInvoicing,
        image: finalGallery[0],
        gallery: finalGallery,
        ...(wasRejected
          ? { approvalStatus: 'pending' as const, approvalRejectionReason: undefined, active: false }
          : {}),
      })
      resetForm()
      return
    }

    addListing({
      providerId: currentUser.id,
      providerName: currentUser.name,
      kind,
      title: title.trim(),
      category,
      location: location.trim(),
      capacity: kind === 'espacio' ? capacity : undefined,
      price,
      priceUnit: priceUnit.trim() || (kind === 'espacio' ? 'por evento' : 'paquete base'),
      tag: 'Disponible',
      description: description.trim() || 'Servicio verificado en plataforma Vinka.',
      includedServices: parsedIncluded.length ? parsedIncluded : ['Atención personalizada'],
      rules: rules.trim() || 'Sujeto a disponibilidad de agenda.',
      schedule: schedule.trim() || 'Lunes a Domingo · 09:00 AM a 01:00 AM',
      offersInvoicing,
      image: finalGallery[0],
      gallery: finalGallery,
      active: true,
    })
    resetForm()
  }

  const tabs: { id: ProviderTab; label: string; icon: React.ReactNode }[] = [
    { id: 'agendas', label: 'Sistema de agendas', icon: <Calendar size={16} /> },
    { id: 'crud', label: 'Dashboard CRUD', icon: <LayoutGrid size={16} /> },
    { id: 'facturacion', label: 'Portal de facturación', icon: <Receipt size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  ]

  const monthlyBars = [
    { month: 'Jul', val: 38 },
    { month: 'Ago', val: 55 },
    { month: 'Sep', val: 48 },
    { month: 'Oct', val: 74 },
    { month: 'Nov', val: 86 },
    { month: 'Dic', val: 95 },
  ]

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee]/60 py-8 px-[5vw]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow dark">
              <span /> Portal de Negocio · Proveedor Autorizado
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#221610] mt-0.5">
              {currentUser?.name || 'Mi Negocio'}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm()
              setProviderTab('crud')
              setShowForm(true)
            }}
            className="btn-vinka inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold cursor-pointer"
          >
            <Plus size={16} /> Nuevo espacio / servicio
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-7 border-b border-[#decfc2] pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setProviderTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${providerTab === t.id
                  ? 'bg-[#2d1d16] text-white shadow-sm'
                  : 'bg-white text-[#221610] border border-[#decfc2] hover:bg-[#f3ece4]'
                }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SISTEMA DE AGENDAS */}
        {providerTab === 'agendas' && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#221610]">
              Solicitudes de eventos entrantes
            </h2>
            {(() => {
              const requests = events.flatMap((ev) =>
                (ev.bookingItems ?? [])
                  .filter(
                    (item) =>
                      item.providerId === currentUser.id ||
                      (item.listingId && myListingIds.has(item.listingId)),
                  )
                  .map((item) => ({ ev, item })),
              )

              if (requests.length === 0) {
                return (
                  <div className="rounded-2xl bg-white border border-[#decfc2] p-10 text-center text-sm text-[#7d6558]">
                    Aún no tienes solicitudes de eventos en tu agenda. Cuando un cliente elija tu
                    espacio o servicio en <strong>Arma tu evento</strong> aparecerá aquí para
                    aceptar o rechazar.
                  </div>
                )
              }

              return (
                <div className="grid md:grid-cols-2 gap-4">
                  {requests.map(({ ev, item }) => {
                    const reqKey = `${ev.id}-${item.id}`
                    return (
                      <div
                        key={reqKey}
                        className="rounded-2xl bg-white border border-[#decfc2] p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-extrabold text-[#a36b42]">
                              {ev.dateTime.replace('T', ' · ')}
                            </span>
                            <h3 className="text-base font-extrabold text-[#221610]">
                              {ev.occasion}
                            </h3>
                            <p className="text-xs font-bold text-[#422d22] mt-0.5">
                              Servicio solicitado: {item.listingTitle || item.category}
                            </p>
                            <p className="text-xs text-[#7d6558]">
                              Cliente: {ev.clientName} ({ev.clientEmail})
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                              item.status === 'aceptado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'rechazado'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#4e392e]">
                          <strong>Invitados:</strong> {ev.guests} ·{' '}
                          <strong>Tu tarifa:</strong> ${item.price.toLocaleString('es-MX')} MXN
                        </p>
                        {ev.notes && (
                          <p className="text-xs italic text-[#7d6558] bg-[#f7f3ee] rounded-lg px-3 py-2">
                            “{ev.notes}”
                          </p>
                        )}
                        {item.status === 'pendiente' && (
                          <div className="pt-2 border-t border-[#decfc2] space-y-2">
                            {rejectingKey === reqKey ? (
                              <div className="flex flex-wrap gap-2">
                                <input
                                  type="text"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="Motivo breve (ej. Fecha ocupada)..."
                                  className="flex-1 min-w-[180px] rounded-lg border border-rose-300 px-3 py-1.5 text-xs outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    respondToBookingItem(
                                      ev.id,
                                      item.id,
                                      'rechazado',
                                      rejectReason.trim() || 'Fecha no disponible en agenda.',
                                    )
                                    setRejectingKey(null)
                                    setRejectReason('')
                                  }}
                                  className="rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  Confirmar rechazo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingKey(null)}
                                  className="rounded-lg border border-[#decfc2] px-2.5 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => respondToBookingItem(ev.id, item.id, 'aceptado')}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  <Check size={14} /> Aceptar evento
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingKey(reqKey)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  <X size={14} /> No puedo aceptar
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        )}

        {/* TAB 2: DASHBOARD CRUD */}
        {providerTab === 'crud' && (
          <div className="space-y-6">
            {showForm && (
              <form
                onSubmit={handleSaveListing}
                className="vinka-step-enter rounded-3xl bg-white border border-[#decfc2] p-6 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#221610]">
                    {editingId ? 'Editar espacio o servicio' : 'Nueva publicación'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-bold text-[#7d6558] hover:text-[#221610] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nombre del espacio o servicio"
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">Tipo</label>
                    <select
                      value={kind}
                      onChange={(e) => setKind(e.target.value as 'espacio' | 'servicio')}
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    >
                      <option value="espacio">Espacio / Finca</option>
                      <option value="servicio">Servicio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ciudad / Zona"
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Precio ($ MXN)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Unidad de cobro
                    </label>
                    <input
                      type="text"
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      placeholder="por evento / paquete"
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  {kind === 'espacio' && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                        Capacidad máx.
                      </label>
                      <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                      />
                    </div>
                  )}
                  <div className={kind === 'espacio' ? 'sm:col-span-2' : 'sm:col-span-3'}>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Horario y disponibilidad
                    </label>
                    <input
                      type="text"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Servicios incluidos (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={includedText}
                      onChange={(e) => setIncludedText(e.target.value)}
                      placeholder="Estacionamiento, mobiliario, iluminación..."
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                      Reglas del lugar o servicio
                    </label>
                    <input
                      type="text"
                      value={rules}
                      onChange={(e) => setRules(e.target.value)}
                      placeholder="Políticas y horarios límite..."
                      className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7d6558] mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción detallada del espacio o servicio..."
                    className="w-full rounded-xl border border-[#decfc2] px-3 py-2 text-xs"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#221610] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offersInvoicing}
                    onChange={(e) => setOffersInvoicing(e.target.checked)}
                  />
                  Ofrece servicio de facturación CFDI
                </label>
                <PhotoUploader
                  photos={photos}
                  onChange={setPhotos}
                  label={
                    editingId
                      ? 'Actualizar o agregar más fotos (la primera es la portada)'
                      : 'Adjuntar fotos del lugar o servicio'
                  }
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-vinka px-6 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    {editingId ? 'Guardar cambios' : 'Guardar publicación'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#decfc2] px-4 py-2.5 text-xs font-bold text-[#7d6558] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-[#decfc2] overflow-hidden flex flex-col"
                >
                  <div className="relative h-40">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        item.approvalStatus === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : item.approvalStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : item.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.approvalStatus === 'pending'
                        ? 'En revisión Admin'
                        : item.approvalStatus === 'rejected'
                          ? 'Declinado'
                          : item.active
                            ? 'Activo'
                            : 'Pausado'}
                    </span>
                    {item.bookedDates && item.bookedDates.length > 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-[#2d1d16]/90 text-white px-2.5 py-0.5 text-[10px] font-bold">
                        {item.bookedDates.length} fecha(s) ocupada(s)
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#a36b42]">
                        {item.category}
                      </span>
                      <h3 className="font-extrabold text-sm text-[#221610]">{item.title}</h3>
                      <p className="text-xs text-[#7d6558]">{item.location}</p>
                      <p className="text-sm font-extrabold text-[#2d1d16] mt-1">
                        ${item.price.toLocaleString('es-MX')} {item.priceUnit}
                      </p>
                      {item.approvalStatus === 'rejected' && item.approvalRejectionReason && (
                        <p className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-[11px] text-rose-800">
                          <strong>Motivo:</strong> {item.approvalRejectionReason} (Edita para
                          reenviar)
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#decfc2]">
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#f7f3ee] hover:bg-[#efe7de] border border-[#decfc2] py-1.5 text-xs font-bold text-[#221610] cursor-pointer"
                      >
                        <Edit3 size={13} /> {item.approvalStatus === 'rejected' ? 'Corregir' : 'Editar'}
                      </button>
                      <button
                        type="button"
                        disabled={item.approvalStatus === 'pending' || item.approvalStatus === 'rejected'}
                        onClick={() => updateListing(item.id, { active: !item.active })}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-[#decfc2] py-1.5 text-xs font-bold text-[#7d6558] hover:bg-[#f7f3ee] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {item.active ? <PauseCircle size={13} /> : <PlayCircle size={13} />}
                        {item.active ? 'Pausar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteListing(item.id)}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PORTAL DE FACTURACIÓN */}
        {providerTab === 'facturacion' && (
          <div className="rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-block rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  Facturación de Proveedor
                </span>
                <h2 className="text-lg font-extrabold text-[#221610] mt-1">
                  Facturas emitidas y liquidaciones
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7d6558]">Neto estimado (90% tras comisión)</span>
                <div className="text-xl font-extrabold text-emerald-700">
                  ${Math.round(totalRevenue * 0.9).toLocaleString('es-MX')} MXN
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#decfc2] text-[#7d6558] uppercase">
                  <tr>
                    <th className="py-2.5">Folio</th>
                    <th className="py-2.5">Evento / Cliente</th>
                    <th className="py-2.5">RFC</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#decfc2]">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 font-extrabold text-[#2d1d16]">{inv.folio}</td>
                      <td className="py-3">
                        <div className="font-bold text-[#221610]">{inv.eventOccasion}</div>
                        <div className="text-[11px] text-[#7d6558]">{inv.clientName}</div>
                      </td>
                      <td className="py-3 font-mono">{inv.rfc}</td>
                      <td className="py-3 font-extrabold">
                        ${inv.total.toLocaleString('es-MX')} MXN
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {providerTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Ingresos cotizados', value: `$${totalRevenue.toLocaleString('es-MX')}` },
                { label: 'Reservas activas', value: String(myBookings.length) },
                { label: 'Tasa de conversión', value: '34.2%' },
                { label: 'Calificación promedio', value: '4.95 ★' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl bg-white border border-[#decfc2] p-5"
                >
                  <p className="text-xs font-bold text-[#7d6558]">{kpi.label}</p>
                  <p className="text-2xl font-extrabold text-[#221610] mt-1">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white border border-[#decfc2] p-6">
              <h3 className="text-base font-extrabold text-[#221610] mb-6">
                Tendencia de cotizaciones últimos 6 meses
              </h3>
              <div className="flex items-end justify-between gap-4 h-48 pt-4">
                {monthlyBars.map((b) => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[54px] rounded-t-xl bg-gradient-to-t from-[#2d1d16] to-[#a36b42] transition-all"
                      style={{ height: `${b.val}%` }}
                    />
                    <span className="text-xs font-bold text-[#7d6558]">{b.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
