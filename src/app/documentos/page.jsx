'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const DOCUMENTS = [
  {
    id: 'presentacion-comercial',
    title: 'Presentación Comercial VINKA',
    category: 'Presentación Oficial • 13 Páginas',
    description:
      'Conoce a detalle el ecosistema digital de Vinka para conectar eventos con sus mejores creadores. Incluye el contexto de mercado, el recorrido del usuario en 5 momentos, las categorías de proveedores y los beneficios exclusivos de la Alianza para Proveedores Fundadores.',
    fileUrl: '/Presentacion_Comercial_Vinka.pdf',
    downloadName: 'Presentación Comercial VINKA.pdf',
    previewImg: '/preview-presentacion.svg'
  },
  {
    id: 'contrato-proveedores',
    title: 'Convenio de Afiliación y Publicación (Contrato de Proveedores)',
    category: 'Documento Legal & Anexo Técnico • 4 Páginas',
    description:
      'Convenio oficial de colaboración y términos de publicación para locaciones y proveedores aliados de Vinka. Contempla la política de 0% de comisión inicial, estándares de servicio, la guía de calidad visual para tus 5 fotografías y la ficha técnica de registro.',
    fileUrl: '/Contrato_Proveedores_Vinka.pdf',
    downloadName: 'Contrato_Proveedores_Vinka.pdf',
    previewImg: '/preview-contrato.svg'
  }
];

export default function DocumentosPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Cerrar el visor de pantalla completa con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDoc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bloquear scroll del body cuando el visor de pantalla completa está activo
  useEffect(() => {
    if (selectedDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDoc]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <div className="bg-ambient-pattern" />

      {/* Header Superior: Logo de Vinka a la izquierda | Documentos, y Botón Visible para Regresar */}
      <header className="docs-header">
        <div className="container docs-header-inner">
          <div className="docs-brand-group">
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }} title="Ir a la página principal">
              <img
                src="/logo-coffee.png"
                alt="Vinka"
                className="docs-header-logo"
              />
            </Link>
            <span className="docs-brand-divider" aria-hidden="true">|</span>
            <h1 className="docs-header-title">Documentos</h1>
          </div>

          <Link href="/" className="btn-docs-back" id="btn-regresar-inicio">
            <ArrowLeft size={17} />
            <span>Regresar al Inicio</span>
          </Link>
        </div>
      </header>

      {/* Apartado Principal de Documentos */}
      <main className="docs-section-wrapper">
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Encabezado del Apartado */}
          <div className="docs-section-header">
            <div className="hero-badge-tag" style={{ margin: '0 0 1rem 0' }}>
              <Sparkles size={14} color="#A36B42" />
              <span>Centro de Documentación Oficial Vinka</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--coffee-darkest)', marginBottom: '0.55rem' }}>
              Presentaciones y Documentos Oficiales
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '700px', lineHeight: 1.6 }}>
              Haz clic sobre cualquier documento para abrir su previsualización en pantalla completa o descargarlo directamente a tu dispositivo.
            </p>
          </div>

          {/* Lista de Documentos en Filas */}
          <div className="docs-rows-list">
            {DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="doc-row-card"
                onClick={() => setSelectedDoc(doc)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDoc(doc);
                  }
                }}
              >
                {/* Pequeña imagen a la izquierda con previsualización */}
                <div className="doc-row-thumb-wrapper">
                  <img
                    src={doc.previewImg}
                    alt={`Previsualización de ${doc.title}`}
                    className="doc-row-thumb-img"
                  />
                  <div className="doc-row-thumb-overlay">
                    <Eye size={16} />
                    <span>Previsualizar</span>
                  </div>
                </div>

                {/* Contenido alineado a la izquierda: Título y descripción abajo del título */}
                <div className="doc-row-content">
                  <div className="doc-row-badge">
                    <FileText size={13} />
                    <span>{doc.category}</span>
                  </div>
                  <h3 className="doc-row-title">{doc.title}</h3>
                  <p className="doc-row-desc">{doc.description}</p>
                </div>

                {/* Indicador lateral de acción */}
                <div className="doc-row-action-side">
                  <span className="doc-row-cta-pill">
                    <Eye size={16} />
                    <span>Ver documento</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="site-footer" style={{ padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src="/logo-coffee.png"
            alt="Vinka"
            className="footer-logo"
            style={{ height: '36px', marginBottom: '0.85rem' }}
          />
          <div className="footer-copyright" style={{ borderTop: 'none', paddingTop: 0 }}>
            &copy; {CURRENT_YEAR} Vinka &bull; Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Ventana de Previsualización en Pantalla Completa con Logo de Vinka y Botón de Descargar */}
      {selectedDoc && (
        <div className="doc-fullscreen-modal" role="dialog" aria-modal="true" aria-label={selectedDoc.title}>
          <div className="doc-fullscreen-topbar">
            <div className="doc-fullscreen-brand">
              <img
                src="/logo-coffee.png"
                alt="Vinka"
                className="doc-fullscreen-logo"
              />
              <span className="doc-fullscreen-divider" aria-hidden="true">|</span>
              <span className="doc-fullscreen-doc-title">{selectedDoc.title}</span>
            </div>

            <div className="doc-fullscreen-actions">
              <a
                href={selectedDoc.fileUrl}
                download={selectedDoc.downloadName}
                className="btn-doc-download"
                id="btn-download-fullscreen-pdf"
              >
                <Download size={16} />
                <span>Descargar PDF</span>
              </a>

              <a
                href={selectedDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-doc-close"
                title="Abrir PDF en una nueva pestaña"
              >
                <ExternalLink size={15} />
                <span>Nueva pestaña</span>
              </a>

              <button
                type="button"
                className="btn-doc-close"
                onClick={() => setSelectedDoc(null)}
                aria-label="Cerrar previsualización"
                title="Cerrar (Esc)"
              >
                <X size={17} />
                <span>Cerrar</span>
              </button>
            </div>
          </div>

          <div className="doc-fullscreen-body">
            <iframe
              src={selectedDoc.fileUrl}
              title={selectedDoc.title}
              className="doc-fullscreen-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}
