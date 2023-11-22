import { BlackListType } from '../../types/BlackList.type'

export enum BlackListActions {
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

export type BlackListAction = {
  type: BlackListActions
  payload: BlackListType
}

export type BlackListContextType = {
  state: BlackListType[]
  dispatch: React.Dispatch<BlackListAction>
}

export type FiltersProviderProps = {
  children: React.ReactNode
}
