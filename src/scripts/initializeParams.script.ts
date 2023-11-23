import { KeysStorage } from '../types/KeysStorage.type'

export const initializeParams = () => {
  const appConfig = localStorage.getItem(KeysStorage.APP_CONFIG)
  if (!appConfig) {
    localStorage.setItem(
      KeysStorage.APP_CONFIG,
      JSON.stringify({
        active: true,
      })
    )
  }

  const blackListConfig = localStorage.getItem(KeysStorage.BLACKLIST)
  if (!blackListConfig) {
    localStorage.setItem(KeysStorage.BLACKLIST, JSON.stringify([]))
  }
}
