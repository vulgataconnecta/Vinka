import { useState } from 'react'
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MapPin,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'

export function ListingDetailPage() {
  const {
    selectedListingId,
    listingReturnRoute,
    listings,
    favorites,
    toggleFavorite,
    setRoute,
    setClientTab,
    setPendingQuoteDraft,
    showToast,
  } = useVinka()

  const item = listings.find((l) => l.id === selectedListingId) ?? listings[0]
  const photos = item?.gallery?.length ? item.gallery : item ? [item.image] : []
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [messageOpen, setMessageOpen] = useState(false)
  const [hostMsg, setHostMsg] = useState('')

  if (!item) return null

  const isFav = favorites.includes(item.id)
  const activePhoto = photos[activePhotoIdx] || item.image

  const host = item.host ?? {
    name: item.providerName,
    roleLabel: `Anfitrión Verificado · ${item.providerName}`,
    verified: true,
    memberSince: '2024',
    responseRate: '98%',
    responseTime: 'Menos de 1 hora',
    eventsHosted: Math.max(12, item.reviews),
    bio: `Comprometidos con hacer de tu evento una experiencia cálida, cuidada y memorable en ${item.location}.`,
    city: item.location,
    avatarInitials: item.providerName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  }

  const handleBack = () => {
    if (listingReturnRoute === 'client-portal') {
      setClientTab('descubrir')
    }
    setRoute(listingReturnRoute)
  }

  const handleAddToEvent = () => {
    setPendingQuoteDraft((prev) => ({
      occasion: prev?.occasion || '',
      dateTime: prev?.dateTime || '2026-12-20T17:00',
      guests: prev?.guests || item.capacity || 80,
      spaceId: item.kind === 'espacio' ? item.id : prev?.spaceId,
      serviceIds:
        item.kind === 'servicio'
          ? Array.from(new Set([...(prev?.serviceIds ?? []), item.id]))
          : (prev?.serviceIds ?? []),
      notes: prev?.notes || '',
    }))
    setRoute('event-builder')
  }

  const handleSendHostMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostMsg.trim()) return
    showToast(`Mensaje enviado a ${host.name}. Te responderá en ${host.responseTime.toLowerCase()}.`)
    setHostMsg('')
    setMessageOpen(false)
  }

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#fdfcfb] py-8 px-[5vw]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top bar: Back + Favorite */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-[#decfc2] bg-white hover:bg-[#f7f3ee] px-4 py-2 text-xs font-bold text-[#2d1d16] shadow-xs transition cursor-pointer"
          >
            <ArrowLeft size={15} />
            Volver a {listingReturnRoute === 'landing' ? 'Inicio' : 'Descubrir'}
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer ${
              isFav
                ? 'border-[#a36b42] bg-[#f3ece4] text-[#a36b42]'
                : 'border-[#decfc2] bg-white text-[#2d1d16] hover:bg-[#f7f3ee]'
            }`}
          >
            <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
            {isFav ? 'Guardado en favoritos' : 'Guardar en favoritos'}
          </button>
        </div>

        {/* Title & Quick Meta */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f3ece4] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#a36b42]">
              {item.category}
            </span>
            <span className="rounded-full bg-[#efe7de] px-3 py-1 text-[11px] font-bold text-[#422d22]">
              {item.tag}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1e140f]">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#7d6558]">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#221610]">
              <Star size={15} className="text-[#b88b4a]" fill="currentColor" />
              {item.rating} ({item.reviews} reseñas)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-[#a36b42]" /> {item.location}
            </span>
            {item.capacity && (
              <span className="inline-flex items-center gap-1.5">
                <Users size={15} className="text-[#a36b42]" /> Capacidad hasta {item.capacity}{' '}
                invitados
              </span>
            )}
          </div>
        </div>

        {/* Full Photo Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden rounded-3xl border border-[#decfc2] bg-[#efe7de] shadow-md">
            <img
              key={activePhoto}
              src={activePhoto}
              alt={item.title}
              className="vinka-step-enter h-full w-full object-cover"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-[#1e140f]/75 backdrop-blur-md text-white px-3.5 py-1.5 text-xs font-bold">
              Foto {activePhotoIdx + 1} de {photos.length}
            </span>
          </div>

          {photos.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {photos.map((photo, idx) => (
                <button
                  key={`${idx}-${photo.slice(0, 20)}`}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
                    idx === activePhotoIdx
                      ? 'border-[#2d1d16] ring-2 ring-[#a36b42]/30 scale-[1.02]'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${item.title} vista ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid: Place Info + Host Info (Left 8) | Sticky Summary Card (Right 4) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-7">
            {/* Acerca del lugar / servicio */}
            <section className="rounded-3xl bg-white border border-[#decfc2] p-6 md:p-7 space-y-4 shadow-xs">
              <p className="eyebrow dark">
                <span /> Sobre este {item.kind === 'espacio' ? 'espacio' : 'servicio'}
              </p>
              <p className="text-base text-[#4e392e] leading-relaxed">{item.description}</p>

              <div className="pt-4 border-t border-[#efe7de]">
                <h3 className="text-sm font-extrabold text-[#221610] mb-3">
                  Lo que incluye tu reserva
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {item.includedServices.map((inc) => (
                    <div
                      key={inc}
                      className="flex items-center gap-2.5 rounded-xl bg-[#f7f3ee] px-3.5 py-2.5 text-xs font-semibold text-[#221610]"
                    >
                      <CheckCircle2 size={15} className="text-[#a36b42] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Horarios, Reglas y Facturación */}
            <section className="rounded-3xl bg-[#f7f3ee] border border-[#decfc2] p-6 md:p-7 grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a36b42] inline-flex items-center gap-1.5">
                  <Calendar size={14} /> Horario y disponibilidad
                </h3>
                <p className="text-sm font-semibold text-[#221610]">{item.schedule}</p>
                {item.bookedDates && item.bookedDates.length > 0 && (
                  <div className="pt-1.5">
                    <p className="text-[11px] font-bold text-rose-700 mb-1">
                      Fechas ya reservadas (no disponibles):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.bookedDates.map((d) => (
                        <span
                          key={d}
                          className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10.5px] font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a36b42] inline-flex items-center gap-1.5">
                  <FileText size={14} /> Facturación fiscal
                </h3>
                <p className="text-sm font-semibold text-[#221610]">
                  {item.offersInvoicing
                    ? 'Disponible · Emite factura CFDI 4.0'
                    : 'No cuenta con facturación directa'}
                </p>
              </div>
              <div className="sm:col-span-2 pt-3 border-t border-[#decfc2] space-y-1.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a36b42] inline-flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Reglas y consideraciones del lugar
                </h3>
                <p className="text-sm text-[#4e392e] leading-relaxed">{item.rules}</p>
              </div>
            </section>

            {/* Información relevante del Anfitrión */}
            <section className="rounded-3xl bg-white border border-[#decfc2] p-6 md:p-7 space-y-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2d1d16] text-white text-xl font-extrabold shadow-md shrink-0">
                    {host.avatarInitials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#1e140f]">
                        Conoce a tu anfitrión: {host.name}
                      </h2>
                      {host.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <ShieldCheck size={13} /> Identidad verificada
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#7d6558] mt-0.5">
                      {host.roleLabel} · Miembro desde {host.memberSince}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#4e392e] leading-relaxed bg-[#f7f3ee] rounded-2xl p-4">
                “{host.bio}”
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#decfc2] bg-[#fdfcfb] p-3.5 text-center">
                  <Award size={18} className="mx-auto text-[#a36b42] mb-1" />
                  <div className="text-base font-extrabold text-[#1e140f]">
                    {host.eventsHosted}+
                  </div>
                  <div className="text-[11px] text-[#7d6558]">Eventos realizados</div>
                </div>
                <div className="rounded-2xl border border-[#decfc2] bg-[#fdfcfb] p-3.5 text-center">
                  <Sparkles size={18} className="mx-auto text-[#a36b42] mb-1" />
                  <div className="text-base font-extrabold text-[#1e140f]">{host.responseRate}</div>
                  <div className="text-[11px] text-[#7d6558]">Tasa de respuesta</div>
                </div>
                <div className="rounded-2xl border border-[#decfc2] bg-[#fdfcfb] p-3.5 text-center">
                  <Clock size={18} className="mx-auto text-[#a36b42] mb-1" />
                  <div className="text-sm font-extrabold text-[#1e140f] leading-tight">
                    {host.responseTime}
                  </div>
                  <div className="text-[11px] text-[#7d6558] mt-0.5">Tiempo de respuesta</div>
                </div>
              </div>

              {!messageOpen ? (
                <button
                  type="button"
                  onClick={() => setMessageOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#decfc2] bg-[#f7f3ee] hover:bg-[#efe7de] px-5 py-2.5 text-xs font-extrabold text-[#2d1d16] transition cursor-pointer"
                >
                  <MessageCircle size={15} /> Escribir una pregunta al anfitrión
                </button>
              ) : (
                <form
                  onSubmit={handleSendHostMessage}
                  className="vinka-step-enter rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-4 space-y-3"
                >
                  <label className="block text-xs font-extrabold text-[#221610]">
                    Envía tu consulta directa a {host.name}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={hostMsg}
                    onChange={(e) => setHostMsg(e.target.value)}
                    placeholder="Ej. ¿Podemos agendar una visita familiar este fin de semana para conocer el jardín?"
                    className="w-full rounded-xl bg-white border border-[#decfc2] px-3.5 py-2.5 text-xs outline-none focus:border-[#8c6a54]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="btn-vinka px-5 py-2 text-xs font-bold cursor-pointer"
                    >
                      Enviar mensaje
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageOpen(false)}
                      className="rounded-full border border-[#decfc2] bg-white px-4 py-2 text-xs font-bold text-[#7d6558] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* Sticky Action Card (Right 4) */}
          <aside className="lg:col-span-4 rounded-3xl bg-white border border-[#decfc2] p-6 shadow-md sticky top-24 space-y-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-[#1e140f]">
                  ${item.price.toLocaleString('es-MX')}
                </span>
                <span className="text-xs font-semibold text-[#7d6558] ml-1.5">
                  MXN · {item.priceUnit}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#221610]">
                <Star size={14} className="text-[#b88b4a]" fill="currentColor" /> {item.rating}
              </span>
            </div>

            <div className="rounded-2xl bg-[#f7f3ee] p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7d6558]">Ubicación</span>
                <span className="font-bold text-[#221610] text-right">{item.location}</span>
              </div>
              {item.capacity && (
                <div className="flex justify-between">
                  <span className="text-[#7d6558]">Capacidad máxima</span>
                  <span className="font-bold text-[#221610]">{item.capacity} personas</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#7d6558]">Anfitrión</span>
                <span className="font-bold text-[#221610]">{host.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d6558]">Factura CFDI</span>
                <span className="font-bold text-[#221610]">
                  {item.offersInvoicing ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToEvent}
              className="btn-vinka w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-extrabold cursor-pointer"
            >
              <Wand2 size={16} /> Agregar a "Arma tu evento"
            </button>

            <p className="text-[11px] text-center text-[#7d6558]">
              Sin cargos por adelantado · Cotiza y combina con otros servicios a tu ritmo.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
