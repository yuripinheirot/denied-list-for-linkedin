import { AppConfigType } from '../types/AppConfig.type'
import { KeysStorage } from '../types/KeysStorage.type'
import { executeFilter } from './executeFilter.script'

const getAppConfig = () => {
  const appConfig = localStorage.getItem(KeysStorage.APP_CONFIG)
  if (appConfig) {
    return JSON.parse(appConfig) as AppConfigType
  }

  return null
}
chrome.runtime.onMessage.addListener((request: { message: string }) => {
  // listen for messages sent from background.js
  if (request.message === 'executeFilter' && getAppConfig()?.active) {
    console.log('Linkedin Filter extension running...')
    executeFilter()
  }
})
