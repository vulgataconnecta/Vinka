'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './lan.css';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  User, 
  X, 
  ArrowRight,
  Compass,
  Star,
  Clock,
  Heart,
  ShieldCheck,
  Calendar
} from 'lucide-react';

const VENUES = [
  {
    id: 'hacienda',
    title: 'Hacienda San Agustín',
    location: 'San Miguel de Allende, Gto.',
    tag: 'Colonial & Histórico',
    capacity: '80 - 350 personas',
    image: '/venues/hacienda.jpg',
    description: 'Patios de cantera virreinal, fuentes iluminadas y fuentes históricas rodeadas de bugambilias centenarias.'
  },
  {
    id: 'rooftop',
    title: 'Terraza Panorama Reforma',
    location: 'Ciudad de México (CDMX)',
    tag: 'Rooftop & Coctelería',
    capacity: '40 - 180 personas',
    image: '/venues/rooftop.jpg',
    description: 'Vistas panorámicas hacia los rascacielos y atardeceres dorados con lounge moderno y fogateros de diseño.'
  },
  {
    id: 'jardin',
    title: 'Jardín Quinta Las Bugambilias',
    location: 'Cuernavaca, Morelos',
    tag: 'Jardín con Luces & Alberca',
    capacity: '100 - 400 personas',
    image: '/venues/jardin.jpg',
    description: 'Árboles ancestrales cubiertos de miles de micro-luces cálidas, senderos de piedra y clima privilegiado.'
  },
  {
    id: 'villa',
    title: 'Villa & Viñedo Cava Dorada',
    location: 'Valle de Guadalupe, B.C.',
    tag: 'Viñedo & Diseño Moderno',
    capacity: '50 - 250 personas',
    image: '/venues/villa.jpg',
    description: 'Arquitectura sobria en adobe y cristal con terrazas abiertas a los valles y atardeceres de viñedos.'
  }
];

