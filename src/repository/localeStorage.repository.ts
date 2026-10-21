import { Locale } from '../types/Locale.type'

const LOCALE_STORAGE_KEY = 'locale'

export const readStoredLocale = () => {
  return new Promise<unknown>((resolve) => {
    chrome.storage.local.get(LOCALE_STORAGE_KEY, (items) => {
      if (chrome.runtime.lastError) {
        resolve(undefined)
        return
      }

      resolve(items[LOCALE_STORAGE_KEY] as unknown)
    })
  })
}

export const writeStoredLocale = (locale: Locale) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ [LOCALE_STORAGE_KEY]: locale }, () => {
      void chrome.runtime.lastError
      resolve()
    })
  })
}
