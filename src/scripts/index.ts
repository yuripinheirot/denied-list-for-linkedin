import { executeFilter } from './executeFilter.script'
import { restoreFilteredJobs } from './filters/wordlist.filter'
import { initializeParams } from './initializeParams.script'
import { readAppConfig } from './storage/pageStorage.script'

initializeParams()

chrome.runtime.onMessage.addListener((request: { message?: string }) => {
  if (request.message !== 'executeFilter') {
    return
  }

  if (!readAppConfig().active) {
    restoreFilteredJobs()
    return
  }

  console.log('Linkedin Filter extension running...')
  void executeFilter()
})
