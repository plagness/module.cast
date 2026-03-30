import { useI18n } from '../i18n'
import type { UpdateEntry } from '../data/updates'

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

  return (
    <article className="glass-card overflow-hidden">
      {/* Media */}
      {entry.type === 'video' && entry.mediaUrl && (
        <video
          src={entry.mediaUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full aspect-video bg-black"
        />
      )}

      {entry.type === 'youtube' && entry.mediaUrl && (() => {
        const ytId = extractYouTubeId(entry.mediaUrl)
        return ytId ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null
      })()}

      {entry.type === 'image' && entry.mediaUrl && (
        <img src={entry.mediaUrl} alt={hasTitle ? title : ''} className="w-full" loading="lazy" />
      )}

      {/* Content */}
      <div className="p-5">
        {/* Date + Tags */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <time className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            {formatDate(entry.date, lang)}
          </time>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

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
            {entry.highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--surface-hover)', color: 'var(--text)' }}>
                <span>{h.icon}</span>
                <span>{t(`updates.${entry.id}.h.${i}`) !== `updates.${entry.id}.h.${i}` ? t(`updates.${entry.id}.h.${i}`) : h.text}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
