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
    tags: ['студия', 'обзор'],
  },
  {
    id: '2026-02-21', date: '2026-02-21', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2026-02-21.mp4`, posterUrl: `${S3}/2026-02-21.jpg`,
    subtitles: { ru: `${S3}/2026-02-21.ru.vtt` },
    tags: ['студия', 'подкасты'],
  },
  {
    id: '2026-02-14', date: '2026-02-14', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2026-02-14.mp4`, posterUrl: `${S3}/2026-02-14.jpg`,
    subtitles: { ru: `${S3}/2026-02-14.ru.vtt` },
    tags: ['оборудование'],
  },
  {
    id: '2025-12-05', date: '2025-12-05', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-12-05.mp4`, posterUrl: `${S3}/2025-12-05.jpg`,
    subtitles: { ru: `${S3}/2025-12-05.ru.vtt` },
    tags: ['уроки', 'съёмка'],
  },
  {
    id: '2025-10-12', date: '2025-10-12', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-10-12.mp4`, posterUrl: `${S3}/2025-10-12.jpg`,
    subtitles: { ru: `${S3}/2025-10-12.ru.vtt` },
    tags: ['студия'],
  },
  {
    id: '2025-07-30', date: '2025-07-30', type: 'video', orientation: 'portrait',
    mediaUrl: `${S3}/2025-07-30.mp4`, posterUrl: `${S3}/2025-07-30.jpg`,
    subtitles: { ru: `${S3}/2025-07-30.ru.vtt` },
    tags: ['студия'],
  },
]
