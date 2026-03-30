export type ServiceCategory = 'podcast' | 'stream' | 'video' | 'photo'

export interface Service {
  id: string
  nameKey: string
  descKey: string
  basePrice: number
  unit: 'hour' | 'fixed'
  category: ServiceCategory
  icon: string
}

export interface Addon {
  id: string
  nameKey: string
  price: number
  unit: 'hour' | 'fixed'
  categories: ServiceCategory[]
}

export const services: Service[] = [
  { id: 'podcast', nameKey: 'Запись подкаста', descKey: 'Профессиональная запись аудио и видео подкастов', basePrice: 5000, unit: 'hour', category: 'podcast', icon: 'Mic' },
  { id: 'stream', nameKey: 'Прямой эфир', descKey: 'Проведение прямых трансляций на любые платформы', basePrice: 8000, unit: 'hour', category: 'stream', icon: 'Radio' },
  { id: 'video', nameKey: 'Видеосъёмка', descKey: 'Студийная видеосъёмка с профессиональным светом', basePrice: 7000, unit: 'hour', category: 'video', icon: 'Video' },
  { id: 'photo', nameKey: 'Фотосессия', descKey: 'Студийная фотосессия с оборудованием', basePrice: 4000, unit: 'hour', category: 'photo', icon: 'Camera' },
]

export const addons: Addon[] = [
  { id: 'extra-cam', nameKey: 'Дополнительная камера', price: 2000, unit: 'hour', categories: ['podcast', 'stream', 'video'] },
  { id: 'sound-eng', nameKey: 'Звукорежиссёр', price: 3000, unit: 'hour', categories: ['podcast', 'stream', 'video'] },
  { id: 'teleprompter', nameKey: 'Телесуфлёр', price: 1500, unit: 'fixed', categories: ['podcast', 'stream', 'video'] },
  { id: 'greenscreen', nameKey: 'Хромакей', price: 2000, unit: 'fixed', categories: ['stream', 'video'] },
  { id: 'editing', nameKey: 'Монтаж', price: 10000, unit: 'fixed', categories: ['podcast', 'video'] },
  { id: 'lighting', nameKey: 'Расширенный свет', price: 1500, unit: 'fixed', categories: ['video', 'photo'] },
  { id: 'makeup', nameKey: 'Визажист', price: 5000, unit: 'fixed', categories: ['video', 'photo'] },
  { id: 'guest-mic', nameKey: 'Доп. микрофон для гостя', price: 500, unit: 'hour', categories: ['podcast', 'stream'] },
]

export const categoryLabels: Record<ServiceCategory, string> = {
  podcast: 'Подкасты',
  stream: 'Стримы',
  video: 'Видео',
  photo: 'Фото',
}
