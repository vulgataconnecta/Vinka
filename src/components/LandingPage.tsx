import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  Flower2,
  Heart,
  Mail,
  Music,
  Search,
  Send,
  Sparkles,
  Star,
  Trees,
  Users,
  UtensilsCrossed,
  Wand2,
} from 'lucide-react'
import heroImage from '../assets/hero-evento.png'
import { useVinka } from '../context/VinkaContext'
import type { ListingItem } from '../types/vinka'
import { ListingDetailModal } from './ListingDetailModal'
import { Reveal } from './Reveal'
import { VinkaLogo } from './VinkaLogo'

function CategoryIcon({ name, size = 24 }: { name: string; size?: number }) {
  switch (name) {
    case 'garden':
      return <Trees size={size} />
    case 'camera':
      return <Camera size={size} />
    case 'food':
      return <UtensilsCrossed size={size} />
    case 'music':
      return <Music size={size} />
    case 'flower':
      return <Flower2 size={size} />
    default:
      return <Sparkles size={size} />
  }
}

export function LandingPage() {
  const {
    categories,
    eventTypes,
    listings,
    isListingAvailableOnDate,
    favorites,
    toggleFavorite,
    searchFilters,
    setSearchFilters,
    setRoute,
    setClientTab,
    setPendingQuoteDraft,
    openListingDetail,
    showToast,
  } = useVinka()

  const [activeCategory, setActiveCategory] = useState<string>('Todas')
  const [searched, setSearched] = useState(false)
  const [searchMode, setSearchMode] = useState<'buscar' | 'ensamblar'>('buscar')
  const [magicPrompt, setMagicPrompt] = useState('')
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  const activeListings = useMemo(() => listings.filter((l) => l.active), [listings])

  const filteredSpaces = useMemo(() => {
    return activeListings
      .filter((l) => l.kind === 'espacio')
      .filter((l) => {
        if (activeCategory !== 'Todas' && activeCategory !== 'Fincas y Terrazas') {
          return true
        }
        const minCap = Number(searchFilters.capacity || 0)
        if (searched && minCap > 0 && l.capacity && l.capacity < minCap) return false
        if (searched && searchFilters.dateTime && !isListingAvailableOnDate(l.id, searchFilters.dateTime)) {
          return false
        }
        return true
      })
  }, [activeListings, activeCategory, searched, searchFilters.capacity, searchFilters.dateTime, isListingAvailableOnDate])

  const filteredServices = useMemo(() => {
    return activeListings
      .filter((l) => l.kind === 'servicio')
      .filter((l) => activeCategory === 'Todas' || l.category === activeCategory)
  }, [activeListings, activeCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
    document.querySelector('#espacios')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMagicAssemble = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = magicPrompt.trim()
    if (!raw) return
    const text = raw.toLowerCase()

    // 1. Detect occasion
    let detectedOccasion = raw.length <= 42 ? raw : 'Celebración especial en familia'
    if (text.includes('boda')) detectedOccasion = 'Boda soñada'
    else if (text.includes('xv') || text.includes('quince')) detectedOccasion = 'XV Años'
    else if (text.includes('cumple')) detectedOccasion = 'Cumpleaños en familia'
    else if (text.includes('bautiz')) detectedOccasion = 'Bautizo'
    else if (text.includes('comuni')) detectedOccasion = 'Primera Comunión'
    else if (text.includes('gradua')) detectedOccasion = 'Graduación'
    else if (text.includes('aniversario')) detectedOccasion = 'Aniversario'
    else if (text.includes('reuni') || text.includes('carne') || text.includes('familiar'))
      detectedOccasion = 'Reunión familiar'

    // 2. Detect guest count
    const numMatch = text.match(/(\d{2,3})\s*(personas|invitados|familiares|gentes|amigos)?/)
    let detectedGuests = Number(searchFilters.capacity) || 80
    if (numMatch) {
      detectedGuests = Math.min(300, Math.max(15, Number(numMatch[1])))
    } else if (text.includes('íntim') || text.includes('intim') || text.includes('pequeñ')) {
      detectedGuests = 40
    } else if (text.includes('gran') || text.includes('enorme') || text.includes('muchos')) {
      detectedGuests = 180
    }

    // 3. Detect vibe
    let detectedVibe = 'Al aire libre y jardín'
    if (text.includes('elegante') || text.includes('formal') || text.includes('lujo')) {
      detectedVibe = 'Elegante y moderno'
    } else if (text.includes('íntim') || text.includes('intim') || text.includes('cálid') || text.includes('calid')) {
      detectedVibe = 'Cálido y hogareño'
    } else if (text.includes('fiesta') || text.includes('baile') || text.includes('divertid')) {
      detectedVibe = 'Alegre y divertido'
    }

    // 4. Detect requested categories or pick smart defaults
    const detectedCats: string[] = []
    if (text.includes('foto') || text.includes('video')) detectedCats.push('Fotografía')
    if (text.includes('banquete') || text.includes('comida') || text.includes('catering') || text.includes('cena'))
      detectedCats.push('Banquetes')
    if (text.includes('músic') || text.includes('music') || text.includes('dj') || text.includes('banda'))
      detectedCats.push('Música y DJ')
    if (text.includes('flor') || text.includes('ramo')) detectedCats.push('Flores')
    if (text.includes('decor') || text.includes('mesas') || text.includes('luces'))
      detectedCats.push('Decoración')

    const finalCats =
      detectedCats.length > 0
        ? detectedCats
        : detectedOccasion === 'Boda soñada'
          ? ['Banquetes', 'Fotografía', 'Flores', 'Música y DJ']
          : ['Banquetes', 'Música y DJ', 'Decoración']

    // 5. Auto-pick best available space & best available service per category
    const targetDate = searchFilters.dateTime || '2026-12-20T17:00'
    const bestSpace = activeListings
      .filter(
        (l) =>
          l.kind === 'espacio' &&
          (!l.capacity || l.capacity >= detectedGuests) &&
          isListingAvailableOnDate(l.id, targetDate),
      )
      .sort((a, b) => b.rating - a.rating)[0]

    const chosenServiceIds = finalCats
      .map((cat) =>
        activeListings
          .filter(
            (l) =>
              l.kind === 'servicio' &&
              l.category === cat &&
              isListingAvailableOnDate(l.id, targetDate),
          )
          .sort((a, b) => b.rating - a.rating)[0]?.id,
      )
      .filter((id): id is string => Boolean(id))

    setPendingQuoteDraft({
      occasion: detectedOccasion,
      dateTime: targetDate,
      guests: detectedGuests,
      spaceId: bestSpace?.id,
      serviceIds: chosenServiceIds,
      selectedCategories: finalCats,
      vibe: detectedVibe,
      autoAssembled: true,
      notes: `Descripción del cliente: "${raw}"`,
    })
    showToast('✨ Ensamblamos una propuesta a tu medida. ¡Puedes ajustarla como gustes!')
    setRoute('event-builder')
  }

  const goBuildEventWithItem = (item?: ListingItem) => {
    setPendingQuoteDraft((prev) => ({
      occasion: searchFilters.occasion || prev?.occasion || '',
      dateTime: searchFilters.dateTime || prev?.dateTime || '',
      guests: Number(searchFilters.capacity) || prev?.guests || 100,
      spaceId: item?.kind === 'espacio' ? item.id : prev?.spaceId,
      serviceIds:
        item?.kind === 'servicio'
          ? Array.from(new Set([...(prev?.serviceIds ?? []), item.id]))
          : (prev?.serviceIds ?? []),
      notes: prev?.notes || '',
    }))
    setRoute('event-builder')
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email) return
    setContactSent(true)
    showToast('¡Gracias! Recibimos tu mensaje y te responderemos pronto.')
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <main>
      {/* Hero + Buscador (Página 2 y 3 del diagrama) */}
      <section className="hero">
        <img
          className="hero-image"
          src={heroImage}
          alt="Familia y amigos celebrando juntos un evento"
        />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> Momentos en familia. Recuerdos para siempre.
          </p>
          <h1>
            Celebra en familia,
            <br />
            <em>sin límites.</em>
          </h1>
          <p className="hero-description">
            Desde el cumpleaños de los abuelos o el bautizo de los pequeños hasta la boda de tus
            sueños. En Vinka armas tu celebración de forma fácil, cálida y con proveedores de
            confianza.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goBuildEventWithItem()}
              className="btn-vinka inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition cursor-pointer"
            >
              <Wand2 size={17} /> Arma tu evento paso a paso
            </button>
            <button
              type="button"
              onClick={() => setRoute('provider-onboarding')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 px-5 py-3 text-sm font-bold transition cursor-pointer"
            >
              Soy proveedor <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Barra flotante con 2 modos: Buscar | Ensamblar automáticamente */}
        <div
          className="absolute left-[8vw] right-[8vw] bottom-[34px] max-w-[1120px] space-y-2.5"
          style={{ animation: 'vinkaFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both' }}
        >
          <div className="inline-flex rounded-full bg-[#1e140f]/75 backdrop-blur-md p-1 border border-white/15">
            <button
              type="button"
              onClick={() => setSearchMode('buscar')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                searchMode === 'buscar'
                  ? 'bg-white text-[#1e140f] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              🔍 Buscar espacios
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('ensamblar')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                searchMode === 'ensamblar'
                  ? 'bg-[#d4af77] text-[#1e140f] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <Wand2 size={13} /> Describe tu evento y lo ensamblamos
            </button>
          </div>

          {searchMode === 'buscar' ? (
            <form
              className="search-panel !static !left-auto !right-auto !bottom-auto !max-w-none"
              onSubmit={handleSearch}
            >
              <div className="search-field">
                <label htmlFor="landing-datetime">
                  <Calendar size={16} /> Fecha y hora (dd/MM/yyyy &amp; HH:mm)
                </label>
                <input
                  id="landing-datetime"
                  type="datetime-local"
                  value={searchFilters.dateTime}
                  onChange={(e) => setSearchFilters((f) => ({ ...f, dateTime: e.target.value }))}
                />
              </div>
              <div className="search-field">
                <label htmlFor="landing-occasion">
                  <Sparkles size={16} /> ¿Cuál es la ocasión especial?
                </label>
                <input
                  id="landing-occasion"
                  type="text"
                  value={searchFilters.occasion}
                  onChange={(e) => setSearchFilters((f) => ({ ...f, occasion: e.target.value }))}
                  placeholder="Ej. Boda en jardín, cumpleaños 30, cena familiar..."
                />
              </div>
              <div className="search-field">
                <label htmlFor="landing-capacity">
                  <Users size={16} /> Capacidad
                </label>
                <input
                  id="landing-capacity"
                  type="number"
                  min="1"
                  value={searchFilters.capacity}
                  onChange={(e) => setSearchFilters((f) => ({ ...f, capacity: e.target.value }))}
                  placeholder="100"
                />
              </div>
              <button className="search-button" type="submit">
                <Search size={18} />
                <span>Buscar</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleMagicAssemble}
              className="vinka-step-enter flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-[24px] bg-white/98 border border-[#decfc2] p-3 shadow-2xl"
            >
              <div className="flex-1 px-3 py-1">
                <label
                  htmlFor="magic-prompt"
                  className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#a36b42] mb-1"
                >
                  <Wand2 size={14} /> Cuéntanos qué imaginas y Vinka ensambla tu evento en segundos
                </label>
                <input
                  id="magic-prompt"
                  type="text"
                  required
                  value={magicPrompt}
                  onChange={(e) => setMagicPrompt(e.target.value)}
                  placeholder="Ej. Quiero una boda íntima en jardín para 90 personas con banquete, fotografía y flores..."
                  className="w-full bg-transparent text-sm font-semibold text-[#221610] placeholder:text-[#a58f82] outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-vinka inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold shrink-0 cursor-pointer"
              >
                <Sparkles size={16} /> Ensamblar evento
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ¿Cuál es la ocasión especial? -> Conexión directa a Arma tu evento */}
      <section className="bg-[#fdfcfb] border-b border-[#decfc2] py-8 px-[5vw]">
        <div className="max-w-[1300px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2d1d16] mr-2">
              Ocasiones populares:
            </span>
            {eventTypes.slice(0, 6).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSearchFilters((f) => ({ ...f, occasion: type }))
                  setPendingQuoteDraft((prev) => ({
                    occasion: type,
                    dateTime: searchFilters.dateTime || prev?.dateTime || '',
                    guests: Number(searchFilters.capacity) || prev?.guests || 100,
                    spaceId: prev?.spaceId,
                    serviceIds: prev?.serviceIds ?? [],
                    notes: prev?.notes || '',
                  }))
                  setRoute('event-builder')
                }}
                className="rounded-full border border-[#decfc2] bg-[#f7f3ee] hover:bg-[#a36b42] hover:text-white hover:border-[#a36b42] px-3.5 py-1.5 text-xs font-bold text-[#221610] transition cursor-pointer"
              >
                {type}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goBuildEventWithItem()}
            className="text-link !text-[#a36b42]"
          >
            Ir a Arma tu evento <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Vistazo rápido sobre nosotros (Scale Band) */}
      <Reveal>
      <section className="event-scale" id="nosotros" aria-label="Vistazo rápido sobre nosotros">
        <div className="scale-intro">
          <p className="eyebrow dark">
            <span /> Vistazo rápido sobre nosotros
          </p>
          <h2>
            Pequeño o extraordinario,
            <br />
            lo hacemos posible.
          </h2>
        </div>
        <div className="scale-options">
          <article>
            <span>
              <Heart size={22} />
            </span>
            <div>
              <strong>Íntimo &amp; familiar</strong>
              <p>Cenas, aniversarios y momentos con los tuyos en espacios acogedores.</p>
            </div>
          </article>
          <article>
            <span>
              <Sparkles size={22} />
            </span>
            <div>
              <strong>Social &amp; memorable</strong>
              <p>Bodas, XV años, bautizos y cumpleaños con cotización transparente.</p>
            </div>
          </article>
          <article>
            <span>
              <Users size={22} />
            </span>
            <div>
              <strong>Gran formato</strong>
              <p>Producciones completas para cientos de invitados con proveedores verificados.</p>
            </div>
          </article>
        </div>
      </section>
      </Reveal>

      {/* Categorías */}
      <Reveal delayMs={60}>
      <section className="section category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">
              <span /> Explora por categoría
            </p>
            <h2>Todo lo que imaginas, en un solo lugar</h2>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setActiveCategory('Todas')
              setClientTab('descubrir')
              setRoute('client-portal')
            }}
          >
            Ver catálogo completo <ArrowRight size={17} />
          </button>
        </div>
        <div className="categories">
          {categories.slice(0, 6).map((category) => (
            <button
              type="button"
              className={`category ${activeCategory === category.name ? 'active' : ''}`}
              key={category.id}
              onClick={() =>
                setActiveCategory((prev) => (prev === category.name ? 'Todas' : category.name))
              }
            >
              <span className="category-icon" style={{ background: category.tone }}>
                <CategoryIcon name={category.icon} size={25} />
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Negocios Asociados: Fincas y Espacios */}
      <section className="section spaces-section" id="espacios">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">
              <span /> Negocios asociados · Lugares con encanto
            </p>
            <h2>
              {searched && searchFilters.occasion
                ? `Espacios ideales para: ${searchFilters.occasion}`
                : 'Fincas y espacios que cuentan una historia'}
            </h2>
            <p>
              Desde rincones acogedores hasta fincas para grandes celebraciones. Haz clic para ver
              detalles o cotizar.
            </p>
          </div>
          <button
            type="button"
            className="outline-link"
            onClick={() => goBuildEventWithItem()}
          >
            Armar mi evento <ArrowRight size={16} />
          </button>
        </div>

        {filteredSpaces.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#decfc2] p-10 text-center space-y-3 shadow-xs">
            <Trees size={32} className="mx-auto text-[#a36b42]" />
            <h3 className="text-lg font-extrabold text-[#1e140f]">
              Próximamente nuevos espacios verificados
            </h3>
            <p className="text-sm text-[#7d6558] max-w-md mx-auto">
              ¿Tienes una finca, terraza o jardín para eventos? Sé de los primeros anfitriones en
              publicar tu espacio en Vinka.
            </p>
            <button
              type="button"
              onClick={() => setRoute('provider-onboarding')}
              className="btn-vinka px-6 py-2.5 text-xs font-bold cursor-pointer mt-2"
            >
              Registrar mi espacio
            </button>
          </div>
        ) : (
        <div className="space-grid">
          {filteredSpaces.map((space, idx) => {
            const isSaved = favorites.includes(space.id)
            return (
              <Reveal key={space.id} delayMs={idx * 90}>
              <article
                className="space-card h-full"
                onClick={() => openListingDetail(space.id, 'landing')}
              >
                <div className="space-image-wrap">
                  <img src={space.image} alt={space.title} />
                  <span className="card-tag">{space.tag}</span>
                  <button
                    type="button"
                    className={`heart-button ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(space.id)
                    }}
                    aria-label={isSaved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart size={19} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="card-topline">
                  <h3>{space.title}</h3>
                  <span>
                    <Star size={14} fill="currentColor" /> {space.rating}
                  </span>
                </div>
                <p className="location-line">{space.location}</p>
                <p className="capacity-line">
                  Hasta {space.capacity} invitados · {space.reviews} reseñas
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <p className="price !mt-0">
                    <strong>${space.price.toLocaleString('es-MX')}</strong>{' '}
                    <span>{space.priceUnit}</span>
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      goBuildEventWithItem(space)
                    }}
                    className="rounded-lg bg-[#2d1d16]/10 hover:bg-[#2d1d16] text-[#2d1d16] hover:text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    Cotizar
                  </button>
                </div>
              </article>
              </Reveal>
            )
          })}
        </div>
        )}
      </section>

      {/* Testimonio */}
      <Reveal direction="scale">
      <section className="testimonial" id="inspiracion">
        <div className="testimonial-art">
          <span className="arch arch-one" />
          <span className="arch arch-two" />
          <div className="mini-photo">
            <img src={heroImage} alt="" />
          </div>
        </div>
        <div className="testimonial-copy">
          <Flower2 size={28} />
          <blockquote>
            “Queríamos algo íntimo, cálido y muy nuestro. En Vinka encontramos la finca y cada
            proveedor sin sentirnos abrumados.”
          </blockquote>
          <p>
            <strong>Ana &amp; Miguel</strong>
            <span>Boda en Monterrey · Octubre 2025</span>
          </p>
        </div>
      </section>
      </Reveal>

      {/* Negocios Asociados: Proveedores de servicios */}
      <section className="section services-section" id="servicios">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">
              <span /> Talento que hace la diferencia
            </p>
            <h2>Proveedores verificados para cada detalle</h2>
            <p>Profesionales validados por Vinka, elegidos por su creatividad y atención.</p>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setClientTab('descubrir')
              setRoute('client-portal')
            }}
          >
            Descubrir más <ArrowRight size={17} />
          </button>
        </div>
        {filteredServices.length === 0 ? (
          <div className="rounded-3xl bg-[#f7f3ee] border border-[#decfc2] p-10 text-center space-y-3">
            <Sparkles size={30} className="mx-auto text-[#a36b42]" />
            <h3 className="text-lg font-extrabold text-[#1e140f]">
              Estamos sumando a los mejores proveedores
            </h3>
            <p className="text-sm text-[#7d6558] max-w-md mx-auto">
              Fotografía, banquetes, flores, música y decoración. Registra tu servicio y conecta con
              familias listas para celebrar.
            </p>
            <button
              type="button"
              onClick={() => setRoute('provider-onboarding')}
              className="btn-vinka px-6 py-2.5 text-xs font-bold cursor-pointer mt-2"
            >
              Ofrecer mi servicio
            </button>
          </div>
        ) : (
        <div className="service-grid">
          {filteredServices.map((service, idx) => (
            <Reveal key={service.id} delayMs={idx * 80}>
            <article
              className="service-card h-full"
              onClick={() => openListingDetail(service.id, 'landing')}
            >
              <div className="service-image bg-[#efe7de]">
                <img src={service.image} alt={service.title} />
                <span>
                  <CategoryIcon
                    name={
                      categories.find((c) => c.name === service.category)?.icon ?? 'sparkle'
                    }
                    size={18}
                  />
                </span>
              </div>
              <div className="service-content">
                <p className="service-type">{service.category}</p>
                <h3>{service.title}</h3>
                <div className="service-meta">
                  <p>Desde ${service.price.toLocaleString('es-MX')}</p>
                  <span>
                    <Star size={13} fill="currentColor" /> {service.rating}{' '}
                    <small>({service.reviews})</small>
                  </span>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
        )}
      </section>

      {/* Contacto (Página 2 del diagrama) */}
      <Reveal>
      <section className="bg-[#f7f3ee] border-t border-[#decfc2] py-20 px-[5vw]" id="contacto">
        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2 space-y-3">
            <p className="eyebrow dark">
              <span /> Contacto
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#221610]">
              ¿Tienes dudas o un evento a la medida?
            </h2>
            <p className="text-sm text-[#7d6558] leading-relaxed">
              Escríbenos y nuestro equipo de concierge te ayudará a encontrar el espacio perfecto o
              registrar tu negocio en Vinka.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2d1d16]">
              <Mail size={15} /> hola@vinka.mx
            </div>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="md:col-span-3 rounded-2xl bg-white border border-[#decfc2] p-6 shadow-sm space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">Tu nombre</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej. Sofía Garza"
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm outline-none focus:border-[#2d1d16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="sofia@correo.com"
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm outline-none focus:border-[#2d1d16]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#221610] mb-1">
                Cuéntanos sobre tu evento o negocio
              </label>
              <textarea
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Fecha aproximada, invitados o dudas sobre cómo sumarte..."
                className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm outline-none focus:border-[#2d1d16]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#2d1d16] hover:bg-[#422d22] text-white font-bold text-sm py-3 transition cursor-pointer"
            >
              <Send size={15} /> Enviar mensaje
            </button>
            {contactSent && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={16} /> Mensaje enviado correctamente. Te contactaremos muy pronto.
              </div>
            )}
          </form>
        </div>
      </section>
      </Reveal>

      {/* CTA Proveedor */}
      <section className="cta">
        <div>
          <p className="eyebrow">
            <span /> Todo empieza con una idea
          </p>
          <h2>Imagínalo. En Vinka lo hacemos posible.</h2>
          <p>Espacios y profesionales listos para dar vida a eventos de cualquier tamaño.</p>
        </div>
        <button type="button" onClick={() => setRoute('provider-onboarding')}>
          Quiero ser proveedor <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-brand">
          <VinkaLogo />
          <p>Tu familia, tu evento, tu forma de celebrarlo.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Descubre</strong>
            <a href="#espacios">Fincas y Espacios</a>
            <a href="#servicios">Proveedores</a>
            <button type="button" onClick={() => setRoute('event-builder')}>
              Arma tu evento
            </button>
          </div>
          <div>
            <strong>Vinka</strong>
            <a href="#nosotros">Sobre nosotros</a>
            <a href="#inspiracion">Inspiración</a>
            <a href="#contacto">Contacto</a>
          </div>
          <div>
            <strong>Para profesionales</strong>
            <button type="button" onClick={() => setRoute('provider-onboarding')}>
              Publica tu espacio
            </button>
            <button type="button" onClick={() => setRoute('provider-onboarding')}>
              Ofrece tus servicios
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Vinka. Celebramos contigo en México.</span>
          <span>
            <a href="#contacto">Privacidad</a>
            <a href="#contacto">Términos</a>
          </span>
        </div>
      </footer>

      <ListingDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSelectForEvent={(item) => goBuildEventWithItem(item)}
      />
    </main>
  )
}
