'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Download, 
  Phone, 
  Mail, 
  User, 
  Tag, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function RegistroProveedorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Locación / Finca / Jardín',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Por favor completa todos los campos requeridos (nombre, correo y teléfono).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'registro_proveedor',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          notes: formData.notes
        })
      });

      if (!res.ok) {
        throw new Error('Error al registrar la información');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Locación / Finca / Jardín',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Hubo un inconveniente al enviar tus datos. Por favor inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <div className="bg-ambient-pattern" />

      {/* Top Navbar */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(253, 252, 251, 0.85)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo-coffee.png" alt="Vinka" style={{ height: '36px', width: 'auto' }} />
          </Link>

          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--coffee-medium)', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            <span>Volver a Inicio</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '3.5rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          
          {/* Header Block */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="hero-badge-tag" style={{ margin: '0 auto 1.25rem' }}>
              <Sparkles size={14} color="#A36B42" />
              <span>Alta de Proveedores &amp; Aliados Comerciales</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--coffee-darkest)', marginBottom: '1rem', lineHeight: 1.2 }}>
              Empieza tu registro en <span style={{ color: 'var(--accent-caramel)', fontStyle: 'italic' }}>Vinka</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto' }}>
              Completa tus datos de contacto iniciales para que nuestro equipo de curaduría se comunique contigo, coordine la verificación de tu espacio o servicio y activemos tu catálogo en la plataforma.
            </p>
          </div>

          {/* Form Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2.25rem', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent-caramel), var(--coffee-darkest))', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(163, 107, 66, 0.12)', color: 'var(--accent-caramel)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--coffee-darkest)', marginBottom: '0.75rem' }}>
                  ¡Registro recibido con éxito!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                  Hemos guardado tu información. Nuestro equipo revisará los datos y se pondrá en contacto al teléfono o correo proporcionado para continuar con la activación.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-coffee-secondary"
                    style={{ width: 'auto', padding: '0.8rem 1.75rem' }}
                  >
                    Registrar otro servicio
                  </button>
                  <Link href="/" className="btn-coffee-primary" style={{ width: 'auto', padding: '0.8rem 1.75rem' }}>
                    Volver a Inicio
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.4rem' }}>
                  
                  {/* Nombre */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--coffee-rich)', marginBottom: '0.5rem' }}>
                      <User size={15} color="#A36B42" />
                      <span>Nombre Comercial o del Contacto <strong style={{ color: '#dc2626' }}>*</strong></span>
                    </label>
                    <input 
                      type="text"
                      placeholder="Ej. Hacienda Las Palmas / Florería San Ángel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-soft)',
                        color: 'var(--text-title)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'var(--transition)'
                      }}
                    />
                  </div>

                  {/* Correo y Teléfono en dos columnas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--coffee-rich)', marginBottom: '0.5rem' }}>
                        <Mail size={15} color="#A36B42" />
                        <span>Correo Electrónico <strong style={{ color: '#dc2626' }}>*</strong></span>
                      </label>
                      <input 
                        type="email"
                        placeholder="contacto@negocio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.9rem 1.1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-soft)',
                          color: 'var(--text-title)',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--coffee-rich)', marginBottom: '0.5rem' }}>
                        <Phone size={15} color="#A36B42" />
                        <span>Teléfono de Contacto (WhatsApp) <strong style={{ color: '#dc2626' }}>*</strong></span>
                      </label>
                      <input 
                        type="tel"
                        placeholder="Ej. (656) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.9rem 1.1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-soft)',
                          color: 'var(--text-title)',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--coffee-rich)', marginBottom: '0.5rem' }}>
                      <Tag size={15} color="#A36B42" />
                      <span>Categoría Principal de tu Servicio o Recinto</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-soft)',
                        color: 'var(--text-title)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Locación / Finca / Jardín">Locación / Finca / Jardín</option>
                      <option value="Terraza / Rooftop / Salón">Terraza / Rooftop / Salón</option>
                      <option value="Banquetes & Catering">Banquetes &amp; Catering (Comida)</option>
                      <option value="Floristería & Diseño Floral">Floristería &amp; Diseño Floral</option>
                      <option value="Mobiliario & Decoración">Mobiliario &amp; Decoración</option>
                      <option value="Audio, DJ & Iluminación">Audio, DJ &amp; Iluminación</option>
                      <option value="Fotografía & Video">Fotografía &amp; Video</option>
                      <option value="Mixología & Barras">Mixología &amp; Barras</option>
                      <option value="Wedding / Event Planner">Wedding / Event Planner</option>
                      <option value="Otro Servicio Especializado">Otro Servicio Especializado</option>
                    </select>
                  </div>

                  {/* Notas / Mensaje */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--coffee-rich)', marginBottom: '0.5rem' }}>
                      <MessageSquare size={15} color="#A36B42" />
                      <span>Cuéntanos brevemente sobre tu espacio o servicio (Opcional)</span>
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Capacidad, ubicación en Ciudad Juárez/frontera, paquetes principales o cualquier detalle que desees compartir..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-soft)',
                        color: 'var(--text-title)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {errorMsg && (
                    <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', border: '1px solid #f87171', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.88rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Botón de Envío */}
                  <button 
                    type="submit" 
                    className="btn-coffee-primary"
                    disabled={loading}
                    style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                  >
                    <span>{loading ? 'Enviando información...' : 'Enviar Registro y Solicitar Contacto'}</span>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Download Contract Banner */}
          <div style={{ marginTop: '2.5rem', background: 'var(--bg-soft)', border: '1px solid var(--coffee-foam)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--coffee-deep)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--coffee-darkest)', marginBottom: '0.2rem' }}>Convenio Oficial &amp; Guía de Fotografías (PDF)</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Consulta los términos de publicación, sugerencias visuales y formatos para proveedores.</p>
              </div>
            </div>

            <a 
              href="/Contrato_Proveedores_Vinka.pdf" 
              download="Contrato_Proveedores_Vinka.pdf"
              className="btn-coffee-secondary"
              style={{ width: 'auto', padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}
            >
              <Download size={15} />
              <span>Descargar PDF</span>
            </a>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-light)', background: 'var(--bg-main)' }}>
        <div className="container">
          &copy; {new Date().getFullYear()} Vinka &bull; Plataforma Oficial de Locaciones y Experiencias.
        </div>
      </footer>
    </div>
  );
}
