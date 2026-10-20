import { createContext, useEffect, useState } from 'react'

import {
  normalizeDeniedList,
  parseDeniedList,
} from '../deniedList/parseDeniedList'
import {
  executeFilterOnActiveTab,
  getItemLocalStorage,
  setItemLocalStorage,
} from '../repository/chromeEvents.repository'
import {
  KeysStorage,
  PREVIOUS_DENIED_LIST_STORAGE_KEY,
} from '../types/KeysStorage.type'

export const DeniedListContext = createContext<{
  deniedList: string[]
  deniedListActions: {
    create: (term: string) => Promise<void>
    update: (current: string, next: string) => Promise<void>
    delete: (term: string) => Promise<void>
  }
}>({
  deniedList: [],
  deniedListActions: {
    create: async () => {},
    update: async () => {},
    delete: async () => {},
  },
})

type DeniedListProviderProps = {
  children: React.ReactNode
}

export const DeniedListProvider = ({ children }: DeniedListProviderProps) => {
  const [deniedList, setDeniedList] = useState<string[]>([])

  const loadStore = async () => {
    const data = await getItemLocalStorage<unknown>(KeysStorage.DENIED_LIST)

    if (data === undefined) {
      return
    }

    if (data !== null) {
      setDeniedList(parseDeniedList(data))
      return
    }

    const previous = await getItemLocalStorage<unknown>(
      PREVIOUS_DENIED_LIST_STORAGE_KEY,
    )
    const terms = parseDeniedList(previous)

    if (previous !== undefined) {
      await setItemLocalStorage({
        key: KeysStorage.DENIED_LIST,
        value: terms,
      })
    }

    setDeniedList(terms)
  }

  const persist = async (terms: string[]) => {
    const normalized = normalizeDeniedList(terms)

    await setItemLocalStorage({
      key: KeysStorage.DENIED_LIST,
      value: normalized,
    })
    setDeniedList(normalized)
    await executeFilterOnActiveTab()
  }

  const deniedListActions = {
    create: async (term: string) => {
      await persist([...deniedList, term])
    },
    update: async (current: string, next: string) => {
      await persist(deniedList.map((term) => (term === current ? next : term)))
    },
    delete: async (term: string) => {
      await persist(deniedList.filter((item) => item !== term))
    },
  }

  useEffect(() => {
    void loadStore()
  }, [])

  return (
    <DeniedListContext.Provider value={{ deniedList, deniedListActions }}>
      {children}
    </DeniedListContext.Provider>
  )
}
