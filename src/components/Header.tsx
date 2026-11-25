import { useState } from 'react'
import {
  Briefcase,
  CalendarHeart,
  LogIn,
  LogOut,
  Menu,
  Shield,
  UserPlus,
  Wand2,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import { VinkaLogo } from './VinkaLogo'

export function Header() {
  const { route, setRoute, setClientTab, currentUser, openAuthModal, logout } = useVinka()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'V'

  const goToProviderFlow = () => {
    setMenuOpen(false)
    if (currentUser?.role === 'provider' && currentUser.providerStatus === 'approved') {
      setRoute('provider-portal')
    } else {
      setRoute('provider-onboarding')
    }
  }

  return (
    <header className="site-header">
      <button
        type="button"
        className="bg-transparent border-0 cursor-pointer"
        onClick={() => setRoute('landing')}
        aria-label="Vinka, inicio"
      >
        <VinkaLogo />
      </button>

      <nav className="desktop-nav" aria-label="Navegación principal">
        <button
          type="button"
          className={route === 'landing' ? 'nav-active' : ''}
          onClick={() => setRoute('landing')}
        >
          Inicio
        </button>
        <button
          type="button"
          className={route === 'event-builder' ? 'nav-active' : ''}
          onClick={() => setRoute('event-builder')}
        >
          Arma tu evento
        </button>
        <button
          type="button"
          className={route === 'client-portal' ? 'nav-active' : ''}
          onClick={() => {
            setClientTab('descubrir')
            setRoute('client-portal')
          }}
        >
          Descubrir
        </button>
        {currentUser?.role === 'provider' && (
          <button
            type="button"
            className={
              route === 'provider-portal' || route === 'provider-onboarding' ? 'nav-active' : ''
            }
            onClick={goToProviderFlow}
          >
            Portal Proveedor
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <button
            type="button"
            className={route === 'admin-portal' ? 'nav-active' : ''}
            onClick={() => setRoute('admin-portal')}
          >
            Panel Admin
          </button>
        )}
      </nav>

      <div className="header-actions">
        {currentUser && (
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#f3ece4] px-3 py-1 text-xs font-bold text-[#2d1d16]">
            {currentUser.role === 'admin'
              ? 'Admin'
              : currentUser.role === 'provider'
                ? 'Proveedor'
                : 'Cliente'}
          </span>
        )}
        <button type="button" className="provider-link" onClick={goToProviderFlow}>
          Ofrece tu servicio
        </button>
        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <Menu size={18} />
          <span className="avatar">{initials}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="profile-menu">
          {currentUser ? (
            <>
              <div className="px-3 py-2">
                <p className="text-xs font-extrabold text-[#221610] truncate">{currentUser.name}</p>
                <p className="text-[11px] text-[#7d6558] truncate">{currentUser.email}</p>
              </div>
              <hr />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setClientTab('mis-eventos')
                  setRoute('client-portal')
                }}
              >
                <CalendarHeart size={15} className="text-[#a36b42]" />
                Mis eventos y cuenta
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setRoute('event-builder')
                }}
              >
                <Wand2 size={15} className="text-[#2d1d16]" />
                Arma tu evento
              </button>
              <button type="button" onClick={goToProviderFlow}>
                <Briefcase size={15} className="text-[#2d1d16]" />
                {currentUser.providerStatus === 'approved'
                  ? 'Portal de Negocio'
                  : 'Registro de Proveedor'}
              </button>
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setRoute('admin-portal')
                  }}
                >
                  <Shield size={15} className="text-[#a36b42]" />
                  Panel Administrador
                </button>
              )}
              <hr />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="!text-[#c94a38]"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openAuthModal('general')
                }}
              >
                <LogIn size={15} className="text-[#2d1d16]" />
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openAuthModal('general')
                }}
              >
                <UserPlus size={15} className="text-[#a36b42]" />
                Crear cuenta
              </button>
              <hr />
              <button type="button" onClick={goToProviderFlow}>
                <Briefcase size={15} className="text-[#2d1d16]" />
                Publicar espacio o servicio
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
