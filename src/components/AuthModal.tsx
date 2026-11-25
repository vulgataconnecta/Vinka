import { useState } from 'react'
import { Briefcase, User, X } from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import { VinkaLogo } from './VinkaLogo'

export function AuthModal() {
  const {
    authModalOpen,
    authModalIntent,
    closeAuthModal,
    loginWithCredentials,
    registerAccount,
  } = useVinka()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'client' | 'provider'>(
    authModalIntent === 'provider' ? 'provider' : 'client',
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  if (!authModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Ingresa tu correo electrónico y contraseña.')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const res = await loginWithCredentials(email, password)
        if (!res.ok) setError(res.error || 'Credenciales incorrectas.')
        else setPassword('')
      } else {
        if (!name.trim()) {
          setError('Ingresa tu nombre completo.')
          return
        }
        const res = await registerAccount({ name, email, password, role, city })
        if (!res.ok) setError(res.error || 'No se pudo crear la cuenta.')
        else setPassword('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="vinka-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#1e140f]/55 backdrop-blur-sm p-4"
      onClick={closeAuthModal}
    >
      <div
        className="vinka-modal-card w-full max-w-md rounded-3xl bg-[#fdfcfb] border border-[#decfc2] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#decfc2] bg-[#f7f3ee]">
          <div className="flex items-center gap-3">
            <VinkaLogo size="sm" />
            <div>
              <h3 className="text-sm font-extrabold text-[#221610]">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </h3>
              {authModalIntent === 'quote-checkout' && (
                <p className="text-[11px] font-semibold text-[#a36b42]">
                  Guarda tu celebración y finaliza tu cotización
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-white text-[#7d6558] cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#f3ece4] mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                mode === 'login' ? 'bg-white text-[#221610] shadow-sm' : 'text-[#422d22]'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                mode === 'register' ? 'bg-white text-[#221610] shadow-sm' : 'text-[#422d22]'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#221610] mb-1.5">
                    ¿Cómo usarás Vinka?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        role === 'client'
                          ? 'border-[#2d1d16] bg-[#f3ece4] text-[#2d1d16]'
                          : 'border-[#decfc2] text-[#7d6558] hover:bg-[#f7f3ee]'
                      }`}
                    >
                      <User size={15} /> Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('provider')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        role === 'provider'
                          ? 'border-[#a36b42] bg-[#f7f3ee] text-[#a36b42]'
                          : 'border-[#decfc2] text-[#7d6558] hover:bg-[#f7f3ee]'
                      }`}
                    >
                      <Briefcase size={15} /> Proveedor
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#221610] mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre y apellidos"
                    className="w-full rounded-xl border border-[#decfc2] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#8c6a54]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#221610] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-[#decfc2] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#8c6a54]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#221610] mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
                className="w-full rounded-xl border border-[#decfc2] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#8c6a54]"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1">
                  Ciudad (opcional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Monterrey, Guadalajara, CDMX..."
                  className="w-full rounded-xl border border-[#decfc2] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#8c6a54]"
                />
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-vinka w-full font-bold text-sm py-3 disabled:opacity-60 cursor-pointer"
            >
              {submitting
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Entrar a mi cuenta'
                  : 'Crear mi cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
