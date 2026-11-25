import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'

interface Props {
  photos: string[]
  onChange: (next: string[]) => void
  maxPhotos?: number
  label?: string
}

async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 960
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(reader.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      img.onerror = () => resolve(reader.result as string)
      img.src = reader.result as string
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 8,
  label = 'Adjuntar fotos desde tu dispositivo',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setLoading(true)
    try {
      const remaining = Math.max(0, maxPhotos - photos.length)
      const files = Array.from(fileList)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remaining)
      const encoded = await Promise.all(files.map(compressImageFile))
      if (encoded.length) {
        onChange([...photos, ...encoded])
      }
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removePhoto = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-5 text-center transition cursor-pointer ${
          dragging
            ? 'border-[#2d1d16] bg-[#efe7de]'
            : 'border-[#b89a82] bg-[#f7f3ee]/70 hover:bg-[#f3ece4]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#a36b42] shadow-sm mb-2">
          <ImagePlus size={20} />
        </div>
        <p className="text-xs font-extrabold text-[#221610]">
          {loading ? 'Procesando fotos...' : label}
        </p>
        <p className="text-[11px] text-[#7d6558] mt-0.5">
          Haz clic o arrastra imágenes JPG, PNG o WEBP ({photos.length}/{maxPhotos} fotos)
        </p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((src, idx) => (
            <div
              key={`${idx}-${src.slice(0, 24)}`}
              className="vinka-board-item group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#decfc2] bg-[#efe7de]"
            >
              <img src={src} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-[#2d1d16]/90 text-white px-2 py-0.5 text-[9.5px] font-bold">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-rose-700 shadow opacity-90 hover:opacity-100 cursor-pointer"
                aria-label="Quitar foto"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
