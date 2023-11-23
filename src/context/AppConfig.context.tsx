import { createContext, useEffect, useState } from 'react'

import {
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import { AppConfigType } from '../types/AppConfig.type'
import { KeysStorage } from '../types/KeysStorage.type'

const initialState: AppConfigType = {
  active: true,
}

export const AppConfigContext = createContext<{
  appConfig: AppConfigType
  appConfigActions: { setActiveStatus: (status: boolean) => Promise<void> }
}>({
  appConfig: initialState,
  appConfigActions: { setActiveStatus: async () => {} },
})

type AppConfigProviderProps = {
  children: React.ReactNode
}
export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<AppConfigType>(initialState)

  const loadStore = async () => {
    const data = await getItemLocalStorage<AppConfigType>(
      KeysStorage.APP_CONFIG
    )

    if (!data) {
      setItemLocalStorage({ key: KeysStorage.APP_CONFIG, value: initialState })
    }

    setAppConfig(data || initialState)
  }

  const appConfigActions = {
    setActiveStatus: async (status: boolean) => {
      const newState = { ...appConfig, active: status }
      setItemLocalStorage({ key: KeysStorage.APP_CONFIG, value: newState })
      await loadStore()
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
