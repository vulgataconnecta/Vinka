import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  FileText,
  Flower2,
  Heart,
  Home,
  Lock,
  MapPin,
  Music,
  PartyPopper,
  Sparkles,
  Trees,
  Users,
  UtensilsCrossed,
  Wand2,
} from 'lucide-react'
import heroFallback from '../assets/hero-evento.png'
import { useVinka } from '../context/VinkaContext'
import type { EventQuote } from '../types/vinka'
import { EventProgressBar } from './EventProgressBar'

function CatGlyph({ icon }: { icon: string }) {
  switch (icon) {
    case 'garden':
      return <Trees size={20} />
    case 'camera':
      return <Camera size={20} />
    case 'food':
      return <UtensilsCrossed size={20} />
    case 'music':
      return <Music size={20} />
    case 'flower':
      return <Flower2 size={20} />
    default:
      return <Sparkles size={20} />
  }
}

const OCCASION_CARDS = [
  {
    title: 'Cumpleaños en familia',
    emoji: '🎂',
    subtitle: 'Pastel, juegos y todos reunidos',
    bg: 'from-[#f7f3ee] to-[#efe7de]',
  },
  {
    title: 'Boda soñada',
    emoji: '💍',
    subtitle: 'Un sí para recordar toda la vida',
    bg: 'from-[#f5efe9] to-[#efe7de]',
  },
  {
    title: 'Bautizo o Primera Comunión',
    emoji: '🕊️',
    subtitle: 'Una tarde cálida y llena de luz',
    bg: 'from-[#f7f3ee] to-[#f3ece4]',
  },
  {
    title: 'XV Años',
    emoji: '✨',
    subtitle: 'Música, baile y momentos mágicos',
    bg: 'from-[#efe7de] to-[#f7f3ee]',
  },
  {
    title: 'Reunión familiar',
    emoji: '🏡',
    subtitle: 'Jardín, buena comida y sobremesa',
    bg: 'from-[#f7f3ee] to-[#f3ece4]',
  },
  {
    title: 'Aniversario o Graduación',
    emoji: '🥂',
    subtitle: 'Brindemos juntos por este logro',
    bg: 'from-[#f5efe9] to-[#f7f3ee]',
  },
]

const GROUP_SIZES = [
  { label: 'Íntimo', desc: 'Los más cercanos', count: 35, emoji: '💛' },
  { label: 'En familia', desc: 'Tíos, primos y amigos', count: 80, emoji: '👨‍👩‍👧‍👦' },
  { label: 'Gran fiesta', desc: '¡Que no falte nadie!', count: 150, emoji: '🎉' },
  { label: 'Celebración épica', desc: 'Evento a lo grande', count: 230, emoji: '🌟' },
]

const VIBES = [
  { id: 'Al aire libre y jardín', emoji: '🌿' },
  { id: 'Cálido y hogareño', emoji: '🕯️' },
  { id: 'Elegante y moderno', emoji: '✨' },
  { id: 'Alegre y divertido', emoji: '🎶' },
]

