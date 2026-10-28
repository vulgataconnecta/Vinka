'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  SlidersHorizontal,
  Mail,
  Send,
  Compass
} from 'lucide-react';

const FORMS = {
  client: {
    id: 'client',
    title: 'Encuesta para Clientes & Organizadores',
    subtitle: 'Cuéntanos qué buscas en tus próximas experiencias y eventos',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfQoY3ulQ8sEMITxmgu2s78fW1nQSMf1ToCOqxUkU0aRX7b5A/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfQoY3ulQ8sEMITxmgu2s78fW1nQSMf1ToCOqxUkU0aRX7b5A/viewform?embedded=true'
  },
  provider: {
    id: 'provider',
    title: 'Encuesta para Proveedores & Anfitriones',
    subtitle: 'Forma parte de la red selecta de locaciones y servicios Vinka',
    url: 'https://docs.google.com/forms/d/1dODVoeqh_H2N9XzgTP_0YzVG2LLb9nrTH3vCHbznDHs/viewform',
    embedUrl: 'https://docs.google.com/forms/d/1dODVoeqh_H2N9XzgTP_0YzVG2LLb9nrTH3vCHbznDHs/viewform?embedded=true'
  }
};

export default function ComingSoon() {
  const [activeModal, setActiveModal] = useState(null); // 'client' | 'provider' | null
  const [emailWaitlist, setEmailWaitlist] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!emailWaitlist) return;
    setWaitlistDone(true);
    setTimeout(() => {
      setEmailWaitlist('');
    }, 4000);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-ambient-pattern" />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Centered Logo */}
            <div className="hero-emblem-wrapper">
              <img 
                src="/logo-coffee.png" 
                alt="Vinka" 
                className="hero-main-logo"
              />
            </div>

            {/* Centered Badge below image */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.75rem' }}>
              <div className="hero-badge-tag" style={{ margin: 0 }}>
                <Sparkles size={14} color="#A36B42" />
                <span>El nuevo estándar en experiencias &amp; locaciones</span>
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="hero-title">
              Descubre espacios únicos y organiza momentos <span className="highlight">memorables</span>.
            </h1>

            {/* Hero Subtitle */}
            <p className="hero-subtitle">
              Vinka esta preparando la plataforma definitiva para explorar y rentar locaciones, proveedores y servicios de primer nivel y disfrutar de reservas sin fricción.
            </p>
          </div>
        </section>

        {/* Dual Cards Section: Clientes & Proveedores (Centered) */}
        <section className="cards-section" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 1.5rem' }}>
          <div className="cards-grid">
            {/* Card Clientes */}
            <div className="action-card">
              <div className="card-top-decor" />
              <div>
                <div className="card-icon-bubble">
                  <Compass size={28} />
                </div>
                <div className="card-label">Para Clientes &amp; Organizadores</div>
                <h3 className="card-title">¿Buscas el lugar ideal para tu evento?</h3>
                <p className="card-desc">
                  Bodas, retiros, sesiones creativas, celebraciones privadas o reuniones corporativas. 
                  Ayúdanos con 2 minutos de tu opinión para diseñar tu plataforma soñada y obtén beneficios de preventa.
                </p>

                <ul className="card-features-list">
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>Acceso preferencial en el día del lanzamiento</span>
                  </li>
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>Descuentos y tarifas de miembro fundador</span>
                  </li>
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>Recomendaciones personalizadas según tu evento</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  className="btn-coffee-primary" 
                  onClick={() => setActiveModal('client')}
                  id="btn-survey-client"
                >
                  <span>Responder Encuesta de Clientes</span>
                  <ArrowRight size={18} />
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                  <a 
                    href={FORMS.client.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-external-form"
                  >
                    <span>Abrir formulario en otra pestaña</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card Proveedores */}
            <div className="action-card">
              <div className="card-top-decor provider" />
              <div>
                <div className="card-icon-bubble">
                  <Building2 size={28} />
                </div>
                <div className="card-label">Para Anfitriones &amp; Proveedores</div>
                <h3 className="card-title">¿Tienes un espacio o servicio que ofrecer?</h3>
                <p className="card-desc">
                  Si eres propietario de una finca, terraza, jardín, villa o proveedor de catering, 
                  música, fotografía o mobiliario, sé parte de la red curada de aliados oficiales de Vinka.
                </p>

                <ul className="card-features-list">
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>0% de comisión durante los primeros 3 meses</span>
                  </li>
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>Posicionamiento destacado en búsquedas y categorías</span>
                  </li>
                  <li className="card-feature-item">
                    <CheckCircle2 size={18} />
                    <span>Pagos protegidos y calendario automatizado</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  className="btn-coffee-primary" 
                  style={{ background: 'var(--coffee-rich)' }}
                  onClick={() => setActiveModal('provider')}
                  id="btn-survey-provider"
                >
                  <span>Encuesta para Proveedores</span>
                  <ArrowRight size={18} />
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                  <a 
                    href={FORMS.provider.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-external-form"
                  >
                    <span>Abrir formulario en otra pestaña</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Vinka Will Offer */}
        <section className="features-preview-section">
          <div className="container">
            <div className="section-intro">
              <h2>Lo que estamos preparando para ti</h2>
              <p>Una experiencia diseñada hasta el último detalle para simplificar cada etapa de tu evento.</p>
            </div>

            <div className="preview-grid">
              <div className="preview-box">
                <div className="preview-icon">
                  <MapPin size={22} />
                </div>
                <h4 className="preview-title">Catálogo Curado estilo Airbnb</h4>
                <p className="preview-text">
                  Filtra por tipo de evento, número de invitados, ambiente y amenidades. Con fotos reales de alta resolución y especificaciones claras.
                </p>
              </div>

              <div className="preview-box">
                <div className="preview-icon">
                  <SlidersHorizontal size={22} />
                </div>
                <h4 className="preview-title">Armador Inteligente de Eventos</h4>
                <p className="preview-text">
                  Combina el alquiler del lugar con banquete, sonido y mobiliario en una sola cotización transparente y con sugerencias a tu medida.
                </p>
              </div>

              <div className="preview-box">
                <div className="preview-icon">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="preview-title">Pagos Seguros &amp; Automatizados</h4>
                <p className="preview-text">
                  Reserva con tarjeta o transferencia mediante pasarela protegida. Olvídate de anticipos dudosos y contratos informales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Subscription Section */}
        <section className="container" style={{ padding: '5rem 0 3rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '580px', width: '100%', background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem', background: 'var(--bg-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-caramel)' }}>
              <Mail size={22} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>Sé el primero en enterarte</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Déjanos tu correo para recibir una invitación anticipada cuando abramos las puertas de Vinka.
            </p>

            <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input 
                type="email" 
                placeholder="tu.correo@ejemplo.com"
                value={emailWaitlist}
                onChange={(e) => setEmailWaitlist(e.target.value)}
                required
                style={{
                  flex: '1 1 240px',
                  padding: '0.9rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-card)',
                  background: 'var(--bg-soft)',
                  color: 'var(--text-title)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn-coffee-primary"
                style={{ flex: '0 0 auto', width: 'auto', padding: '0.9rem 1.75rem' }}
              >
                <span>Notificarme</span>
                <Send size={15} />
              </button>
            </form>

            {waitlistDone && (
              <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(184, 139, 74, 0.12)', border: '1px solid var(--coffee-latte)', borderRadius: 'var(--radius-sm)', color: 'var(--coffee-deep)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#A36B42" />
                <span>¡Gracias! Te agregamos a la lista prioritaria de Vinka.</span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/logo-coffee.png" 
            alt="Vinka" 
            className="footer-logo"
          />
          <p className="footer-text">
            Conectando espacios únicos con personas que crean momentos extraordinarios.
          </p>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Vinka &bull; Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Modal for Google Forms Embed */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <img src="/logo-coffee.png" alt="Vinka" style={{ height: '24px', width: 'auto' }} />
                <div>
                  <h3>{FORMS[activeModal].title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {FORMS[activeModal].subtitle}
                  </div>
                </div>
              </div>
              <button 
                className="btn-close-modal" 
                onClick={() => setActiveModal(null)}
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <iframe 
                src={FORMS[activeModal].embedUrl}
                className="modal-iframe"
                title={FORMS[activeModal].title}
              >
                Cargando formulario...
              </iframe>
            </div>

            <div className="modal-footer">
              <span>Tu respuesta nos ayuda a construir la mejor experiencia.</span>
              <a 
                href={FORMS[activeModal].url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-external-form"
              >
                <span>Abrir en ventana completa</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
