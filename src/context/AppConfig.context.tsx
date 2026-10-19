import { createContext, useEffect, useState } from 'react'

import {
  executeFilterOnActiveTab,
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import { AppConfigType } from '../types/AppConfig.type'
import { KeysStorage } from '../types/KeysStorage.type'

export const initialStateAppConfig: AppConfigType = {
  active: true,
  hideAppliedJobs: false,
}

export const AppConfigContext = createContext<{
  appConfig: AppConfigType
  appConfigActions: {
    setActiveStatus: (status: boolean) => Promise<void>
    setHideAppliedJobs: (hideAppliedJobs: boolean) => Promise<void>
  }
}>({
  appConfig: initialStateAppConfig,
  appConfigActions: {
    setActiveStatus: async () => {},
    setHideAppliedJobs: async () => {},
  },
})

type AppConfigProviderProps = {
  children: React.ReactNode
}
export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<AppConfigType>(
    initialStateAppConfig
  )

  const loadStore = async () => {
    const data = await getItemLocalStorage<Partial<AppConfigType> | null>(
      KeysStorage.APP_CONFIG
    )

    if (!data) {
      await setItemLocalStorage({
        key: KeysStorage.APP_CONFIG,
        value: initialStateAppConfig,
      })
      setAppConfig(initialStateAppConfig)
      return
    }

    setAppConfig({ ...initialStateAppConfig, ...data })
  }

  const appConfigActions = {
    setActiveStatus: async (status: boolean) => {
      const newState = { ...appConfig, active: status }
      await setItemLocalStorage({
        key: KeysStorage.APP_CONFIG,
        value: newState,
      })
      await loadStore()
    },
    setHideAppliedJobs: async (hideAppliedJobs: boolean) => {
      const newState = { ...appConfig, hideAppliedJobs }
      await setItemLocalStorage({
        key: KeysStorage.APP_CONFIG,
        value: newState,
      })
      await loadStore()
      await executeFilterOnActiveTab()
    },
  }

  useEffect(() => {
    loadStore()
  }, [])

  return (
    <AppConfigContext.Provider value={{ appConfig, appConfigActions }}>
      {children}
    </AppConfigContext.Provider>
  )
}
