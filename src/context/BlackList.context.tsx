import { createContext, useEffect, useState } from 'react'
import {
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import { BlackListType } from '../types/BlackList.type'

import { FiltersProviderProps } from './types/BlackListContext.type'

const keyStorage = 'blackList'

export const BlackListContext = createContext<{
  blackListStore: BlackListType[]
  blackListActions: {
    update: (payload: BlackListType) => Promise<void>
    delete: (payload: BlackListType) => Promise<void>
    create: (payload: BlackListType) => Promise<void>
  }
}>({} as any)

export const BlackListProvider = ({ children }: FiltersProviderProps) => {
  const [blackListStore, setBlackListStore] = useState<BlackListType[]>([])

  const loadStore = async () => {
    const data = await getItemLocalStorage(keyStorage)
    setBlackListStore(data)
  }

  const actions = {
    update: async (payload: BlackListType): Promise<void> => {
      const index = blackListStore.findIndex((item) => item.id === payload.id)
      if (index === -1) {
        return
      }

      const newState = [...blackListStore]
      newState[index] = payload

      setItemLocalStorage({ key: keyStorage, value: newState })
      await loadStore()
    },
    delete: async (payload: BlackListType): Promise<void> => {
      const index = blackListStore.findIndex((item) => item.id === payload.id)
      if (index === -1) {
        return
      }

      const newState = [...blackListStore]
      newState.splice(index, 1)

      setItemLocalStorage({ key: keyStorage, value: newState })
      await loadStore()
    },
    create: async (payload: BlackListType): Promise<void> => {
      const newFilter = { ...payload, id: Date.now().toString() }
      const newState = [...blackListStore, newFilter]

      setItemLocalStorage({ key: keyStorage, value: newState })
      await loadStore()
    },
  }

  useEffect(() => {
    loadStore()
  }, [])

  return (
    <BlackListContext.Provider
      value={{ blackListStore, blackListActions: actions }}
    >
      {children}
    </BlackListContext.Provider>
  )
}
