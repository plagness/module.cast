export type GalleryCategory = 'studio' | 'streams' | 'events' | 'equipment'

export interface GalleryPhoto {
  id: string
  src: string
  category: GalleryCategory
  alt: string
}

export const categoryLabels: Record<GalleryCategory, string> = {
  studio: 'Студия',
  streams: 'Стримы',
  events: 'Мероприятия',
  equipment: 'Оборудование',
}

// Placeholder — photos will be added later
export const photos: GalleryPhoto[] = []