export default function LanResponsivePage() {
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Modals & UI State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' | 'sent'
  const [loginPhone, setLoginPhone] = useState('');

  // Quotation form
  const [quoteData, setQuoteData] = useState({
    name: '',
    phone: '',
    eventType: 'Boda / Celebración',
    guests: '50-100 invitados',
    notes: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VENUES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handle Swipe for Carousel
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => (prev + 1) % VENUES.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => (prev - 1 + VENUES.length) % VENUES.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Submit quote to /api/register
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteData.name || !quoteData.phone) return;

    setQuoteLoading(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'cotizacion_vinka_lan',
          name: quoteData.name,
          phone: quoteData.phone,
          category: quoteData.eventType,
          notes: `Invitados: ${quoteData.guests} | Notas: ${quoteData.notes || 'Sin notas'}`
        })
      });
      setQuoteSubmitted(true);
    } catch (err) {
      console.error('Error submitting quote:', err);
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="lan-page">
      <div className="lan-bg-ambient" />

      {/* 1. TOP HEADER WITH PILL LOGIN BUTTON */}
      <header className="lan-header">
        <div className="lan-wrapper lan-header-inner">
          {/* Vinka Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/logo-coffee.png" 
              alt="Vinka" 
              style={{ height: '34px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* Pill Log In Button */}
          <button
            onClick={() => setIsLoginOpen(true)}
            id="btn-pill-login"
            className="lan-pill-btn"
          >
            <User size={15} color="#D4AF77" />
            <span>Log in</span>
          </button>
        </div>
      </header>

      {/* 2. HERO & CAROUSEL SECTION (1 Column on Mobile, 2 Columns on Desktop 16:9) */}
      <section className="lan-wrapper">
        <div className="hero-carousel-grid">
          
          {/* Left Column: Main Message & Interactive Quotation Widget */}
          <div className="hero-left-col">
            <div className="hero-badge">
              <Sparkles size={14} color="#A36B42" />
              <span>Locaciones &amp; Servicios de Autor en México</span>
            </div>

            {/* Headline as requested: "quieres hacer un evento, entra en vinka.club para empezar a cotizar" */}
            <h1 className="hero-title">
              ¿Quieres hacer un evento? Entra en{' '}
              <span className="highlight">vinka.club</span>{' '}
              para empezar a cotizar.
            </h1>

            <p className="hero-subtitle">
              Descubre haciendas coloniales, terrazas con vista panorámica y jardines iluminados. Cotiza en minutos con anfitriones y servicios verificados sin intermediarios innecesarios.
            </p>

            {/* Quick Quotation Card */}
            <div className="quote-widget">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#221610',
                  color: '#D4AF77',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compass size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#221610', margin: 0 }}>
                    Cotizador Rápido de Experiencia
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#7D6558' }}>Respuesta estimada en menos de 2 horas</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B4E3E', display: 'block', marginBottom: '0.35rem' }}>
                    ¿Qué tipo de evento planeas?
                  </label>
                  <select 
                    value={quoteData.eventType}
                    onChange={(e) => setQuoteData({ ...quoteData, eventType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #D5C4B4',
                      background: '#FFFFFF',
                      fontSize: '0.92rem',
                      color: '#221610',
                      fontWeight: 500,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Boda / Celebración">Boda / Matrimonio</option>
                    <option value="Cumpleaños / Aniversario">Cumpleaños / Aniversario</option>
                    <option value="Cena Privada / Coctel">Cena Privada / Coctel Exclusivo</option>
                    <option value="Evento Corporativo / Retiro">Evento Corporativo / Retiro</option>
                    <option value="Sesión Creativa / Producción">Sesión Fotográfica / Filmación</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B4E3E', display: 'block', marginBottom: '0.35rem' }}>
                    Estimado de invitados
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {['20 - 60', '60 - 150', '150 - 300+'].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setQuoteData({ ...quoteData, guests: `${cap} invitados` })}
                        style={{
                          padding: '0.6rem 0.2rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          borderRadius: '10px',
                          border: quoteData.guests.includes(cap) ? '1.5px solid #221610' : '1px solid #DECFC2',
                          background: quoteData.guests.includes(cap) ? '#221610' : '#FFFFFF',
                          color: quoteData.guests.includes(cap) ? '#FFFFFF' : '#4E392E',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href="#contacto-cotizacion"
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #A36B42 0%, #221610 100%)',
                    color: '#FFFFFF',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(34, 22, 16, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Cotizar este evento ahora</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Responsive Image Carousel */}
          <div className="hero-right-col">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E140F', margin: 0 }}>
                  Lugares Destacados en México
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#8C6A54', marginTop: '0.15rem' }}>
                  Haciendas, rooftops y jardines con disponibilidad
                </p>
              </div>

              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                background: '#F3ECE4',
                color: '#6B4E3E',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px'
              }}>
                {currentSlide + 1} / {VENUES.length}
              </span>
            </div>

            <div 
              className="carousel-card"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="carousel-viewport">
                <img
                  src={VENUES[currentSlide].image}
                  alt={VENUES[currentSlide].title}
                  className="carousel-img"
                />

                <div className="carousel-scrim" />

                <div className="carousel-badge-top">
                  <Star size={12} color="#A36B42" fill="#A36B42" />
                  <span>{VENUES[currentSlide].tag}</span>
                </div>

                <div className="carousel-info-bottom">
                  <h3 className="carousel-title">
                    {VENUES[currentSlide].title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', fontSize: '0.84rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F3ECE4', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      <MapPin size={14} color="#D4AF77" />
                      {VENUES[currentSlide].location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F3ECE4', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      <Users size={14} color="#D4AF77" />
                      {VENUES[currentSlide].capacity}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '0.82rem', 
                    color: '#EBE5DF', 
                    marginTop: '0.45rem', 
                    lineHeight: 1.45, 
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                    maxWidth: '90%'
                  }}>
                    {VENUES[currentSlide].description}
                  </p>
                </div>

                {/* Left & Right Navigation Buttons */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + VENUES.length) % VENUES.length)}
                  aria-label="Anterior"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0.85rem',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#221610',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease',
                    zIndex: 20
                  }}
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % VENUES.length)}
                  aria-label="Siguiente"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.85rem',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#221610',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease',
                    zIndex: 20
                  }}
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Dot Indicators */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 0',
                background: '#1A110B'
              }}>
                {VENUES.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: currentSlide === idx ? '26px' : '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      background: currentSlide === idx ? '#D4AF77' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    aria-label={`Ir al lugar ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SERVICIOS ("más información del servicio") */}
      <section className="services-section">
        <div className="lan-wrapper">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#A36B42', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Servicio Curado Vinka
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1E140F', marginTop: '0.35rem' }}>
              ¿Cómo funciona cotizar con nosotros?
            </h2>
            <p style={{ color: '#7D6558', fontSize: '0.95rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Simplificamos la logística compleja de coordinar locación, comida, barra y música en una experiencia fluida.
            </p>
          </div>

          <div className="services-grid">
            {/* Step 1 */}
            <div className="service-card">
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#221610',
                color: '#D4AF77',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.05rem',
                marginBottom: '1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#221610', marginBottom: '0.45rem' }}>
                Elige tu espacio o dinos tu idea
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6B4E3E', lineHeight: 1.55 }}>
                Explora haciendas históricas, salones contemporáneos, terrazas panorámicas o quintas en México auditadas presencialmente por nuestro equipo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="service-card">
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#A36B42',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.05rem',
                marginBottom: '1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#221610', marginBottom: '0.45rem' }}>
                Cotización transparente sin sorpresas
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6B4E3E', lineHeight: 1.55 }}>
                Recibe un desglose claro y detallado de costos de locación, banquetes, barra, sonido y mobiliario adaptado exactamente al número de tus invitados.
              </p>
            </div>

            {/* Step 3 */}
            <div className="service-card">
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#6B4E3E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.05rem',
                marginBottom: '1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#221610', marginBottom: '0.45rem' }}>
                Reserva segura y concierge Vinka
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6B4E3E', lineHeight: 1.55 }}>
                Convenio oficial de protección de fechas, depósitos seguros y un asesor dedicado que te acompaña antes y durante la realización de tu evento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ¿QUIÉNES SOMOS? & INFORMACIÓN DE CONTACTO (1 Col Mobile, 2 Col Desktop 16:9) */}
      <section className="about-contact-section" id="contacto-cotizacion">
        <div className="lan-wrapper">
          <div className="about-contact-grid">
            
            {/* Left: ¿Quiénes somos? */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#A36B42', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                <Heart size={15} fill="#A36B42" />
                <span>NUESTRA VISIÓN &amp; HISTORIA</span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E140F', lineHeight: 1.25, marginBottom: '1.25rem' }}>
                ¿Quiénes somos en Vinka?
              </h2>

              <p style={{ fontSize: '0.98rem', color: '#4E392E', lineHeight: 1.65, marginBottom: '1rem' }}>
                <strong>Vinka</strong> nace con el propósito de transformar de raíz la manera en que las personas y empresas descubren, eligen y reservan espacios para momentos memorables en México.
              </p>

              <p style={{ fontSize: '0.92rem', color: '#6B4E3E', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Sabemos que planear un evento puede ser agotador cuando los precios no son transparentes o las locaciones no cumplen lo prometido. En Vinka seleccionamos personalmente cada propiedad, asegurando fotos auténticas de alta resolución, contratos formales y un servicio de concierge cercano para que tu celebración sea perfecta.
              </p>

              {/* Pillars list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem', fontWeight: 600, color: '#221610' }}>
                  <CheckCircle2 size={18} color="#A36B42" />
                  <span>Espacios, quintas y salones auditados en persona</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem', fontWeight: 600, color: '#221610' }}>
                  <CheckCircle2 size={18} color="#A36B42" />
                  <span>Sin tarifas ocultas ni cotizaciones confusas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem', fontWeight: 600, color: '#221610' }}>
                  <CheckCircle2 size={18} color="#A36B42" />
                  <span>Acompañamiento directo por WhatsApp y soporte telefónico</span>
                </div>
              </div>

              {/* Contact Direct Info Box */}
              <div style={{
                marginTop: '2rem',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid #DECFC2',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#4E392E' }}>
                  <Mail size={16} color="#A36B42" />
                  <span><strong>Correo Oficial:</strong> contacto@vinka.club</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#4E392E' }}>
                  <Phone size={16} color="#A36B42" />
                  <span><strong>Atención Telefónica:</strong> +52 (656) 123-4567</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#4E392E' }}>
                  <Clock size={16} color="#A36B42" />
                  <span><strong>Horario Concierge:</strong> Lunes a Domingo 9:00 - 20:00 (Hora México)</span>
                </div>
              </div>
            </div>

            {/* Right: Contact Form & WhatsApp Action */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#A36B42', textTransform: 'uppercase' }}>
                  Contacto Inmediato
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1E140F', marginTop: '0.2rem' }}>
                  Solicita tu cotización personalizada
                </h3>
              </div>

              {/* Direct WhatsApp Button */}
              <a
                href="https://wa.me/526561234567?text=Hola%20Vinka,%20quiero%20cotizar%20un%20evento%20desde%20vinka.club/lan"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '14px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.28)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <MessageCircle size={22} />
                <span>Chatear por WhatsApp con un Asesor Vinka</span>
              </a>

              {/* Contact Form Box */}
              <div className="contact-form-box">
                {quoteSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(163, 107, 66, 0.12)',
                      color: '#A36B42',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 style={{ fontSize: '1.35rem', color: '#1E140F', fontWeight: 700, marginBottom: '0.5rem' }}>
                      ¡Cotización enviada con éxito!
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: '#6B4E3E', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      Un asesor de Vinka revisará tus datos y se comunicará al teléfono proporcionado con una propuesta a la medida.
                    </p>
                    <button
                      onClick={() => setQuoteSubmitted(false)}
                      style={{
                        background: '#221610',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cotizar otro evento
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.4rem' }}>
                          Tu Nombre o Razón Social <strong style={{ color: '#dc2626' }}>*</strong>
                        </label>
                        <input 
                          type="text"
                          placeholder="Ej. Mariana González"
                          required
                          value={quoteData.name}
                          onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid #D5C4B4',
                            background: '#FAF7F4',
                            fontSize: '0.92rem',
                            outline: 'none',
                            color: '#221610'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.4rem' }}>
                            Teléfono (WhatsApp) <strong style={{ color: '#dc2626' }}>*</strong>
                          </label>
                          <input 
                            type="tel"
                            placeholder="Ej. (656) 123-4567"
                            required
                            value={quoteData.phone}
                            onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.85rem 1rem',
                              borderRadius: '12px',
                              border: '1px solid #D5C4B4',
                              background: '#FAF7F4',
                              fontSize: '0.92rem',
                              outline: 'none',
                              color: '#221610'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.4rem' }}>
                            Tipo de Celebración
                          </label>
                          <select 
                            value={quoteData.eventType}
                            onChange={(e) => setQuoteData({ ...quoteData, eventType: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.85rem 1rem',
                              borderRadius: '12px',
                              border: '1px solid #D5C4B4',
                              background: '#FAF7F4',
                              fontSize: '0.92rem',
                              outline: 'none',
                              color: '#221610'
                            }}
                          >
                            <option value="Boda / Celebración">Boda / Matrimonio</option>
                            <option value="Cumpleaños / Aniversario">Cumpleaños / Aniversario</option>
                            <option value="Cena Privada / Coctel">Cena Privada / Coctel</option>
                            <option value="Evento Corporativo / Retiro">Evento Corporativo</option>
                            <option value="Sesión Creativa / Producción">Sesión Fotográfica</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.4rem' }}>
                          Detalles o requerimientos especiales (Opcional)
                        </label>
                        <textarea 
                          rows={3}
                          placeholder="Ciudad en México, fecha estimada, número de invitados o servicios adicionales que te gustaría cotizar..."
                          value={quoteData.notes}
                          onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid #D5C4B4',
                            background: '#FAF7F4',
                            fontSize: '0.9rem',
                            outline: 'none',
                            color: '#221610',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={quoteLoading}
                        style={{
                          background: '#221610',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '0.95rem',
                          borderRadius: '12px',
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 16px rgba(34, 22, 16, 0.25)',
                          opacity: quoteLoading ? 0.7 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{quoteLoading ? 'Enviando información...' : 'Solicitar Cotización sin Costo'}</span>
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer style={{
        padding: '2.5rem 0',
        background: '#1A110B',
        color: '#E5D9CD',
        borderTop: '1px solid #332117'
      }}>
        <div className="lan-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img 
            src="/logo-coffee.png" 
            alt="Vinka" 
            style={{ height: '30px', filter: 'brightness(0) invert(1)', opacity: 0.9, marginBottom: '0.85rem' }} 
          />
          <p style={{ fontSize: '0.88rem', opacity: 0.8, maxWidth: '420px', lineHeight: 1.5, marginBottom: '1rem' }}>
            La plataforma definitiva para explorar y rentar locaciones de primer nivel y cotizar eventos sin fricción en México.
          </p>
          <div style={{ fontSize: '0.78rem', opacity: 0.55 }}>
            vinka.club/lan &bull; &copy; {new Date().getFullYear()} Vinka Platform. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* 6. MOBILE STICKY BOTTOM BAR (Visible only on mobile devices) */}
      <div className="mobile-sticky-bar">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C6A54', fontWeight: 600 }}>¿Listo para empezar?</span>
          <span style={{ fontSize: '0.92rem', color: '#1E140F', fontWeight: 800 }}>Cotiza en vinka.club</span>
        </div>

        <a
          href="#contacto-cotizacion"
          style={{
            background: '#221610',
            color: '#FFFFFF',
            padding: '0.65rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.86rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 3px 10px rgba(34, 22, 16, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>Cotizar</span>
          <ArrowRight size={14} />
        </a>
      </div>

      {/* 7. MODAL DE LOGIN (Bottom sheet on mobile, Centered dialog on desktop) */}
      {isLoginOpen && (
        <div 
          className="login-modal-overlay"
          onClick={() => setIsLoginOpen(false)}
        >
          <div 
            className="login-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle for mobile */}
            <div style={{
              width: '40px',
              height: '4px',
              background: '#D5C4B4',
              borderRadius: '2px',
              margin: '0 auto 1.25rem'
            }} />

            {/* Close Button */}
            <button
              onClick={() => setIsLoginOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F3ECE4',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4E392E',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Content */}
            <div style={{ textAlign: 'center', marginBottom: '1.35rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#FAF7F2',
                border: '1px solid #E5D9CD',
                color: '#A36B42',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <User size={24} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E140F', margin: 0 }}>
                Acceso a Vinka
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#7D6558', marginTop: '0.35rem' }}>
                Ingresa con tu teléfono o correo para gestionar tus cotizaciones y reservas.
              </p>
            </div>

            {loginStep === 'phone' ? (
              <form onSubmit={(e) => { e.preventDefault(); setLoginStep('sent'); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.4rem' }}>
                      Número de Teléfono / WhatsApp
                    </label>
                    <input 
                      type="tel"
                      placeholder="Ej. (656) 123-4567"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #D5C4B4',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#221610',
                        background: '#FAF7F4'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: '#221610',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.95rem',
                      borderRadius: '9999px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(34, 22, 16, 0.25)'
                    }}
                  >
                    <span>Continuar</span>
                    <ArrowRight size={16} />
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8C6A54', marginTop: '0.3rem' }}>
                    Te enviaremos un código de acceso único por WhatsApp o SMS.
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle2 size={38} color="#A36B42" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.15rem', color: '#1E140F', marginBottom: '0.35rem' }}>
                  Código enviado a {loginPhone}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#6B4E3E', marginBottom: '1.5rem' }}>
                  Ingresa el código de 4 dígitos para verificar tu cuenta.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i === 1 ? '7' : ''}
                      style={{
                        width: '48px',
                        height: '54px',
                        textAlign: 'center',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        border: '1.5px solid #D5C4B4',
                        borderRadius: '12px',
                        background: '#FAF7F4',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    alert('Sesión iniciada correctamente. Bienvenido a Vinka.');
                    setIsLoginOpen(false);
                    setLoginStep('phone');
                  }}
                  style={{
                    width: '100%',
                    background: '#221610',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Entrar a mi Panel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
