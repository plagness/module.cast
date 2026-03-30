import { createContext, useContext } from 'react'
import { SUPPORTED_LANGS, DEFAULT_LANG, type Lang } from '../design'

import ru from './ru.json'
import en from './en.json'
import zh from './zh.json'

type Messages = Record<string, string>

const catalogs: Record<Lang, Messages> = {
  ru,
  en,
  zh,
  be: ru, // fallback to Russian
  tt: ru,
  ba: ru,
  ce: ru,
  sah: ru,
  hi: en, // fallback to English
}

export function t(lang: Lang, key: string): string {
  return catalogs[lang]?.[key] || catalogs.ru[key] || key
}

export function detectLang(): Lang {
  const stored = localStorage.getItem('lang') as Lang | null
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored

  for (const bl of navigator.languages) {
    const code = bl.split('-')[0] as Lang
    if (SUPPORTED_LANGS.includes(code)) return code
  }
  return DEFAULT_LANG
}

export function isValidLang(lang: string): lang is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang)
}

type I18nCtx = { lang: Lang; t: (key: string) => string }
export const I18nContext = createContext<I18nCtx>({ lang: 'ru', t: (k) => k })
export function useI18n() { return useContext(I18nContext) }
