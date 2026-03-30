import { useState } from 'react'
import { useI18n } from '../i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { photos, categoryLabels, type GalleryCategory } from '../data/gallery'
import GalleryLightbox from './GalleryLightbox'

const categories: (GalleryCategory | 'all')[] = ['all', 'studio', 'streams', 'events', 'equipment']

export default function GalleryGrid() {
  const { t } = useI18n()
  const [active, setActive] = useState<GalleryCategory | 'all'>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = active === 'all' ? photos : photos.filter(p => p.category === active)

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${active === cat ? 'text-white' : 'hover:bg-[var(--surface-hover)]'}`}
            style={active === cat ? { background: 'var(--accent)' } : { color: 'var(--secondary)' }}
          >
            {cat === 'all' ? t('gallery.all') : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p className="text-lg mb-2">{t('gallery.soon')}</p>
          <p className="text-sm">{t('gallery.soon.sub')}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((photo, i) => (
              <motion.div key={photo.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="cursor-pointer overflow-hidden rounded-xl aspect-[4/3]" onClick={() => setLightboxIdx(i)}>
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {lightboxIdx !== null && (
        <GalleryLightbox photos={filtered} index={lightboxIdx} onClose={() => setLightboxIdx(null)} onChange={setLightboxIdx} />
      )}
    </>
  )
}
