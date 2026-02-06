import { createContext, useContext, useState, useCallback } from 'react'
import { sv } from './sv'
import { en } from './en'
import type { Translations } from './sv'

export type Language = 'sv' | 'en'

const translations: Record<Language, Translations> = { sv, en }

interface I18nContext {
  lang: Language
  t: Translations
  toggle: () => void
}

export const LanguageContext = createContext<I18nContext>({
  lang: 'sv',
  t: sv,
  toggle: () => {},
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useI18nState() {
  const [lang, setLang] = useState<Language>('sv')
  const toggle = useCallback(() => setLang(l => (l === 'sv' ? 'en' : 'sv')), [])
  return { lang, t: translations[lang], toggle }
}
