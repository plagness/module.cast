export type MediaType = 'video' | 'youtube' | 'image' | 'text'

export interface Highlight {
  icon: string
  text: string
}

export interface UpdateEntry {
  id: string
  date: string
  type: MediaType
  mediaUrl?: string
  posterUrl?: string
  orientation?: 'portrait' | 'landscape'
  subtitles?: Record<string, string>
  audioTracks?: string[]
  tags?: string[]
  highlights?: Highlight[]
}

const S3 = 'https://modulecast-images.s3.twcstorage.ru/updates'

export const updates: UpdateEntry[] = [
  {
    id: '2026-03-23', date: '2026-03-23', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2026-03-23.mp4`, posterUrl: `${S3}/2026-03-23.jpg`,
    subtitles: { ru: `${S3}/2026-03-23.ru.vtt` },
    tags: ['студия', 'обзор', 'эфиры'],
    highlights: [
      { icon: '📹', text: 'До 4 камер' },
      { icon: '🎙', text: 'Телесуфлёр' },
      { icon: '☕', text: 'Зона ожидания' },
      { icon: '🏢', text: '2+ года работы' },
    ],
  },
  {
    id: '2026-02-21', date: '2026-02-21', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2026-02-21.mp4`, posterUrl: `${S3}/2026-02-21.jpg`,
    subtitles: { ru: `${S3}/2026-02-21.ru.vtt` },
    tags: ['подкасты', 'оборудование', 'свет'],
    highlights: [
      { icon: '🖥', text: 'Запись на ПК' },
      { icon: '🌈', text: 'RGB подсветка' },
      { icon: '💧', text: 'Вода для гостей' },
    ],
  },
  {
    id: '2026-02-14', date: '2026-02-14', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2026-02-14.mp4`, posterUrl: `${S3}/2026-02-14.jpg`,
    subtitles: { ru: `${S3}/2026-02-14.ru.vtt` },
    tags: ['оборудование', 'суфлёр', 'свет'],
    highlights: [
      { icon: '📺', text: '4K монитор' },
      { icon: '📝', text: 'Проф. суфлёр' },
      { icon: '💡', text: 'Проф. свет' },
      { icon: '🎬', text: 'Белый фон' },
    ],
  },
  {
    id: '2025-12-05', date: '2025-12-05', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-12-05.mp4`, posterUrl: `${S3}/2025-12-05.jpg`,
    subtitles: { ru: `${S3}/2025-12-05.ru.vtt` },
    tags: ['уроки', 'съёмка', 'свет'],
    highlights: [
      { icon: '🎓', text: 'Запись уроков' },
      { icon: '💡', text: 'Aputure 150C' },
      { icon: '🎥', text: 'Kino Flo свет' },
    ],
  },
  {
    id: '2025-10-12', date: '2025-10-12', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-10-12.mp4`, posterUrl: `${S3}/2025-10-12.jpg`,
    subtitles: { ru: `${S3}/2025-10-12.ru.vtt` },
    tags: ['студия', 'расстановка', 'подкаст'],
    highlights: [
      { icon: '↔️', text: 'Горизонтальная расстановка' },
      { icon: '📷', text: 'Новый ширик' },
    ],
  },
  {
    id: '2025-07-30', date: '2025-07-30', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-07-30.mp4`, posterUrl: `${S3}/2025-07-30.jpg`,
    subtitles: { ru: `${S3}/2025-07-30.ru.vtt` },
    tags: ['студия', 'интервью'],
    highlights: [
      { icon: '🦅', text: 'Журавль-стойка' },
      { icon: '📹', text: '3 камеры' },
      { icon: '🪑', text: 'Формат интервью' },
    ],
  },
]
