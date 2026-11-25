import { AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import type { EventBookingItem } from '../types/vinka'

interface Props {
  items: EventBookingItem[]
  compact?: boolean
}

export function EventProgressBar({ items, compact = false }: Props) {
  const total = items.length
  const accepted = items.filter((i) => i.status === 'aceptado').length
  const rejected = items.filter((i) => i.status === 'rechazado').length
  const pending = items.filter((i) => i.status === 'pendiente').length

  // Base 18% progress just for creating the event so the animated bar feels alive immediately
  const rawPercent = total > 0 ? Math.round((accepted / total) * 100) : 100
  const displayPercent = total > 0 ? Math.max(accepted > 0 ? rawPercent : 18, rawPercent) : 100

  const statusText =
    total === 0
      ? 'Evento registrado'
      : accepted === total
        ? '¡Todos tus proveedores confirmaron!'
        : rejected > 0
          ? `${rejected} proveedor(es) requieren reemplazo`
          : pending > 0
            ? `Esperando respuesta de ${pending} proveedor(es)`
            : 'Plan armado · Pendiente de elegir proveedores'

  return (
    <div className="rounded-2xl bg-[#f7f3ee] border border-[#decfc2] p-4 space-y-3 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-extrabold text-[#221610] inline-flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#a36b42]" />
          Progreso de tu evento
        </span>
        <span className="font-extrabold text-[#a36b42]">
          {total > 0 ? `${accepted} de ${total} confirmados (${rawPercent}%)` : '100%'}
        </span>
      </div>

      {/* Animated Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#e6dbcf]">
        <div
          className="vinka-progress-fill h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayPercent}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#7d6558]">
        <span>{statusText}</span>
        {!compact && total > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                  item.status === 'aceptado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'rechazado'
                      ? 'bg-rose-100 text-rose-800'
                      : item.status === 'pendiente'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-white border border-[#decfc2] text-[#7d6558]'
                }`}
              >
                {item.status === 'aceptado' && <CheckCircle2 size={11} />}
                {item.status === 'rechazado' && <AlertTriangle size={11} />}
                {item.status === 'pendiente' && <Clock size={11} />}
                {item.listingTitle || item.category}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
