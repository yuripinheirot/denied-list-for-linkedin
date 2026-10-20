import { createContext, useEffect, useState } from 'react'

import { initialAppConfig, parseAppConfig } from '../appConfig/parseAppConfig'
import {
  executeFilterOnActiveTab,
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import { AppConfigType } from '../types/AppConfig.type'
import {
  KeysStorage,
  PREVIOUS_APP_CONFIG_STORAGE_KEY,
} from '../types/KeysStorage.type'

export const AppConfigContext = createContext<{
  appConfig: AppConfigType
  appConfigActions: {
    setActiveStatus: (status: boolean) => Promise<void>
  }
}>({
  appConfig: initialAppConfig,
  appConfigActions: {
    setActiveStatus: async () => {},
  },
})

type AppConfigProviderProps = {
  children: React.ReactNode
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<AppConfigType>(initialAppConfig)

  const loadStore = async () => {
    const data = await getItemLocalStorage<unknown>(KeysStorage.APP_CONFIG)

    if (data === undefined) {
      return
    }

    if (data !== null) {
      setAppConfig(parseAppConfig(data))
      return
    }

    const previous = await getItemLocalStorage<unknown>(
      PREVIOUS_APP_CONFIG_STORAGE_KEY
    )
    const config = parseAppConfig(previous)

    if (previous !== undefined) {
      await setItemLocalStorage({
        key: KeysStorage.APP_CONFIG,
        value: config,
      })
    }

    setAppConfig(config)
  }

  const appConfigActions = {
    setActiveStatus: async (status: boolean) => {
      const nextConfig = { active: status }

      await setItemLocalStorage({
        key: KeysStorage.APP_CONFIG,
        value: nextConfig,
      })
      setAppConfig(nextConfig)
      await executeFilterOnActiveTab()
    },
  }

  useEffect(() => {
    void loadStore()
  }, [])

  return (
    <AppConfigContext.Provider value={{ appConfig, appConfigActions }}>
      {children}
    </AppConfigContext.Provider>
  )
}
