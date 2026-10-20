import { readAppConfig, readDeniedList } from './storage/pageStorage.script'

export const initializeParams = () => {
  readAppConfig()
  readDeniedList()
}
