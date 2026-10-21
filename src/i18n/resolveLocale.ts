import { Locale } from '../types/Locale.type'

const PORTUGUESE = 'pt'
const ENGLISH = 'en'

const readNavigatorLanguages = (): readonly string[] => {
  if (navigator.languages.length > 0) {
    return navigator.languages
  }

  if (!navigator.language) {
    return []
  }

  return [navigator.language]
}

const primaryLanguage = (language: string) =>
  language.trim().toLowerCase().split('-')[0]

export const resolveBrowserLocale = (
  languages: readonly string[] = readNavigatorLanguages(),
): Locale => {
  for (const language of languages) {
    const primary = primaryLanguage(language)

    if (primary === PORTUGUESE) {
      return 'pt-BR'
    }

    if (primary === ENGLISH) {
      return 'en'
    }
  }

  return 'en'
}

export const parseStoredLocale = (stored: unknown): Locale | null => {
  if (stored === 'pt-BR' || stored === 'en') {
    return stored
  }

  return null
}
