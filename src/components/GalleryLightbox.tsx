import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxPhoto {
  id: string
  src: string
  alt: string
}

interface Props {
  photos: LightboxPhoto[]
  index: number
  onClose: () => void
  onChange: (idx: number) => void
}

export default function GalleryLightbox({ photos, index, onClose, onChange }: Props) {
  const photo = photos[index]

  const prev = useCallback(() => onChange(index > 0 ? index - 1 : photos.length - 1), [index, photos.length, onChange])
  const next = useCallback(() => onChange(index < photos.length - 1 ? index + 1 : 0), [index, photos.length, onChange])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white cursor-pointer z-10">
        <X size={28} />
      </button>

      <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 p-2 text-white/70 hover:text-white cursor-pointer z-10">
        <ChevronLeft size={32} />
      </button>

      <img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={e => e.stopPropagation()}
      />

      <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 p-2 text-white/70 hover:text-white cursor-pointer z-10">
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-4 text-white/60 text-sm">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  )
}
