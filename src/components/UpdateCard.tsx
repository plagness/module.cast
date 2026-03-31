import { useI18n } from '../i18n'
import { Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UpdateEntry } from '../data/updates'
import VideoPlayer from './VideoPlayer'

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
  return m ? m[1] : null
}

export default function UpdateCard({ entry }: { entry: UpdateEntry }) {
  const { t, lang } = useI18n()

  const title = t(`updates.${entry.id}.title`)
  const desc = t(`updates.${entry.id}.desc`)
  const hasTitle = title !== `updates.${entry.id}.title`
  const hasDesc = desc !== `updates.${entry.id}.desc`
  const shareUrl = `${window.location.origin}/${lang}/updates#${entry.id}`
  const isPortrait = entry.orientation === 'portrait'

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ url: shareUrl })
      else await navigator.clipboard.writeText(shareUrl)
    } catch {}
  }

  // Media
  const media = (() => {
    if (entry.type === 'video' && entry.mediaUrl) {
      return (
        <VideoPlayer
          src={entry.mediaUrl}
          poster={entry.posterUrl}
          subtitles={entry.subtitles}
          activeLang={lang}
          orientation={entry.orientation}
          shareUrl={shareUrl}
        />
      )
    }
    if (entry.type === 'youtube' && entry.mediaUrl) {
      const ytId = extractYouTubeId(entry.mediaUrl)
      return ytId ? (
        <div className="aspect-video rounded-xl overflow-hidden">
          <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : null
    }
    if (entry.type === 'image' && entry.mediaUrl) {
      return <img src={entry.mediaUrl} alt={hasTitle ? title : ''} className="w-full rounded-xl" loading="lazy" />
    }
    return null
  })()

  // Floating text sidebar
  const textContent = (
    <>
      {/* Date */}
      <motion.time
        initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
        className="text-xs font-medium block mb-2"
        style={{ color: 'var(--muted)' }}
      >
        {formatDate(entry.date, lang)}
      </motion.time>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 }}
          className="flex gap-1.5 flex-wrap mb-3"
        >
          {entry.tags.map(tag => {
            const translated = t(`tag.${tag}`)
            return (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {translated !== `tag.${tag}` ? translated : tag}
              </span>
            )
          })}
        </motion.div>
      )}

      {/* Title */}
      {hasTitle && (
        <motion.h3
          initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
          className="font-bold text-xl leading-tight mb-2"
        >
          {title}
        </motion.h3>
      )}

      {/* Description */}
      {hasDesc && (
        <motion.p
          initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.25 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--secondary)' }}
        >
          {desc}
        </motion.p>
      )}

      {/* Accent line */}
      {(entry.highlights?.length || 0) > 0 && (
        <div className="w-8 h-0.5 rounded-full my-4" style={{ background: 'var(--accent)', opacity: 0.4 }} />
      )}

      {/* Highlights */}
      {entry.highlights && entry.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.highlights.map((h, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface-hover)', color: 'var(--secondary)' }}
            >
              <span>{h.icon}</span>
              <span>{h.text}</span>
            </motion.span>
          ))}
        </div>
      )}

      {/* Share */}
      <motion.button
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.4 }}
        onClick={handleShare}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer hover:text-[var(--accent)]"
        style={{ color: 'var(--muted)' }}
      >
        <Share2 size={12} />
        {lang === 'ru' ? 'Поделиться' : lang === 'zh' ? '分享' : 'Share'}
      </motion.button>
    </>
  )

  // Portrait: video + floating sidebar
  if (isPortrait && media) {
    return (
      <article id={entry.id} className="flex flex-col md:flex-row md:items-start md:justify-center gap-5 md:gap-10">
        <div className="w-full md:w-[340px] lg:w-[380px] flex-shrink-0">
          <div className="glass-card overflow-hidden">
            {media}
          </div>
        </div>
        <div className="md:w-[300px] lg:w-[340px] flex-shrink-0 md:pt-2 md:border-l-2 md:pl-6" style={{ borderColor: 'var(--border)' }}>
          {textContent}
        </div>
      </article>
    )
  }

  // Landscape / non-video: media on top, text below
  return (
    <article id={entry.id} className="max-w-2xl mx-auto">
      {media && (
        <div className="glass-card overflow-hidden">
          {media}
        </div>
      )}
      <div className="pt-4 px-1">
        {textContent}
      </div>
    </article>
  )
}
