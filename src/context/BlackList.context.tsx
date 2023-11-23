import { createContext, useEffect, useState } from 'react'

import {
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import { BlackListType } from '../types/BlackList.type'
import { FiltersProviderProps } from '../types/BlackListContext.type'
import { KeysStorage } from '../types/KeysStorage.type'

export const initialStateBlackList: BlackListType[] = []
export const BlackListContext = createContext<{
  blackListStore: BlackListType[]
  blackListActions: {
    update: (payload: BlackListType) => Promise<void>
    delete: (payload: BlackListType) => Promise<void>
    create: (payload: BlackListType) => Promise<void>
  }
}>({
  blackListStore: initialStateBlackList,
  blackListActions: {
    update: async () => {},
    delete: async () => {},
    create: async () => {},
  },
})

export const BlackListProvider = ({ children }: FiltersProviderProps) => {
  const [blackListStore, setBlackListStore] = useState<BlackListType[]>([])

  const loadStore = async () => {
    const data = await getItemLocalStorage<BlackListType[]>(
      KeysStorage.BLACKLIST
    )
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

      setItemLocalStorage({ key: KeysStorage.BLACKLIST, value: newState })
      await loadStore()
    },
    delete: async (payload: BlackListType): Promise<void> => {
      const index = blackListStore.findIndex((item) => item.id === payload.id)
      if (index === -1) {
        return
      }

      const newState = [...blackListStore]
      newState.splice(index, 1)

      setItemLocalStorage({ key: KeysStorage.BLACKLIST, value: newState })
      await loadStore()
    },
    create: async (payload: BlackListType): Promise<void> => {
      const newFilter = { ...payload, id: Date.now().toString() }
      const newState = [...blackListStore, newFilter]

      setItemLocalStorage({ key: KeysStorage.BLACKLIST, value: newState })
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
