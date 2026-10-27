import { executeFilter } from './executeFilter.script'
import { restoreFilteredJobs } from './filters/wordlist.filter'
import { initializeParams } from './initializeParams.script'
import {
  closePostApplyModalIfEnabled,
  startPostApplyModalObserver,
} from './postApplyModal.script'
import { readAppConfig } from './storage/pageStorage.script'
import { startTechStackPanel } from './techStack/techStackPanel.script'

initializeParams()
startTechStackPanel()
startPostApplyModalObserver()

chrome.runtime.onMessage.addListener((request: { message?: string }) => {
  if (request.message !== 'executeFilter') {
    return
  }

  closePostApplyModalIfEnabled()

  if (!readAppConfig().active) {
    restoreFilteredJobs()
    return
  }

  console.log('Linkedin Filter extension running...')
  void executeFilter()
})