export function EventBuilder() {
  const {
    listings,
    isListingAvailableOnDate,
    categories,
    searchFilters,
    pendingQuoteDraft,
    currentUser,
    submitEventQuote,
    setRoute,
    setClientTab,
  } = useVinka()

  const [step, setStep] = useState(pendingQuoteDraft?.autoAssembled ? 5 : 1)
  const [occasion, setOccasion] = useState(
    pendingQuoteDraft?.occasion || searchFilters.occasion || '',
  )
  const [customOccasion, setCustomOccasion] = useState(false)
  const [vibe, setVibe] = useState(pendingQuoteDraft?.vibe || 'Al aire libre y jardín')
  const [dateTime, setDateTime] = useState(
    pendingQuoteDraft?.dateTime || searchFilters.dateTime || '2026-12-20T17:00',
  )
  const [guests, setGuests] = useState<number>(
    pendingQuoteDraft?.guests || Number(searchFilters.capacity) || 80,
  )
  const [spaceId, setSpaceId] = useState<string | undefined>(pendingQuoteDraft?.spaceId)
  const [ownVenue, setOwnVenue] = useState(false)
  const [serviceIds, setServiceIds] = useState<string[]>(pendingQuoteDraft?.serviceIds || [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    pendingQuoteDraft?.selectedCategories || [],
  )
  const [notes, setNotes] = useState(pendingQuoteDraft?.notes || '')
  const [completedQuote, setCompletedQuote] = useState<EventQuote | null>(null)

  useEffect(() => {
    if (pendingQuoteDraft) {
      if (pendingQuoteDraft.occasion) setOccasion(pendingQuoteDraft.occasion)
      if (pendingQuoteDraft.dateTime) setDateTime(pendingQuoteDraft.dateTime)
      if (pendingQuoteDraft.guests) setGuests(pendingQuoteDraft.guests)
      if (pendingQuoteDraft.spaceId) {
        setSpaceId(pendingQuoteDraft.spaceId)
        setOwnVenue(false)
      }
      if (pendingQuoteDraft.serviceIds.length) setServiceIds(pendingQuoteDraft.serviceIds)
      if (pendingQuoteDraft.selectedCategories?.length)
        setSelectedCategories(pendingQuoteDraft.selectedCategories)
      if (pendingQuoteDraft.vibe) setVibe(pendingQuoteDraft.vibe)
      if (pendingQuoteDraft.autoAssembled) setStep(5)
    }
  }, [pendingQuoteDraft])

  const spaces = listings.filter((l) => l.active && l.kind === 'espacio')
  const services = listings.filter((l) => l.active && l.kind === 'servicio')

  const selectedSpace = ownVenue ? undefined : spaces.find((s) => s.id === spaceId)
  const selectedServices = services.filter((s) => serviceIds.includes(s.id))
  const total =
    (selectedSpace?.price ?? 0) + selectedServices.reduce((sum, item) => sum + item.price, 0)

  const toggleService = (id: string) => {
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catName)) {
        // Also unselect services from that category
        const catServiceIds = new Set(
          services.filter((s) => s.category === catName).map((s) => s.id),
        )
        setServiceIds((curr) => curr.filter((id) => !catServiceIds.has(id)))
        return prev.filter((c) => c !== catName)
      }
      return [...prev, catName]
    })
  }

  const handleConfirm = () => {
    const combinedNotes = [vibe ? `Ambiente: ${vibe}.` : '', ownVenue ? 'El cliente cuenta con lugar propio.' : '', notes]
      .filter(Boolean)
      .join(' ')

    const res = submitEventQuote({
      occasion: occasion.trim() || 'Celebración en familia',
      dateTime,
      guests,
      spaceId: ownVenue ? undefined : spaceId,
      serviceIds,
      selectedCategories,
      notes: combinedNotes,
    })
    if (res.ok && res.quote) {
      setCompletedQuote(res.quote)
    }
  }

  const stepsMeta = [
    { num: 1, label: 'La ocasión' },
    { num: 2, label: 'Fecha e invitados' },
    { num: 3, label: 'El lugar' },
    { num: 4, label: 'Detalles mágicos' },
    { num: 5, label: 'Tu tablero final' },
  ]

  // Celebratory Success Screen
  if (completedQuote) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-gradient-to-b from-[#f3ece4] via-[#fdfcfb] to-[#efe7de] py-14 px-4">
        <div className="vinka-modal-card max-w-xl mx-auto rounded-3xl bg-white border border-[#decfc2] p-8 md:p-10 shadow-xl text-center space-y-6">
          <div
            className="vinka-celebrate-drift mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2d1d16 0%, #6b4e3e 55%, #a36b42 100%)' }}
          >
            <PartyPopper size={36} />
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#f7f3ee] px-3.5 py-1 text-xs font-extrabold text-[#a36b42] mb-2">
              Folio #{completedQuote.id.slice(-6).toUpperCase()}
            </span>
            <h1 className="text-3xl font-extrabold text-[#221610]">
              ¡Tu celebración ya está en marcha!
            </h1>
            <p className="text-sm text-[#7d6558] mt-2 leading-relaxed">
              Guardamos <strong>{completedQuote.occasion}</strong> en tu calendario familiar y
              enviamos la invitación a cada proveedor. Si alguno no puede aceptar, te avisaremos con
              recomendaciones para elegir otro.
            </p>
          </div>

          <EventProgressBar items={completedQuote.bookingItems} />

          <div className="rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-5 text-left space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7d6558]">Fecha y hora</span>
              <span className="font-bold text-[#221610]">
                {completedQuote.dateTime.replace('T', ' · ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7d6558]">Invitados</span>
              <span className="font-bold text-[#221610]">{completedQuote.guests} personas</span>
            </div>
            {completedQuote.spaceTitle && (
              <div className="flex justify-between">
                <span className="text-[#7d6558]">Lugar elegido</span>
                <span className="font-bold text-[#221610]">{completedQuote.spaceTitle}</span>
              </div>
            )}
            {completedQuote.serviceTitles.length > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-[#7d6558]">Servicios</span>
                <span className="font-bold text-[#221610] text-right">
                  {completedQuote.serviceTitles.join(', ')}
                </span>
              </div>
            )}
            <div className="pt-3 mt-2 border-t border-[#decfc2] flex justify-between text-base">
              <span className="font-extrabold text-[#221610]">Total estimado</span>
              <span className="font-extrabold text-[#a36b42]">
                ${completedQuote.totalAmount.toLocaleString('es-MX')} MXN
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setClientTab('mis-eventos')
                setRoute('client-portal')
              }}
              className="btn-vinka rounded-xl px-6 py-3 text-sm font-bold cursor-pointer"
            >
              Ver en Mis eventos
            </button>
            <button
              type="button"
              onClick={() => {
                setClientTab('facturacion')
                setRoute('client-portal')
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#decfc2] bg-white hover:bg-[#f7f3ee] text-[#221610] px-5 py-3 text-sm font-bold cursor-pointer"
            >
              <FileText size={16} /> Ir a Facturación
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-gradient-to-b from-[#f7f3ee] via-[#fdfcfb] to-[#efe7de]/50 py-8 px-[5vw]">
      <div className="max-w-6xl mx-auto">
        {/* Top Greeting & Progress */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <button
              type="button"
              onClick={() => setRoute('landing')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a36b42] hover:underline mb-2 cursor-pointer bg-transparent border-0"
            >
              <ArrowLeft size={14} /> Volver al inicio
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#221610]">
              Armemos tu celebración juntos ✨
            </h1>
            <p className="text-sm text-[#7d6558] mt-0.5">
              Sin formularios aburridos: elige a tu ritmo y mira cómo cobra vida tu evento.
            </p>
          </div>

          {/* Friendly Progress Pills */}
          <div className="flex items-center gap-1.5 bg-white border border-[#decfc2] rounded-2xl p-1.5 shadow-sm overflow-x-auto">
            {stepsMeta.map((s) => {
              const active = step === s.num
              const done = step > s.num
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${active
                      ? 'btn-vinka'
                      : done
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-[#7d6558] hover:bg-[#f7f3ee]'
                    }`}
                >
                  {done ? <Check size={13} /> : <span>{s.num}.</span>}
                  <span>{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-7 items-start">
          {/* Interactive Visual Stage (Left 8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-white border border-[#decfc2] p-6 md:p-8 shadow-sm space-y-6">
            <div key={step} className="vinka-step-enter">
            {/* STEP 1: VISUAL OCCASION CARDS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ee] text-[#a36b42] px-3 py-1 text-xs font-extrabold">
                    Paso 1 de 5 · Empecemos por lo bonito
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#221610] mt-2">
                    ¿Cuál es la ocasión especial que vamos a celebrar?
                  </h2>
                  <p className="text-sm text-[#7d6558] mt-1">
                    Toca la tarjeta que más se parezca a tu idea o escríbenos con tus propias
                    palabras.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {OCCASION_CARDS.map((card) => {
                    const selected = occasion === card.title && !customOccasion
                    return (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => {
                          setOccasion(card.title)
                          setCustomOccasion(false)
                        }}
                        className={`relative rounded-2xl p-4 text-left border-2 transition cursor-pointer bg-gradient-to-br ${card.bg} ${selected
                            ? 'border-[#2d1d16] ring-4 ring-[#a36b42]/20 scale-[1.01]'
                            : 'border-transparent hover:border-[#decfc2]'
                          }`}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#2d1d16] text-white">
                            <Check size={14} />
                          </span>
                        )}
                        <div className="text-3xl mb-2.5">{card.emoji}</div>
                        <h3 className="font-extrabold text-sm text-[#221610]">{card.title}</h3>
                        <p className="text-[11.5px] text-[#7d6558] mt-1 leading-snug">
                          {card.subtitle}
                        </p>
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-4 space-y-2">
                  <label className="block text-xs font-extrabold text-[#422d22]">
                    💬 ¿Es otra celebración o quieres personalizar el nombre?
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => {
                      setOccasion(e.target.value)
                      setCustomOccasion(true)
                    }}
                    placeholder="Ej. Cumpleaños 60 de la abuela, Baby shower de Mateo, posada familiar..."
                    className="w-full rounded-xl bg-white border border-[#decfc2] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2d1d16]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: WHEN, HOW MANY & VIBE */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3ece4] text-[#422d22] px-3 py-1 text-xs font-extrabold">
                    Paso 2 de 5 · Fecha y ambiente
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#221610] mt-2">
                    ¿Cuántos seremos y qué ambiente imaginan?
                  </h2>
                </div>

                {/* Friendly group size cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#221610]">
                      Tamaño de la reunión
                    </span>
                    <span className="rounded-full bg-[#2d1d16] text-white px-3 py-1 text-xs font-extrabold">
                      {guests} invitados
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {GROUP_SIZES.map((g) => {
                      const active = Math.abs(guests - g.count) <= 15
                      return (
                        <button
                          key={g.label}
                          type="button"
                          onClick={() => setGuests(g.count)}
                          className={`rounded-2xl p-3.5 text-center border-2 transition cursor-pointer ${active
                              ? 'border-[#2d1d16] bg-[#f7f3ee]/70'
                              : 'border-[#decfc2] bg-white hover:bg-[#f7f3ee]'
                            }`}
                        >
                          <div className="text-2xl mb-1">{g.emoji}</div>
                          <div className="text-xs font-extrabold text-[#221610]">{g.label}</div>
                          <div className="text-[11px] text-[#7d6558]">~{g.count} personas</div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="pt-1">
                    <input
                      type="range"
                      min={15}
                      max={300}
                      step={5}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full accent-[#2d1d16] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#7d6558] font-semibold">
                      <span>15 personas</span>
                      <span>150 personas</span>
                      <span>300 personas</span>
                    </div>
                  </div>
                </div>

                {/* Date & Vibe */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-4">
                    <label className="block text-xs font-extrabold text-[#221610] mb-2">
                      <Calendar size={14} className="inline mr-1 text-[#a36b42]" /> ¿Qué día y hora
                      tienen en mente?
                    </label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full rounded-xl bg-white border border-[#decfc2] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#2d1d16]"
                    />
                  </div>

                  <div className="rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-4">
                    <label className="block text-xs font-extrabold text-[#221610] mb-2">
                      <Sparkles size={14} className="inline mr-1 text-[#a36b42]" /> Estilo del
                      ambiente
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {VIBES.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVibe(v.id)}
                          className={`rounded-xl px-2.5 py-2 text-[11px] font-bold text-left border transition cursor-pointer ${vibe === v.id
                              ? 'bg-[#2d1d16] text-white border-indigo-600'
                              : 'bg-white text-[#221610] border-[#decfc2] hover:border-[#b89a82]'
                            }`}
                        >
                          {v.emoji} {v.id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PICK YOUR VENUE (BIG PHOTO GALLERY) */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3ece4] text-[#422d22] px-3 py-1 text-xs font-extrabold">
                      Paso 3 de 5 · El escenario
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#221610] mt-2">
                      Elige el lugar donde celebrarán
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnVenue((o) => !o)
                      if (!ownVenue) setSpaceId(undefined)
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold border transition cursor-pointer ${ownVenue
                        ? 'bg-[#2d1d16] text-white border-indigo-600'
                        : 'bg-[#f7f3ee] text-[#422d22] border-[#decfc2] hover:bg-[#efe7de]'
                      }`}
                  >
                    <Home size={14} /> {ownVenue ? '✓ Usaré mi propio lugar' : 'Ya tengo lugar propio'}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {spaces.map((sp) => {
                    const available = isListingAvailableOnDate(sp.id, dateTime)
                    const selected = available && !ownVenue && spaceId === sp.id
                    const fits = !sp.capacity || sp.capacity >= guests
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          if (!available) return
                          setOwnVenue(false)
                          setSpaceId(selected ? undefined : sp.id)
                        }}
                        className={`group text-left rounded-2xl border-2 overflow-hidden transition ${
                          !available
                            ? 'border-[#decfc2] bg-[#f7f3ee]/60 opacity-60 cursor-not-allowed'
                            : selected
                              ? 'border-[#2d1d16] ring-4 ring-[#a36b42]/20 bg-[#f7f3ee]/30 cursor-pointer'
                              : 'border-[#decfc2] bg-white hover:border-[#b89a82] hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <img
                            src={sp.image}
                            alt={sp.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span
                            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold shadow-sm ${
                              !available
                                ? 'bg-rose-600 text-white'
                                : fits
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-amber-400 text-[#221610]'
                            }`}
                          >
                            {!available
                              ? 'Fecha reservada'
                              : fits
                                ? `✓ Ideal para ${guests} invitados`
                                : `Hasta ${sp.capacity} personas`}
                          </span>
                          {selected && (
                            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#2d1d16] text-white shadow-lg">
                              <Check size={17} />
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-extrabold text-base text-[#221610]">{sp.title}</h3>
                            <span className="text-sm font-extrabold text-[#a36b42]">
                              ${sp.price.toLocaleString('es-MX')}
                            </span>
                          </div>
                          <p className="text-xs text-[#7d6558] flex items-center gap-1 mt-1">
                            <MapPin size={12} className="text-[#a36b42]" /> {sp.location}
                          </p>
                          <p className="text-xs text-[#7d6558] mt-2 line-clamp-2">
                            {sp.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: ADD CATEGORIES & MAGIC SERVICES */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ee] text-[#a36b42] px-3 py-1 text-xs font-extrabold">
                    Paso 4 de 5 · Dale magia a tu fiesta
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#221610] mt-2">
                    ¿Qué categorías quieres sumar a tu evento?
                  </h2>
                  <p className="text-sm text-[#7d6558] mt-1">
                    Selecciona las categorías que necesitas. Cada proveedor elegido recibirá tu
                    solicitud para confirmar disponibilidad.
                  </p>
                </div>

                {/* All Service Categories */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {categories
                    .filter((c) => c.kind === 'servicio')
                    .map((cat) => {
                      const active = selectedCategories.includes(cat.name)
                      const catProviders = services.filter((s) => s.category === cat.name)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={`relative rounded-2xl p-4 text-left border-2 transition cursor-pointer ${
                            active
                              ? 'border-[#2d1d16] ring-4 ring-[#a36b42]/15 bg-[#f7f3ee]'
                              : 'border-[#decfc2] bg-white hover:bg-[#fdfcfb] hover:border-[#b89a82]'
                          }`}
                        >
                          {active && (
                            <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#2d1d16] text-white">
                              <Check size={14} />
                            </span>
                          )}
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe7de] text-[#2d1d16] mb-3">
                            <CatGlyph icon={cat.icon} />
                          </div>
                          <h3 className="font-extrabold text-sm text-[#221610]">{cat.name}</h3>
                          <p className="text-[11.5px] text-[#7d6558] mt-1 leading-snug">
                            {cat.description}
                          </p>
                          <span className="mt-2.5 inline-block text-[10.5px] font-extrabold text-[#a36b42]">
                            {active
                              ? '✓ Sumado a tu evento'
                              : catProviders.length > 0
                                ? `+ Sumar (${catProviders.length} disp.)`
                                : '+ Sumar a mi lista'}
                          </span>
                        </button>
                      )
                    })}
                </div>

                {/* Providers inside selected categories */}
                {selectedCategories.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-[#efe7de]">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#a36b42]">
                      Elige proveedor para tus categorías seleccionadas
                    </p>
                    {selectedCategories.map((catName) => {
                      const catServices = services.filter((sv) => sv.category === catName)
                      return (
                        <div
                          key={catName}
                          className="vinka-step-enter rounded-2xl bg-[#f7f3ee]/75 border border-[#decfc2] p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-extrabold text-[#221610]">{catName}</h4>
                            <span className="text-[11px] font-bold text-[#7d6558]">
                              {catServices.length > 0
                                ? `${catServices.length} opción(es) disponible(s)`
                                : 'Pendiente de proveedores'}
                            </span>
                          </div>

                          {catServices.length === 0 ? (
                            <p className="text-xs text-[#7d6558] bg-white rounded-xl border border-[#decfc2] px-3.5 py-2.5">
                              Esta categoría ya quedó sumada a tu evento. Cuando haya proveedores
                              verificados de <strong>{catName}</strong> podrás elegirlo desde{' '}
                              <strong>Mis eventos</strong>.
                            </p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                              {catServices.map((sv) => {
                                const available = isListingAvailableOnDate(sv.id, dateTime)
                                const added = available && serviceIds.includes(sv.id)
                                return (
                                  <button
                                    key={sv.id}
                                    type="button"
                                    disabled={!available}
                                    onClick={() => available && toggleService(sv.id)}
                                    className={`group rounded-2xl border-2 overflow-hidden text-left transition ${
                                      !available
                                        ? 'border-[#decfc2] bg-[#f7f3ee]/60 opacity-60 cursor-not-allowed'
                                        : added
                                          ? 'border-[#2d1d16] bg-white ring-2 ring-[#a36b42]/20 cursor-pointer'
                                          : 'border-[#decfc2] bg-white hover:border-[#b89a82] cursor-pointer'
                                    }`}
                                  >
                                    <div className="relative h-28 w-full overflow-hidden">
                                      <img
                                        src={sv.image}
                                        alt={sv.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                      />
                                      <span
                                        className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
                                          !available
                                            ? 'bg-rose-600 text-white'
                                            : added
                                              ? 'bg-[#2d1d16] text-white'
                                              : 'bg-white/95 text-[#221610]'
                                        }`}
                                      >
                                        {!available
                                          ? 'Fecha ocupada'
                                          : added
                                            ? '✓ Elegido'
                                            : '+ Elegir'}
                                      </span>
                                    </div>
                                    <div className="p-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <h5 className="font-extrabold text-xs text-[#221610]">
                                          {sv.title}
                                        </h5>
                                        <span className="text-xs font-extrabold text-[#a36b42]">
                                          ${sv.price.toLocaleString('es-MX')}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: FINAL INVITATION & NOTES */}
            {step === 5 && (
              <div className="space-y-5">
                {pendingQuoteDraft?.autoAssembled && (
                  <div className="rounded-2xl bg-[#f3ece4] border border-[#b89a82] p-4 flex items-start gap-3 text-xs text-[#221610]">
                    <Wand2 size={18} className="text-[#a36b42] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold">
                        ✨ ¡Listo! Ensamblamos esta propuesta según lo que describiste
                      </p>
                      <p className="text-[#4e392e] mt-0.5">
                        Puedes confirmar ahora mismo o regresar a cualquiera de los pasos superiores
                        para personalizar el lugar, fecha o categorías.
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-extrabold">
                    Paso 5 de 5 · ¡Casi listo!
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#221610] mt-2">
                    Revisa tu celebración y déjanos cualquier detalle extra
                  </h2>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#f7f3ee] via-white to-[#f3ece4] border border-[#efe7de] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-[#a36b42] uppercase">Tu celebración</p>
                      <h3 className="text-xl font-extrabold text-[#221610]">
                        {occasion || 'Celebración en familia'}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white border border-[#decfc2] px-3 py-1 text-xs font-bold text-[#422d22]">
                      {vibe}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#7d6558] font-semibold">
                    <span>📅 {dateTime ? dateTime.replace('T', ' · ') : 'Fecha por definir'}</span>
                    <span>👥 {guests} invitados</span>
                    <span>
                      🏡 {ownVenue ? 'Lugar propio' : selectedSpace?.title || 'Sin lugar elegido'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#221610] mb-1.5">
                    ¿Algún deseo especial para tu familia o invitados? (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Queremos menú infantil, acceso cómodo para adultos mayores, pastel sin nueces..."
                    className="w-full rounded-2xl border border-[#decfc2] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#2d1d16]"
                  />
                </div>

                {!currentUser && (
                  <div className="rounded-2xl bg-[#f7f3ee] border border-[#efe7de] p-4 text-xs text-[#221610] flex items-start gap-2.5">
                    <Lock size={16} className="text-[#a36b42] shrink-0 mt-0.5" />
                    <span>
                      Al dar clic en <strong>Cotizar mi celebración</strong> te pediremos iniciar
                      sesión o crear tu cuenta en un paso rápido para guardar tu evento (sin perder
                      nada de lo que armaste).
                    </span>
                  </div>
                )}
              </div>
            )}

            </div>

            {/* Navigation Footer inside Stage */}
            <div className="flex items-center justify-between pt-5 border-t border-[#decfc2]">
              <button
                type="button"
                onClick={() => (step === 1 ? setRoute('landing') : setStep((s) => s - 1))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#decfc2] bg-white hover:bg-[#f7f3ee] px-4 py-2.5 text-xs font-bold text-[#221610] cursor-pointer"
              >
                <ArrowLeft size={14} /> {step === 1 ? 'Salir' : 'Paso anterior'}
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-vinka inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-extrabold cursor-pointer"
                >
                  Siguiente paso <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    !selectedSpace &&
                    selectedServices.length === 0 &&
                    selectedCategories.length === 0 &&
                    !ownVenue
                  }
                  onClick={handleConfirm}
                  className="btn-vinka disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-extrabold cursor-pointer"
                >
                  <Wand2 size={16} />
                  {currentUser ? '¡Listo, cotizar mi celebración!' : 'Continuar y cotizar'}
                </button>
              )}
            </div>
          </div>

          {/* LIVE VISUAL EVENT BOARD / MOODBOARD (Right 4 cols) */}
          <aside className="lg:col-span-4 rounded-3xl bg-white border border-[#decfc2] overflow-hidden shadow-md sticky top-24">
            <div className="relative h-44 w-full bg-[#f3ece4]">
              <img
                src={selectedSpace?.image || heroFallback}
                alt="Vista previa de tu evento"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221610]/80 via-[#221610]/25 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold">
                  <Heart size={11} className="text-[#d4af77]" /> Tablero de tu evento
                </span>
                <h3 className="text-lg font-extrabold leading-tight mt-1">
                  {occasion || 'Tu próxima celebración'}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-[#f7f3ee] p-2.5">
                  <span className="text-[10px] text-[#7d6558] block font-semibold">Invitados</span>
                  <strong className="text-[#221610] inline-flex items-center gap-1">
                    <Users size={12} className="text-[#a36b42]" /> {guests} personas
                  </strong>
                </div>
                <div className="rounded-xl bg-[#efe7de] p-2.5">
                  <span className="text-[10px] text-[#7d6558] block font-semibold">Ambiente</span>
                  <strong className="text-[#221610] truncate block">{vibe.split(' ')[0]}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7d6558]">
                  Lo que llevas armado
                </p>
                {selectedSpace ? (
                  <div
                    key={selectedSpace.id}
                    className="vinka-board-item flex items-center justify-between rounded-xl bg-[#f7f3ee]/90 px-3 py-2"
                  >
                    <span className="font-bold text-[#221610]">🏡 {selectedSpace.title}</span>
                    <span className="font-extrabold text-[#a36b42]">
                      ${selectedSpace.price.toLocaleString('es-MX')}
                    </span>
                  </div>
                ) : ownVenue ? (
                  <div className="vinka-board-item rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-800">
                    🏡 Lugar propio seleccionado
                  </div>
                ) : (
                  <p className="text-[#94a3b8] italic">Aún sin lugar elegido (Paso 3)</p>
                )}

                {selectedServices.map((s) => (
                  <div
                    key={s.id}
                    className="vinka-board-item flex items-center justify-between rounded-xl bg-[#fdfcfb] border border-[#decfc2] px-3 py-2"
                  >
                    <span className="font-semibold text-[#221610]">✨ {s.title}</span>
                    <span className="font-bold text-[#a36b42]">
                      ${s.price.toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}

                {selectedCategories
                  .filter((cat) => !selectedServices.some((s) => s.category === cat))
                  .map((cat) => (
                    <div
                      key={cat}
                      className="vinka-board-item flex items-center justify-between rounded-xl bg-[#f7f3ee] border border-dashed border-[#b89a82] px-3 py-2"
                    >
                      <span className="font-semibold text-[#422d22]">🏷️ {cat}</span>
                      <span className="text-[10.5px] font-bold text-[#7d6558]">Por asignar</span>
                    </div>
                  ))}
              </div>

              <div className="pt-3 border-t border-[#decfc2] flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#7d6558]">Presupuesto estimado</span>
                <span className="text-2xl font-extrabold gradient-text">
                  ${total.toLocaleString('es-MX')}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
