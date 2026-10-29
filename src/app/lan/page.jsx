'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
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
  Heart
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

export default function LanMobilePage() {
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
      // Swiped Left -> Next
      setCurrentSlide((prev) => (prev + 1) % VENUES.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      setCurrentSlide((prev) => (prev - 1 + VENUES.length) % VENUES.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Submit quote to existing /api/register
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
    <div style={{
      minHeight: '100vh',
      background: '#F8F6F2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      color: '#221610',
      paddingBottom: '80px' // Space for mobile bottom bar
    }}>

      {/* MOBILE SHELL CONTAINER (Optimized for Smartphone Screens: max-width 480px) */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#FFFFFF',
        minHeight: '100vh',
        boxShadow: '0 0 40px rgba(34, 22, 16, 0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* 1. TOP HEADER WITH PILL LOGIN BUTTON */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(107, 78, 62, 0.1)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Vinka Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/logo-coffee.png" 
              alt="Vinka" 
              style={{ height: '32px', width: 'auto', display: 'block' }} 
            />
          </div>

          {/* PILL LOG IN BUTTON ("botón de pastilla de log in") */}
          <button
            onClick={() => setIsLoginOpen(true)}
            id="btn-pill-login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#221610',
              color: '#FFFFFF',
              border: '1px solid #3A261D',
              padding: '0.55rem 1.25rem',
              borderRadius: '9999px', // Pill shape
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(34, 22, 16, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={15} color="#D4AF77" />
            <span>Log in</span>
          </button>
        </header>

        {/* 2. HERO SECTION */}
        <section style={{ padding: '1.75rem 1.25rem 1.25rem' }}>
          
          {/* Subtle VIP Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#F7F3EE',
            border: '1px solid #E5D9CD',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            color: '#8C6A54',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <Sparkles size={13} color="#A36B42" />
            <span>Locaciones &amp; Servicios en México</span>
          </div>

          {/* User Required Headline: "quieres hacer un evento, entra en vinka.club para empezar a cotizar" */}
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#1E140F',
            letterSpacing: '-0.02em',
            marginBottom: '0.85rem'
          }}>
            ¿Quieres hacer un evento? Entra en{' '}
            <span style={{ 
              color: '#A36B42',
              position: 'relative',
              whiteSpace: 'nowrap'
            }}>
              vinka.club
            </span>{' '}
            para empezar a cotizar.
          </h1>

          <p style={{
            fontSize: '0.94rem',
            color: '#6B4E3E',
            lineHeight: 1.55,
            marginBottom: '1.4rem'
          }}>
            Descubre haciendas, jardines con encanto y rooftops panorámicos. Cotiza en minutos con anfitriones y servicios verificados.
          </p>

          {/* Quick Quotation Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F4ECE1 100%)',
            border: '1px solid #DECFC2',
            borderRadius: '18px',
            padding: '1.25rem',
            boxShadow: '0 4px 18px rgba(34, 22, 16, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#221610',
                color: '#D4AF77',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Compass size={16} />
              </div>
              <h2 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#221610', margin: 0 }}>
                Cotizador Rápido de Experiencia
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#7D6558', display: 'block', marginBottom: '0.3rem' }}>
                  ¿Qué tipo de evento planeas?
                </label>
                <select 
                  value={quoteData.eventType}
                  onChange={(e) => setQuoteData({ ...quoteData, eventType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    border: '1px solid #D5C4B4',
                    background: '#FFFFFF',
                    fontSize: '0.9rem',
                    color: '#221610',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                >
                  <option value="Boda / Celebración">Boda / Matrimonio</option>
                  <option value="Cumpleaños / Aniversario">Cumpleaños / Aniversario</option>
                  <option value="Cena Privada / Coctel">Cena Privada / Coctel</option>
                  <option value="Evento Corporativo / Retiro">Evento Corporativo / Retiro</option>
                  <option value="Sesión Creativa / Producción">Sesión Fotográfica / Filmación</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#7D6558', display: 'block', marginBottom: '0.3rem' }}>
                  Estimado de invitados
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  {['20 - 60', '60 - 150', '150 - 300+'].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setQuoteData({ ...quoteData, guests: `${cap} invitados` })}
                      style={{
                        padding: '0.5rem 0.2rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: '8px',
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
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(34, 22, 16, 0.2)'
                }}
              >
                <span>Cotizar este evento ahora</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* 3. CAROUSEL OF STANDARD MEXICAN EVENT SPACES ("carruzel de imagenes que vayan cambiando") */}
        <section style={{ padding: '0.5rem 1.25rem 2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E140F', margin: 0 }}>
                Lugares Exclusivos en México
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#8C6A54', marginTop: '0.15rem' }}>
                Haciendas, rooftops y jardines curados para ti
              </p>
            </div>

            {/* Slide Counter */}
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#F3ECE4',
              color: '#6B4E3E',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px'
            }}>
              {currentSlide + 1} / {VENUES.length}
            </span>
          </div>

          {/* Carousel Frame */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(34, 22, 16, 0.14)',
              background: '#221610'
            }}
          >
            {/* Image Slide */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
              <img
                src={VENUES[currentSlide].image}
                alt={VENUES[currentSlide].title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.4s ease-in-out'
                }}
              />

              {/* Gradient Scrim for Legibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(15,10,7,0.85) 75%, rgba(15,10,7,0.98) 100%)'
              }} />

              {/* Badge Tag on top of image */}
              <div style={{
                position: 'absolute',
                top: '0.85rem',
                left: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#221610',
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
              }}>
                <Star size={12} color="#A36B42" fill="#A36B42" />
                <span>{VENUES[currentSlide].tag}</span>
              </div>

              {/* Venue Info Overlay Bottom */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                zIndex: 10
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  margin: 0, 
                  color: '#FFFFFF', 
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  letterSpacing: '-0.01em'
                }}>
                  {VENUES[currentSlide].title}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F3ECE4', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    <MapPin size={13} color="#D4AF77" />
                    {VENUES[currentSlide].location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F3ECE4', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    <Users size={13} color="#D4AF77" />
                    {VENUES[currentSlide].capacity}
                  </span>
                </div>

                <p style={{ 
                  fontSize: '0.78rem', 
                  color: '#EBE5DF', 
                  marginTop: '0.45rem', 
                  lineHeight: 1.45, 
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)'
                }}>
                  {VENUES[currentSlide].description}
                </p>
              </div>

              {/* Left / Right Tap Controls */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + VENUES.length) % VENUES.length)}
                aria-label="Anterior"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.6rem',
                  transform: 'translateY(-50%)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#221610',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % VENUES.length)}
                aria-label="Siguiente"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.6rem',
                  transform: 'translateY(-50%)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#221610',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dot Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 0',
              background: '#1A110B'
            }}>
              {VENUES.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '22px' : '7px',
                    height: '7px',
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
        </section>

        {/* 4. INFORMACIÓN DEL SERVICIO ("más información del servicio") */}
        <section style={{ padding: '0 1.25rem 2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A36B42', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Servicio Curado Vinka
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E140F', marginTop: '0.2rem' }}>
              ¿Cómo funciona cotizar con nosotros?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              gap: '0.9rem',
              alignItems: 'flex-start',
              padding: '1rem',
              borderRadius: '16px',
              background: '#FAF7F2',
              border: '1px solid #EFE7DE'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#221610',
                color: '#D4AF77',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#221610', marginBottom: '0.2rem' }}>
                  Elige tu espacio o dinos tu idea
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#6B4E3E', lineHeight: 1.45 }}>
                  Explora haciendas, salones, terrazas o quintas en México verificadas presencialmente por nuestro equipo.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              gap: '0.9rem',
              alignItems: 'flex-start',
              padding: '1rem',
              borderRadius: '16px',
              background: '#FAF7F2',
              border: '1px solid #EFE7DE'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#A36B42',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#221610', marginBottom: '0.2rem' }}>
                  Cotización transparente sin sorpresas
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#6B4E3E', lineHeight: 1.45 }}>
                  Recibe un desglose claro de locación, catering, barra, sonido y mobiliario adaptado exactamente a tus invitados.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              gap: '0.9rem',
              alignItems: 'flex-start',
              padding: '1rem',
              borderRadius: '16px',
              background: '#FAF7F2',
              border: '1px solid #EFE7DE'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#6B4E3E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#221610', marginBottom: '0.2rem' }}>
                  Reserva segura y concierge Vinka
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#6B4E3E', lineHeight: 1.45 }}>
                  Convenio oficial de protección de fechas y acompañamiento directo para que tu día suceda a la perfección.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ¿QUIÉNES SOMOS? ("quienes somos") */}
        <section style={{
          padding: '2rem 1.25rem',
          background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE9 100%)',
          borderTop: '1px solid #EFE7DE',
          borderBottom: '1px solid #EFE7DE'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#A36B42', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            <Heart size={14} fill="#A36B42" />
            <span>NUESTRA HISTORIA &amp; MISIÓN</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E140F', lineHeight: 1.25, marginBottom: '0.85rem' }}>
            ¿Quiénes somos en Vinka?
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#4E392E', lineHeight: 1.6, marginBottom: '0.9rem' }}>
            <strong>Vinka</strong> nace con el propósito de revolucionar la forma en que las personas descubren y reservan lugares para momentos inolvidables en México.
          </p>

          <p style={{ fontSize: '0.86rem', color: '#6B4E3E', lineHeight: 1.55, marginBottom: '1.25rem' }}>
            Sabemos que planear una boda, una fiesta o una reunión empresarial puede ser agotador cuando los precios no son claros o los lugares no cumplen lo que prometen. En Vinka seleccionamos rigurosamente cada propiedad, garantizando fotos reales, contratos formales y un servicio cercano para que solo te preocupes por disfrutar.
          </p>

          {/* Pillars Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#221610' }}>
              <CheckCircle2 size={16} color="#A36B42" />
              <span>Espacios y anfitriones 100% verificados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#221610' }}>
              <CheckCircle2 size={16} color="#A36B42" />
              <span>Sin costos ocultos ni intermediarios abusivos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#221610' }}>
              <CheckCircle2 size={16} color="#A36B42" />
              <span>Asistencia directa por WhatsApp de nuestro equipo</span>
            </div>
          </div>
        </section>

        {/* 6. INFORMACIÓN DE CONTACTO & FORMULARIO DIRECTO ("información de contacto") */}
        <section id="contacto-cotizacion" style={{ padding: '2.25rem 1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A36B42', textTransform: 'uppercase' }}>
              Atención Personalizada
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E140F', marginTop: '0.2rem' }}>
              Empieza tu cotización hoy
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#7D6558', marginTop: '0.25rem' }}>
              Completa tus datos o escríbenos directamente por WhatsApp.
            </p>
          </div>

          {/* Direct WhatsApp Callout Button */}
          <a
            href="https://wa.me/526561234567?text=Hola%20Vinka,%20quiero%20cotizar%20un%20evento%20desde%20vinka.club/lan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#25D366',
              color: '#FFFFFF',
              padding: '0.9rem',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.28)'
            }}
          >
            <MessageCircle size={20} />
            <span>Chatear por WhatsApp con un Asesor</span>
          </a>

          {/* Quick Contact Form */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #DECFC2',
            borderRadius: '18px',
            padding: '1.25rem',
            boxShadow: '0 4px 18px rgba(34, 22, 16, 0.05)'
          }}>
            {quoteSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(163, 107, 66, 0.12)',
                  color: '#A36B42',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#1E140F', fontWeight: 700, marginBottom: '0.4rem' }}>
                  ¡Cotización enviada con éxito!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B4E3E', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Un asesor de Vinka te contactará al teléfono proporcionado para presentarte las mejores opciones disponibles.
                </p>
                <button
                  onClick={() => setQuoteSubmitted(false)}
                  style={{
                    background: '#221610',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cotizar otro evento
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.3rem' }}>
                      Tu Nombre <strong style={{ color: '#dc2626' }}>*</strong>
                    </label>
                    <input 
                      type="text"
                      placeholder="Ej. Sofía Mendoza"
                      required
                      value={quoteData.name}
                      onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.8rem 0.95rem',
                        borderRadius: '10px',
                        border: '1px solid #D5C4B4',
                        background: '#FAF7F4',
                        fontSize: '0.9rem',
                        outline: 'none',
                        color: '#221610'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.3rem' }}>
                      Teléfono de Contacto (WhatsApp) <strong style={{ color: '#dc2626' }}>*</strong>
                    </label>
                    <input 
                      type="tel"
                      placeholder="Ej. 656 123 4567"
                      required
                      value={quoteData.phone}
                      onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.8rem 0.95rem',
                        borderRadius: '10px',
                        border: '1px solid #D5C4B4',
                        background: '#FAF7F4',
                        fontSize: '0.9rem',
                        outline: 'none',
                        color: '#221610'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.3rem' }}>
                      Detalles o dudas específicas (Opcional)
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Fecha tentativa, ciudad en México o servicios requeridos..."
                      value={quoteData.notes}
                      onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '10px',
                        border: '1px solid #D5C4B4',
                        background: '#FAF7F4',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: '#221610',
                        resize: 'none'
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
                      padding: '0.9rem',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(34, 22, 16, 0.25)',
                      opacity: quoteLoading ? 0.7 : 1
                    }}
                  >
                    <span>{quoteLoading ? 'Enviando...' : 'Solicitar Cotización sin Costo'}</span>
                    <Send size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Direct Info Box */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '14px',
            background: '#FAF7F2',
            border: '1px dashed #D5C4B4',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#4E392E' }}>
              <Mail size={15} color="#A36B42" />
              <span><strong>Correo Oficial:</strong> contacto@vinka.club</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#4E392E' }}>
              <Phone size={15} color="#A36B42" />
              <span><strong>Atención Telefónica:</strong> +52 (656) 123-4567</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#4E392E' }}>
              <Clock size={15} color="#A36B42" />
              <span><strong>Horario Concierge:</strong> Lunes a Domingo 9:00 - 20:00</span>
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer style={{
          padding: '1.75rem 1.25rem 2rem',
          background: '#1A110B',
          color: '#E5D9CD',
          textAlign: 'center',
          borderTop: '1px solid #332117'
        }}>
          <img 
            src="/logo-coffee.png" 
            alt="Vinka" 
            style={{ height: '26px', filter: 'brightness(0) invert(1)', opacity: 0.85, margin: '0 auto 0.6rem' }} 
          />
          <p style={{ fontSize: '0.8rem', opacity: 0.8, maxWidth: '300px', margin: '0 auto 0.75rem', lineHeight: 1.4 }}>
            Plataforma oficial de cotización y curaduría de eventos en México.
          </p>
          <div style={{ fontSize: '0.72rem', opacity: 0.55 }}>
            vinka.club/lan &bull; &copy; {new Date().getFullYear()} Vinka. Todos los derechos reservados.
          </div>
        </footer>

        {/* 8. STICKY MOBILE BOTTOM BAR (Thumb accessibility) */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(107, 78, 62, 0.15)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: '#8C6A54', fontWeight: 600 }}>¿Listo para empezar?</span>
            <span style={{ fontSize: '0.92rem', color: '#1E140F', fontWeight: 800 }}>Cotiza en vinka.club</span>
          </div>

          <a
            href="#contacto-cotizacion"
            style={{
              background: '#221610',
              color: '#FFFFFF',
              padding: '0.65rem 1.3rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
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

      </div>

      {/* 9. MODAL DE LOGIN ("botón de pastilla de log in") */}
      {isLoginOpen && (
        <div 
          onClick={() => setIsLoginOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 13, 9, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end', // Bottom sheet on mobile
            justifyContent: 'center',
            zIndex: 200,
            padding: 0
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '1.75rem 1.5rem 2.5rem',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              position: 'relative',
              animation: 'slideUp 0.25s ease-out'
            }}
          >
            {/* Grab handle */}
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
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#FAF7F2',
                border: '1px solid #E5D9CD',
                color: '#A36B42',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <User size={22} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E140F', margin: 0 }}>
                Acceso a Vinka
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#7D6558', marginTop: '0.35rem' }}>
                Ingresa con tu teléfono o correo para gestionar tus cotizaciones y reservas.
              </p>
            </div>

            {loginStep === 'phone' ? (
              <form onSubmit={(e) => { e.preventDefault(); setLoginStep('sent'); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4E392E', display: 'block', marginBottom: '0.35rem' }}>
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
                      padding: '0.9rem',
                      borderRadius: '9999px',
                      fontSize: '0.95rem',
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

                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#8C6A54', marginTop: '0.3rem' }}>
                    Te enviaremos un código de acceso único por WhatsApp o SMS.
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle2 size={36} color="#A36B42" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.1rem', color: '#1E140F', marginBottom: '0.35rem' }}>
                  Código enviado a {loginPhone}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#6B4E3E', marginBottom: '1.25rem' }}>
                  Ingresa el código de 4 dígitos para verificar tu cuenta.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i === 1 ? '7' : ''}
                      style={{
                        width: '46px',
                        height: '52px',
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        border: '1.5px solid #D5C4B4',
                        borderRadius: '10px',
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
                    padding: '0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
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
