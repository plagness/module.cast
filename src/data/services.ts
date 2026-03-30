export type ServiceCategory = 'video' | 'stream'

export interface Service {
  id: string
  basePrice: number
  unit: 'hour'
  category: ServiceCategory
  icon: string
}

export interface Addon {
  id: string
  price: number
  unit: 'hour' | 'fixed'
  categories: ServiceCategory[]
}

export const services: Service[] = [
  { id: 'video', basePrice: 5000, unit: 'hour', category: 'video', icon: 'Video' },
  { id: 'stream', basePrice: 7000, unit: 'hour', category: 'stream', icon: 'Radio' },
]

export const addons: Addon[] = [
  { id: 'extra-cam', price: 2000, unit: 'hour', categories: ['video', 'stream'] },
  { id: 'sound-eng', price: 3000, unit: 'hour', categories: ['video', 'stream'] },
  { id: 'teleprompter', price: 1500, unit: 'fixed', categories: ['video', 'stream'] },
  { id: 'greenscreen', price: 2000, unit: 'fixed', categories: ['video', 'stream'] },
  { id: 'editing', price: 10000, unit: 'fixed', categories: ['video'] },
  { id: 'lighting', price: 1500, unit: 'fixed', categories: ['video', 'stream'] },
]
