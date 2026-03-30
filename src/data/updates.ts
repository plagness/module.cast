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
  tags?: string[]
  highlights?: Highlight[]
}

export const updates: UpdateEntry[] = [
  { id: '2026-03-23', date: '2026-03-23', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2026-03-23.mp4' },
  { id: '2026-02-21', date: '2026-02-21', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2026-02-21.mp4' },
  { id: '2026-02-14', date: '2026-02-14', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2026-02-14.mp4' },
  { id: '2025-12-05', date: '2025-12-05', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2025-12-05.mp4' },
  { id: '2025-10-12', date: '2025-10-12', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2025-10-12.mp4' },
  { id: '2025-07-30', date: '2025-07-30', type: 'video', mediaUrl: 'https://modulecast-images.s3.twcstorage.ru/updates/2025-07-30.mp4' },
]
