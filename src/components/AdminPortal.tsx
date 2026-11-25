import { useState } from 'react'
import {
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  FolderKanban,
  Plus,
  Trash2,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import type { AdminTab, EventQuote } from '../types/vinka'

export function AdminPortal() {
  const {
    adminTab,
    setAdminTab,
    users,
    toggleUserStatus,
    applications,
    approveApplication,
    rejectApplication,
    events,
    updateEventStatus,
    categories,
    addCategory,
    deleteCategory,
    eventTypes,
    addEventType,
    deleteEventType,
    listings,
    approveListing,
    rejectListing,
    invoices,
  } = useVinka()

  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null)
  const [rejectListingReason, setRejectListingReason] = useState('')

  const [newCatName, setNewCatName] = useState('')
  const [newCatKind, setNewCatKind] = useState<'espacio' | 'servicio'>('servicio')
  const [newEventType, setNewEventType] = useState('')

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length
  const pendingListings = listings.filter((l) => l.approvalStatus === 'pending')
  const totalPendingReviews = pendingAppsCount + pendingListings.length
  const totalGmv = events
    .filter((e) => e.status !== 'cancelado')
    .reduce((acc, e) => acc + e.totalAmount, 0)
  const totalCommissions = events
    .filter((e) => e.status !== 'cancelado')
    .reduce((acc, e) => acc + e.commissionAmount, 0)

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'proveedores',
      label: 'Gestión de proveedores',
      icon: <Briefcase size={15} />,
      badge: totalPendingReviews,
    },
    { id: 'usuarios', label: 'Gestión de usuarios', icon: <Users size={15} /> },
    { id: 'eventos', label: 'Gestión de eventos', icon: <Calendar size={15} /> },
    { id: 'categorias', label: 'CRUD Categorías/Eventos', icon: <FolderKanban size={15} /> },
    { id: 'contabilidad', label: 'Contabilidad', icon: <Wallet size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
  ]

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee]/60 py-8 px-[5vw]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="eyebrow dark">
            <span /> Panel de Administrador · Vinka HQ
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#221610] mt-0.5">
            Centro de control y operaciones
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-7 border-b border-[#decfc2] pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAdminTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                adminTab === t.id
                  ? 'bg-[#221610] text-white shadow-sm'
                  : 'bg-white text-[#221610] border border-[#decfc2] hover:bg-[#f3ece4]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge ? (
                <span className="rounded-full bg-[#a36b42] text-white px-1.5 py-0.5 text-[10px]">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* 1. GESTIÓN DE PROVEEDORES (Autorizar / Rechazar) */}
        {adminTab === 'proveedores' && (
          <div className="space-y-8">
            {/* Nuevos espacios / servicios creados por proveedores */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-[#221610]">
                  Nuevos espacios y servicios por aprobar ({pendingListings.length} pendientes)
                </h2>
              </div>

              {listings.length === 0 ? (
                <div className="rounded-2xl bg-white border border-[#decfc2] p-8 text-center text-sm text-[#7d6558]">
                  Aún no hay espacios o servicios creados por proveedores.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {[...listings]
                    .sort((a, b) =>
                      a.approvalStatus === 'pending' ? -1 : b.approvalStatus === 'pending' ? 1 : 0,
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white border border-[#decfc2] overflow-hidden flex flex-col"
                      >
                        <div className="flex gap-4 p-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-24 w-28 rounded-xl object-cover shrink-0 bg-[#efe7de]"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-extrabold uppercase text-[#a36b42]">
                                {item.kind} · {item.category}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                                  item.approvalStatus === 'pending'
                                    ? 'bg-amber-100 text-amber-900'
                                    : item.approvalStatus === 'rejected'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {item.approvalStatus === 'pending'
                                  ? 'Pendiente'
                                  : item.approvalStatus === 'rejected'
                                    ? 'Declinado'
                                    : 'Aprobado'}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-base text-[#221610] truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#7d6558]">
                              Proveedor: <strong>{item.providerName}</strong> · {item.location}
                            </p>
                            <p className="text-xs font-extrabold text-[#2d1d16]">
                              ${item.price.toLocaleString('es-MX')} {item.priceUnit}
                              {item.capacity ? ` · Hasta ${item.capacity} inv.` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 pb-3 text-xs text-[#4e392e] line-clamp-2">
                          {item.description}
                        </div>

                        {item.approvalStatus === 'rejected' && item.approvalRejectionReason && (
                          <div className="mx-4 mb-3 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-800">
                            <strong>Motivo:</strong> {item.approvalRejectionReason}
                          </div>
                        )}

                        <div className="mt-auto px-4 py-3 border-t border-[#decfc2] bg-[#fdfcfb]">
                          {rejectingListingId === item.id ? (
                            <div className="flex flex-wrap gap-2">
                              <input
                                type="text"
                                value={rejectListingReason}
                                onChange={(e) => setRejectListingReason(e.target.value)}
                                placeholder="Motivo del rechazo (ej. Fotos borrosas, falta info)..."
                                className="flex-1 min-w-[180px] rounded-xl border border-rose-300 px-3 py-1.5 text-xs outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  rejectListing(
                                    item.id,
                                    rejectListingReason.trim() ||
                                      'Por favor mejora las fotos y descripción del servicio.',
                                  )
                                  setRejectingListingId(null)
                                  setRejectListingReason('')
                                }}
                                className="rounded-xl bg-rose-600 text-white px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectingListingId(null)}
                                className="rounded-xl border border-[#decfc2] px-3 py-1.5 text-xs font-bold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {item.approvalStatus !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => approveListing(item.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  <CheckCircle2 size={14} /> Aprobar y publicar
                                </button>
                              )}
                              {item.approvalStatus !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => setRejectingListingId(item.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                                >
                                  <XCircle size={14} /> Declinar
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-[#decfc2]">
              <h2 className="text-lg font-extrabold text-[#221610]">
                Solicitudes de alta de nuevos proveedores ({applications.length})
              </h2>
            {applications.length === 0 && (
              <div className="rounded-2xl bg-white border border-[#decfc2] p-10 text-center text-sm text-[#7d6558]">
                No hay solicitudes de proveedores registradas todavía. Cuando un proveedor complete
                su registro aparecerá aquí para autorizar o rechazar.
              </div>
            )}
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase text-[#2d1d16]">
                        {app.offeringType} · {app.subType}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status === 'approved'
                          ? 'Autorizado'
                          : app.status === 'rejected'
                            ? 'Rechazado'
                            : 'Pendiente'}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#221610] mt-0.5">
                      {app.businessName}
                    </h3>
                    <p className="text-xs text-[#7d6558]">
                      Titular: <strong>{app.fullName}</strong> ({app.email}) · {app.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#a36b42]">
                      ${app.cost.toLocaleString('es-MX')} {app.costUnit}
                    </div>
                    <div className="text-[11px] text-[#7d6558]">Enviado: {app.submittedAt}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-xl bg-[#fdfcfb] border border-[#decfc2] p-4 text-xs">
                  <div>
                    <span className="text-[#7d6558] block">CURP / RFC</span>
                    <strong className="font-mono">
                      {app.curp} / {app.rfc}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#7d6558] block">Permiso de negocio</span>
                    <strong>{app.businessPermitDoc}</strong>
                  </div>
                  <div>
                    <span className="text-[#7d6558] block">Contrato firmado</span>
                    <strong>{app.signedContractFile}</strong>
                  </div>
                  <div>
                    <span className="text-[#7d6558] block">Horario</span>
                    <strong>{app.scheduleAndAvailability}</strong>
                  </div>
                  <div>
                    <span className="text-[#7d6558] block">Facturación</span>
                    <strong>{app.invoicingService ? 'Sí ofrece CFDI' : 'No'}</strong>
                  </div>
                  <div>
                    <span className="text-[#7d6558] block">Categorías</span>
                    <strong>{app.categories.join(', ')}</strong>
                  </div>
                </div>

                {app.status === 'rejected' && app.rejectionReason && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2">
                    <strong>Motivo enviado por correo:</strong> {app.rejectionReason}
                  </p>
                )}

                {app.status === 'pending' && (
                  <div className="space-y-3 pt-2 border-t border-[#decfc2]">
                    {rejectingId === app.id ? (
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Escribe la razón del rechazo para enviar por correo..."
                          className="flex-1 min-w-[240px] rounded-xl border border-rose-300 px-3.5 py-2 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            rejectApplication(
                              app.id,
                              rejectReason.trim() ||
                                'Documentación incompleta. Por favor adjunta permiso vigente.',
                            )
                            setRejectingId(null)
                            setRejectReason('')
                          }}
                          className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-bold cursor-pointer"
                        >
                          Confirmar rechazo y enviar correo
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingId(null)}
                          className="rounded-xl border border-[#decfc2] px-3 py-2 text-xs font-bold cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => approveApplication(app.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold cursor-pointer"
                        >
                          <CheckCircle2 size={15} /> Autorizar (Activar Portal de Negocio)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingId(app.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 px-4 py-2 text-xs font-bold cursor-pointer"
                        >
                          <XCircle size={15} /> Rechazar y enviar correo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}

        {/* 2. GESTIÓN DE USUARIOS */}
        {adminTab === 'usuarios' && (
          <div className="rounded-2xl bg-white border border-[#decfc2] p-6 overflow-x-auto">
            <h2 className="text-lg font-extrabold text-[#221610] mb-4">
              Usuarios registrados ({users.length})
            </h2>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#decfc2] text-[#7d6558] uppercase">
                <tr>
                  <th className="py-2.5">Usuario</th>
                  <th className="py-2.5">Rol</th>
                  <th className="py-2.5">Ciudad</th>
                  <th className="py-2.5">Estado</th>
                  <th className="py-2.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#decfc2]">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3">
                      <div className="font-extrabold text-[#221610]">{u.name}</div>
                      <div className="text-[11px] text-[#7d6558]">{u.email}</div>
                    </td>
                    <td className="py-3 capitalize font-bold text-[#2d1d16]">{u.role}</td>
                    <td className="py-3 text-[#7d6558]">{u.city || '—'}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {u.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className="rounded-lg border border-[#decfc2] hover:bg-[#f7f3ee] px-3 py-1 text-[11px] font-bold cursor-pointer"
                      >
                        {u.status === 'active' ? 'Suspender' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. GESTIÓN DE EVENTOS */}
        {adminTab === 'eventos' && (
          <div className="rounded-2xl bg-white border border-[#decfc2] p-6 overflow-x-auto">
            <h2 className="text-lg font-extrabold text-[#221610] mb-4">
              Todos los eventos y cotizaciones ({events.length})
            </h2>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#decfc2] text-[#7d6558] uppercase">
                <tr>
                  <th className="py-2.5">Ocasión / Fecha</th>
                  <th className="py-2.5">Cliente</th>
                  <th className="py-2.5">Espacio / Servicios</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#decfc2]">
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td className="py-3">
                      <div className="font-extrabold text-[#221610]">{ev.occasion}</div>
                      <div className="text-[11px] text-[#7d6558]">
                        {ev.dateTime.replace('T', ' · ')} ({ev.guests} inv.)
                      </div>
                    </td>
                    <td className="py-3">{ev.clientName}</td>
                    <td className="py-3 text-[#7d6558]">
                      {[ev.spaceTitle, ...ev.serviceTitles].filter(Boolean).join(', ')}
                    </td>
                    <td className="py-3 font-extrabold text-[#a36b42]">
                      ${ev.totalAmount.toLocaleString('es-MX')}
                    </td>
                    <td className="py-3">
                      <select
                        value={ev.status}
                        onChange={(e) =>
                          updateEventStatus(ev.id, e.target.value as EventQuote['status'])
                        }
                        className="rounded-lg border border-[#decfc2] px-2 py-1 text-xs font-bold"
                      >
                        <option value="cotizado">cotizado</option>
                        <option value="confirmado">confirmado</option>
                        <option value="completado">completado</option>
                        <option value="cancelado">cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. CRUD CATEGORÍAS / EVENTOS */}
        {adminTab === 'categorias' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4">
              <h3 className="text-base font-extrabold text-[#221610]">Categorías del catálogo</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newCatName.trim()) return
                  addCategory({
                    name: newCatName.trim(),
                    kind: newCatKind,
                    icon: newCatKind === 'espacio' ? 'garden' : 'sparkle',
                    tone: '#f3ece4',
                    description: 'Categoría creada desde Panel Admin.',
                  })
                  setNewCatName('')
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nueva categoría..."
                  className="flex-1 rounded-xl border border-[#decfc2] px-3 py-2 text-xs"
                />
                <select
                  value={newCatKind}
                  onChange={(e) => setNewCatKind(e.target.value as 'espacio' | 'servicio')}
                  className="rounded-xl border border-[#decfc2] px-2.5 py-2 text-xs font-bold"
                >
                  <option value="servicio">Servicio</option>
                  <option value="espacio">Espacio</option>
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2d1d16] text-white px-3.5 py-2 text-xs font-bold cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </form>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-[#221610]">{c.name}</span>
                      <span className="ml-2 text-[10px] uppercase text-[#7d6558]">({c.kind})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCategory(c.id)}
                      className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#decfc2] p-6 space-y-4">
              <h3 className="text-base font-extrabold text-[#221610]">Tipos de eventos</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newEventType.trim()) return
                  addEventType(newEventType)
                  setNewEventType('')
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  placeholder="Ej. Baby Shower, Posada..."
                  className="flex-1 rounded-xl border border-[#decfc2] px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#a36b42] text-white px-3.5 py-2 text-xs font-bold cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ee] border border-[#decfc2] px-3 py-1 text-xs font-bold text-[#221610]"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => deleteEventType(t)}
                      className="text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTABILIDAD */}
        {adminTab === 'contabilidad' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-rose-200 p-5">
                <span className="text-[10px] font-extrabold uppercase text-rose-700">
                  Contabilidad · GMV Total
                </span>
                <p className="text-2xl font-extrabold text-[#221610] mt-1">
                  ${totalGmv.toLocaleString('es-MX')} MXN
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[#decfc2] p-5">
                <span className="text-[10px] font-extrabold uppercase text-[#2d1d16]">
                  Comisiones Vinka (10%)
                </span>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  ${totalCommissions.toLocaleString('es-MX')} MXN
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[#decfc2] p-5">
                <span className="text-[10px] font-extrabold uppercase text-[#7d6558]">
                  Facturas CFDI emitidas
                </span>
                <p className="text-2xl font-extrabold text-[#221610] mt-1">{invoices.length}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#decfc2] p-6 overflow-x-auto">
              <h3 className="text-base font-extrabold text-[#221610] mb-4">
                Libro mayor de transacciones y liquidaciones
              </h3>
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#decfc2] text-[#7d6558] uppercase">
                  <tr>
                    <th className="py-2.5">Evento</th>
                    <th className="py-2.5">Monto bruto</th>
                    <th className="py-2.5">Comisión Vinka (10%)</th>
                    <th className="py-2.5">Pago a proveedor (90%)</th>
                    <th className="py-2.5">Factura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#decfc2]">
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td className="py-3 font-bold text-[#221610]">{ev.occasion}</td>
                      <td className="py-3">${ev.totalAmount.toLocaleString('es-MX')}</td>
                      <td className="py-3 font-extrabold text-emerald-700">
                        ${ev.commissionAmount.toLocaleString('es-MX')}
                      </td>
                      <td className="py-3">
                        ${(ev.totalAmount - ev.commissionAmount).toLocaleString('es-MX')}
                      </td>
                      <td className="py-3 text-[#2d1d16] font-mono">
                        {ev.invoiceFolio || 'Pendiente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Usuarios totales', val: users.length },
              { label: 'Publicaciones activas', val: listings.filter((l) => l.active).length },
              { label: 'Solicitudes pendientes', val: pendingAppsCount },
              { label: 'Eventos cotizados', val: events.length },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl bg-white border border-[#decfc2] p-5">
                <p className="text-xs font-bold text-[#7d6558]">{k.label}</p>
                <p className="text-3xl font-extrabold text-[#221610] mt-1">{k.val}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
