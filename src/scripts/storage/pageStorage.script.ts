import { parseAppConfig } from '../../appConfig/parseAppConfig'
import { parseDeniedList } from '../../deniedList/parseDeniedList'
import {
  KeysStorage,
  PREVIOUS_APP_CONFIG_STORAGE_KEY,
  PREVIOUS_DENIED_LIST_STORAGE_KEY,
} from '../../types/KeysStorage.type'

const readStoredValue = (key: string) => {
  const raw = localStorage.getItem(key)

  if (raw === null) {
    return null
  }

  try {
    return JSON.parse(raw) as unknown
  } catch (error) {
    console.error(`Invalid stored value for ${key}`, error)
    return null
  }
}

export const readDeniedList = () => {
  const current = readStoredValue(KeysStorage.DENIED_LIST)

  if (current !== null) {
    return parseDeniedList(current)
  }

  const terms = parseDeniedList(
    readStoredValue(PREVIOUS_DENIED_LIST_STORAGE_KEY)
  )
  localStorage.setItem(KeysStorage.DENIED_LIST, JSON.stringify(terms))

  return terms
}

export const readAppConfig = () => {
  const current = readStoredValue(KeysStorage.APP_CONFIG)

  if (current !== null) {
    return parseAppConfig(current)
  }

  const config = parseAppConfig(
    readStoredValue(PREVIOUS_APP_CONFIG_STORAGE_KEY)
  )
  localStorage.setItem(KeysStorage.APP_CONFIG, JSON.stringify(config))

  return config
}
