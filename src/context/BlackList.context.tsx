import { createContext, useReducer, useMemo } from 'react'
import { blackList } from '../data/Filters.data'
import { BlackListType } from '../types/BlackList.type'

export enum BlackListActions {
  UPDATE = 'update',
  DELETE = 'delete',
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
    return state.map((item) => {
      if (item.id === payload.id) {
        return payload
      }
      return item
    })
  },
  delete: (state, payload) => {
    return state.filter((item) => item.id !== payload.id)
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
