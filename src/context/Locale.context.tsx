import { createContext, useEffect, useState } from 'react'

import { Messages, messagesByLocale } from '../i18n/messages'
import {
  parseStoredLocale,
  resolveBrowserLocale,
} from '../i18n/resolveLocale'
import {
  readStoredLocale,
  writeStoredLocale,
} from '../repository/localeStorage.repository'
import { Locale } from '../types/Locale.type'

type LocaleContextValue = {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => Promise<void>
}

const browserLocale = resolveBrowserLocale()

export const LocaleContext = createContext<LocaleContextValue>({
  locale: browserLocale,
  messages: messagesByLocale[browserLocale],
  setLocale: async () => {},
})

type LocaleProviderProps = {
  children: React.ReactNode
}

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(browserLocale)

  const setLocale = async (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    await writeStoredLocale(nextLocale)
  }

  useEffect(() => {
    const loadStoredLocale = async () => {
      const storedLocale = parseStoredLocale(await readStoredLocale())

      if (!storedLocale) {
        return
      }

      setLocaleState(storedLocale)
    }

    void loadStoredLocale()
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleContext.Provider
      value={{
        locale,
        messages: messagesByLocale[locale],
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
