export type ServiceType = 'hourly' | 'package'

export interface Service {
  id: string
  type: ServiceType
  basePrice: number
  icon: string
  minHours?: number
  includes?: string[]
}

export interface Addon {
  id: string
  price: number
  unit: 'hour' | 'fixed'
}

export const services: Service[] = [
  { id: 'studio', type: 'hourly', basePrice: 5000, icon: 'Video' },
  { id: 'studio-own', type: 'hourly', basePrice: 3000, icon: 'Camera', minHours: 2 },
  { id: 'stream', type: 'hourly', basePrice: 7000, icon: 'Radio' },
  {
    id: 'package-1h',
    type: 'package',
    basePrice: 50000,
    icon: 'PackageCheck',
    includes: [
      'package.inc.studio-2h',
      'package.inc.editing',
      'package.inc.intro',
      'package.inc.graphics',
      'package.inc.reels',
      'package.inc.covers',
      'package.inc.timecodes',
      'package.inc.description',
      'package.inc.revisions',
    ],
  },
  {
    id: 'package-2h',
    type: 'package',
    basePrice: 70000,
    icon: 'PackageCheck',
    includes: [
      'package.inc.studio-3h',
      'package.inc.editing',
      'package.inc.intro',
      'package.inc.graphics',
      'package.inc.reels',
      'package.inc.covers',
      'package.inc.timecodes',
      'package.inc.description',
      'package.inc.revisions',
    ],
  },
]

export const addons: Addon[] = [
  { id: 'extra-cam', price: 2000, unit: 'hour' },
  { id: 'sound-eng', price: 3000, unit: 'hour' },
  { id: 'teleprompter', price: 1500, unit: 'fixed' },
  { id: 'greenscreen', price: 2000, unit: 'fixed' },
  { id: 'editing', price: 10000, unit: 'fixed' },
  { id: 'lighting', price: 1500, unit: 'fixed' },
]
