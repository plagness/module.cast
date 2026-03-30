import { useI18n } from '../i18n'
import { Share2 } from 'lucide-react'
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
  const isPortrait = entry.orientation === 'portrait'
  const shareUrl = `${window.location.origin}/${lang}/updates#${entry.id}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }

  // Media section
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
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null
    }
    if (entry.type === 'image' && entry.mediaUrl) {
      return <img src={entry.mediaUrl} alt={hasTitle ? title : ''} className="w-full rounded-xl" loading="lazy" />
    }
    return null
  })()

  // Text content
  const textContent = (
    <div className={isPortrait ? 'flex flex-col justify-center' : ''}>
      {/* Date + Share */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <time className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          {formatDate(entry.date, lang)}
        </time>
        <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)] transition-colors cursor-pointer" title="Share">
          <Share2 size={14} style={{ color: 'var(--muted)' }} />
        </button>
      </div>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {entry.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      {hasTitle && (
        <h3 className="font-semibold text-lg mb-2 leading-snug">{title}</h3>
      )}

      {/* Description */}
      {hasDesc && (
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--secondary)' }}>
          {desc}
        </p>
      )}

      {/* Highlights */}
      {entry.highlights && entry.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.highlights.map((h, i) => {
            const hText = t(`updates.${entry.id}.h.${i}`)
            return (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--surface-hover)', color: 'var(--text)' }}>
                <span>{h.icon}</span>
                <span>{hText !== `updates.${entry.id}.h.${i}` ? hText : h.text}</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )

  // Layout depends on orientation
  if (isPortrait && media) {
    return (
      <article id={entry.id} className="glass-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Video left (40%) */}
          <div className="md:w-[40%] flex-shrink-0">
            {media}
          </div>
          {/* Text right (60%) */}
          <div className="p-5 md:p-6 md:w-[60%]">
            {textContent}
          </div>
        </div>
      </article>
    )
  }

  // Landscape or non-video: media on top, text below
  return (
    <article id={entry.id} className="glass-card overflow-hidden">
      {media && <div className="p-3 pb-0">{media}</div>}
      <div className="p-5">
        {textContent}
      </div>
    </article>
  )
}
