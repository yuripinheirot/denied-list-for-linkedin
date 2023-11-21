import { createContext, useReducer, useMemo } from 'react'
import { blackList } from '../data/Filters.data'
import { BlackListType } from '../types/BlackList.type'

export enum BlackListActions {
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

type BlackListAction = {
  type: BlackListActions
  payload: BlackListType
}

type BlackListContextType = {
  state: BlackListType[]
  dispatch: React.Dispatch<BlackListAction>
}

type FiltersProviderProps = {
  children: React.ReactNode
}

const initialState: BlackListType[] = blackList

export const BlackListContext = createContext<BlackListContextType>(
  {} as BlackListContextType
)

const actions: Record<
  BlackListActions,
  (state: BlackListType[], payload: BlackListType) => BlackListType[]
> = {
  update: (state, payload) => {
    const index = state.findIndex((item) => item.id === payload.id)
    if (index === -1) {
      return state
    }

    const newState = [...state]
    newState[index] = payload

    return newState
  },
  delete: (state, payload) => {
    const index = state.findIndex((item) => item.id === payload.id)
    if (index === -1) {
      return state
    }

    const newState = [...state]
    newState.splice(index, 1)

    return newState
  },
  create: (state, payload) => {
    const newFilter = { ...payload, id: Date.now().toString() }
    return [...state, newFilter]
  },
}

function reducer(
  state: BlackListType[],
  action: BlackListAction
): BlackListType[] {
  return actions[action.type](state, action.payload)
}

export const BlackListProvider = ({ children }: FiltersProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <BlackListContext.Provider value={contextValue}>
      {children}
    </BlackListContext.Provider>
  )
}
