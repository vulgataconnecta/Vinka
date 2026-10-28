'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Terminal, 
  Activity, 
  Sliders, 
  Send,
  CloudLightning,
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('vercel');
  const [trafficRequests, setTrafficRequests] = useState(500000);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Dynamic calculations based on traffic slider
  const edgeCachingPercent = Math.min(99.6, (94 + (trafficRequests / 200000)).toFixed(1));
  const estimatedLatency = Math.max(8, (24 - (trafficRequests / 100000)).toFixed(0));
  const savedBandwidth = ((trafficRequests * 0.42) / 1000).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="app-wrapper">
      <div className="bg-grid-overlay" />

      {/* Navigation */}
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#" className="brand">
            <div className="brand-icon">
              <CloudLightning size={22} />
            </div>
            <span>VINKA</span>
          </a>

          <ul className="nav-links">
            <li><a href="#soluciones">Soluciones</a></li>
            <li><a href="#dominio">Vercel & Dominio</a></li>
            <li><a href="#calculadora">Rendimiento</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>

          <div className="nav-actions">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Rama <strong>main</strong> activa</span>
            </div>
            <button 
              id="btn-nav-deploy" 
              className="btn-primary" 
              onClick={() => setShowModal(true)}
            >
              <span>Conectar Vercel</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="badge-pill">
              <Sparkles size={14} />
              <span>Plataforma Vinka &bull; Despliegue en Alta Disponibilidad</span>
            </div>
            <h1 className="hero-title">
              Tecnología & Arquitectura Digital para <span className="gradient-text">Vinka</span>
            </h1>
            <p className="hero-subtitle">
              Plataforma web de última generación optimizada para Vercel Pro. Diseñada para alto rendimiento, 
              latencia mínima y soporte multi-dominio independiente.
            </p>
            <div className="hero-cta">
              <a href="#dominio" className="btn-primary" id="btn-hero-explore">
                <span>Ver Configuración de Dominio</span>
                <ArrowRight size={16} />
              </a>
              <a href="#calculadora" className="btn-secondary" id="btn-hero-calc">
                <Sliders size={16} />
                <span>Simulador de Rendimiento</span>
              </a>
            </div>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="glass-panel hero-preview">
            <div className="preview-header">
              <div className="preview-tabs">
                <button 
                  className={`preview-tab-btn ${activeTab === 'vercel' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vercel')}
                >
                  Infraestructura Vercel
                </button>
                <button 
                  className={`preview-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('metrics')}
                >
                  Métricas Edge
                </button>
                <button 
                  className={`preview-tab-btn ${activeTab === 'git' ? 'active' : ''}`}
                  onClick={() => setActiveTab('git')}
                >
                  Git & CI/CD (main)
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Activity size={15} color="#10b981" />
                <span>Edge Network: Online</span>
              </div>
            </div>

            {activeTab === 'vercel' && (
              <div className="preview-grid">
                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Estado en Vercel</span>
                    <Server size={16} color="#6366f1" />
                  </div>
                  <div className="metric-card-val">Pro Ready</div>
                  <div className="metric-tag">
                    <CheckCircle2 size={13} /> Multi-proyecto habilitado
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Latencia Global</span>
                    <Zap size={16} color="#06b6d4" />
                  </div>
                  <div className="metric-card-val">&lt; 14 ms</div>
                  <div className="metric-tag">
                    <CheckCircle2 size={13} /> CDN Edge Cache Activo
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Dominio Destino</span>
                    <Globe size={16} color="#a855f7" />
                  </div>
                  <div className="metric-card-val" style={{ fontSize: '1.4rem' }}>vinka.com</div>
                  <div className="metric-tag">
                    <CheckCircle2 size={13} /> SSL / TLS Automático
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="preview-grid">
                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Tiempo de Carga</span>
                    <Zap size={16} color="#10b981" />
                  </div>
                  <div className="metric-card-val">0.3s</div>
                  <div className="metric-tag">Lighthouse 99/100</div>
                </div>
                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Compresión Gzip / Brotli</span>
                    <Cpu size={16} color="#6366f1" />
                  </div>
                  <div className="metric-card-val">82% Ahorro</div>
                  <div className="metric-tag">Optimización de assets</div>
                </div>
                <div className="metric-card">
                  <div className="metric-card-title">
                    <span>Uptime Objetivo</span>
                    <ShieldCheck size={16} color="#06b6d4" />
                  </div>
                  <div className="metric-card-val">99.99%</div>
                  <div className="metric-tag">Redundancia multirregión</div>
                </div>
              </div>
            )}

            {activeTab === 'git' && (
              <div className="code-preview-box">
                <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>// Flujo de despliegue automatizado:</div>
                <div><span style={{ color: '#ec4899' }}>git</span> checkout -b main</div>
                <div><span style={{ color: '#ec4899' }}>git</span> add . && <span style={{ color: '#ec4899' }}>git</span> commit -m "feat: initial vinka platform"</div>
                <div><span style={{ color: '#ec4899' }}>git</span> push origin main</div>
                <div style={{ color: '#10b981', marginTop: '0.5rem' }}>✓ Vercel Detecta push en main &rarr; Despliegue automático a producción</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Multi-Domain Vercel Pro Guide Section */}
      <section className="container" id="dominio">
        <div className="domain-banner">
          <div>
            <div className="badge-pill" style={{ marginBottom: '1rem' }}>
              <GitBranch size={14} />
              <span>Vercel Pro Multi-Dominio</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              ¿Cómo conviven tus proyectos <span className="gradient-text">Vulgata Connecta</span> y <span className="gradient-text">Vinka</span>?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              En tu cuenta Vercel Pro puedes tener tantos proyectos y dominios como desees. Cada uno tiene su propio repositorio, 
              sus propias variables de entorno y su propio dominio sin interferir entre sí.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Proyecto 1 (Existente):</span>
                <div style={{ fontWeight: 600, color: '#38bdf8' }}>vulgataconnecta.com</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.4)' }}>
                <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>Proyecto 2 (Nuevo):</span>
                <div style={{ fontWeight: 600, color: '#818cf8' }}>vinka.com (Rama main)</div>
              </div>
            </div>
          </div>

          <div className="domain-steps">
            <div className="domain-step-item">
              <div className="step-num">1</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Importar Repositorio</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  En Vercel haz clic en "Add GitHub Scope" para autorizar el repo de Vinka e importar la rama <code>main</code>.
                </p>
              </div>
            </div>

            <div className="domain-step-item">
              <div className="step-num">2</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Asignar el Dominio Vinka</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Ve a Settings &gt; Domains y añade <code>vinka.com</code> y <code>www.vinka.com</code>.
                </p>
              </div>
            </div>

            <div className="domain-step-item">
              <div className="step-num">3</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Preservar Registros de Correo</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Mantén tus registros MX y TXT para tu correo de Vinka y apunta solo el registro A hacia Vercel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Features */}
      <section className="features-section" id="soluciones">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Capacidades del Ecosistema Vinka</h2>
            <p className="section-desc">
              Arquitectura modular construida para velocidad de desarrollo y rendimiento óptimo en producción.
            </p>
          </div>

          <div className="features-grid">
            <div className="glass-panel feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Vite & React Ultrarrápido</h3>
              <p className="feature-text">
                Carga instantánea de módulos en desarrollo (HMR) y compilación optimizada con chunks ligeros para la mejor experiencia de usuario.
              </p>
            </div>

            <div className="glass-panel feature-card">
              <div className="feature-icon-wrapper" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <Globe size={24} />
              </div>
              <h3 className="feature-title">Edge Network Global</h3>
              <p className="feature-text">
                Despliegue automático a más de 100 ubicaciones globales mediante la red CDN de Vercel para servir contenido a milisegundos de tus usuarios.
              </p>
            </div>

            <div className="glass-panel feature-card">
              <div className="feature-icon-wrapper" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-title">Certificados SSL & Seguridad</h3>
              <p className="feature-text">
                Cifrado automático TLS/SSL provisto y renovado automáticamente sin requerir intervención manual ni configuraciones complejas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Traffic & Performance Calculator */}
      <section className="calculator-section" id="calculadora">
        <div className="container">
          <div className="glass-panel calculator-card">
            <div>
              <div className="badge-pill" style={{ marginBottom: '0.8rem' }}>
                <Sliders size={14} />
                <span>Simulador de Rendimiento Vinka</span>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>
                Estima la capacidad de tu nuevo sitio
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Ajusta el volumen de peticiones mensuales estimadas para ver la eficiencia de la infraestructura.
              </p>

              <div className="range-slider-group">
                <div className="range-label">
                  <span>Peticiones Mensuales Estimadas:</span>
                  <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    {trafficRequests.toLocaleString()} req/mes
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="2000000" 
                  step="50000"
                  value={trafficRequests}
                  onChange={(e) => setTrafficRequests(Number(e.target.value))}
                  className="range-slider"
                  id="traffic-slider"
                />
              </div>
            </div>

            <div className="calc-result-box">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                EFICIENCIA EDGE ESTIMADA
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                {edgeCachingPercent}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
                Tasa de acierto de caché global (Edge Cache Hit)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Latencia Media</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>~{estimatedLatency} ms</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ancho de Banda Ahorrado</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a855f7' }}>{savedBandwidth} GB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contacto">
        <div className="container">
          <div className="glass-panel contact-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>¿Listo para dar el siguiente paso?</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Envía tus requerimientos o dudas técnicas para tu dominio y página de Vinka.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Nombre o Empresa</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  className="form-input" 
                  placeholder="Tu nombre o equipo Vinka"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Correo Electrónico (Vinka)</label>
                <input 
                  type="email" 
                  id="contact-email" 
                  className="form-input" 
                  placeholder="contacto@vinka.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Mensaje o Detalles del Proyecto</label>
                <textarea 
                  id="contact-message" 
                  className="form-textarea" 
                  rows="4" 
                  placeholder="¿Qué funcionalidades necesitas para Vinka?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} id="btn-submit-contact">
                <Send size={16} />
                <span>Enviar Información</span>
              </button>
            </form>

            {submitted && (
              <div className="toast-success">
                <CheckCircle2 size={20} />
                <span>¡Mensaje recibido con éxito! La configuración de Vinka está lista para avanzar.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Setup Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="glass-panel" 
            style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#0e1322' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloudLightning size={20} color="#6366f1" />
              <span>Conectar Vinka a Vercel</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              El proyecto local ya está configurado con Next.js y listo para producción en la rama <strong>main</strong>.
            </p>
            <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              <li>Sube este repositorio a tu GitHub de Vinka.</li>
              <li>En Vercel Pro, importa el repositorio <strong>vulgataconnecta/Vinka</strong>.</li>
              <li>Configura tu dominio en <strong>Settings &gt; Domains</strong>.</li>
            </ol>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowModal(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Vinka Platform</span> &copy; {new Date().getFullYear()} &bull; Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>Infraestructura Next.js &bull; Vercel Pro</span>
            <span>&bull;</span>
            <span style={{ color: 'var(--accent-emerald)' }}>● Sistema Activo en Local</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
