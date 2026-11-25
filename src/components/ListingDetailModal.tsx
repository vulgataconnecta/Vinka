import {
  Calendar,
  CheckCircle2,
  FileText,
  Heart,
  MapPin,
  ShieldAlert,
  Star,
  Users,
  Wand2,
  X,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import type { ListingItem } from '../types/vinka'

interface Props {
  item: ListingItem | null
  onClose: () => void
  onSelectForEvent: (item: ListingItem) => void
}

export function ListingDetailModal({ item, onClose, onSelectForEvent }: Props) {
  const { favorites, toggleFavorite } = useVinka()
  if (!item) return null

  const isFav = favorites.includes(item.id)

  return (
    <div
      className="vinka-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#1e140f]/55 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="vinka-modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#fdfcfb] border border-[#decfc2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 w-full bg-[#decfc2]">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          <span className="card-tag">{item.tag}</span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#221610] shadow cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            className={`absolute right-14 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow cursor-pointer ${
              isFav ? 'text-[#a36b42]' : 'text-[#7d6558]'
            }`}
            aria-label="Guardar en favoritos"
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a36b42]">
                {item.category} · {item.kind === 'espacio' ? 'Espacio / Finca' : 'Servicio'}
              </span>
              <h2 className="text-2xl font-extrabold text-[#221610] mt-0.5">{item.title}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#7d6558]">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-[#a36b42]" /> {item.location}
                </span>
                {item.capacity && (
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} className="text-[#2d1d16]" /> Hasta {item.capacity} invitados
                  </span>
                )}
                <span className="inline-flex items-center gap-1 font-bold text-[#221610]">
                  <Star size={14} className="text-[#a36b42]" fill="currentColor" /> {item.rating} (
                  {item.reviews} reseñas)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#221610]">
                ${item.price.toLocaleString('es-MX')}
              </div>
              <div className="text-xs text-[#7d6558]">{item.priceUnit}</div>
            </div>
          </div>

          <p className="text-sm text-[#4e4b5e] leading-relaxed">{item.description}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#f7f3ee] p-4 border border-[#decfc2]">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#221610] mb-2">
                Servicios incluidos
              </h4>
              <ul className="space-y-1.5 text-xs text-[#4e4b5e]">
                {item.includedServices.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#2d1d16] shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#f3ece4]/60 p-4 border border-[#decfc2] space-y-2.5 text-xs">
              <div>
                <span className="font-extrabold text-[#221610] inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#2d1d16]" /> Horario y disponibilidad
                </span>
                <p className="text-[#4e4b5e] mt-0.5">{item.schedule}</p>
              </div>
              <div>
                <span className="font-extrabold text-[#221610] inline-flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-[#a36b42]" /> Reglas del lugar/servicio
                </span>
                <p className="text-[#4e4b5e] mt-0.5">{item.rules}</p>
              </div>
              <div className="inline-flex items-center gap-1.5 font-bold text-[#2d1d16]">
                <FileText size={14} />
                {item.offersInvoicing
                  ? 'Emite factura fiscal (CFDI disponible)'
                  : 'Sin servicio de facturación'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#decfc2]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#decfc2] px-5 py-2.5 text-xs font-bold text-[#221610] hover:bg-[#f7f3ee] cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectForEvent(item)
                onClose()
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#a36b42] hover:bg-[#2d1d16] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
            >
              <Wand2 size={15} />
              Agregar a "Arma tu evento"
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
