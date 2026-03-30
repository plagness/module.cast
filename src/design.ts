export const light = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceHover: '#F5F5F5',
  card: '#F5F5F5',
  border: 'rgba(0,0,0,0.08)',
  borderHover: 'rgba(0,0,0,0.15)',
  text: '#1A1A1A',
  secondary: '#666666',
  muted: '#999999',
  dim: '#CCCCCC',
  glass: 'rgba(255,255,255,0.7)',
  glassBorder: 'rgba(0,0,0,0.06)',
} as const

export const dark = {
  bg: '#0A0A0A',
  surface: '#111111',
  surfaceHover: '#1A1A1A',
  card: '#0D0D0D',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.15)',
  text: '#FFFFFF',
  secondary: '#A0A0A0',
  muted: '#666666',
  dim: '#333333',
  glass: 'rgba(10,10,10,0.7)',
  glassBorder: 'rgba(255,255,255,0.08)',
} as const

export const accent = {
  primary: '#F97316',
  primaryHover: '#EA580C',
  primaryLight: '#FFF7ED',
  primaryDark: '#FB923C',
} as const

export const fonts = {
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const

export const SUPPORTED_LANGS = ['ru', 'en', 'be', 'tt', 'ba', 'ce', 'sah', 'zh', 'hi'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]
export const DEFAULT_LANG: Lang = 'ru'

export const LANG_NAMES: Record<Lang, string> = {
  ru: 'Русский',
  en: 'English',
  be: 'Беларуская',
  tt: 'Татарча',
  ba: 'Башҡортса',
  ce: 'Нохчийн',
  sah: 'Саха тыла',
  zh: '中文',
  hi: 'हिन्दी',
}
