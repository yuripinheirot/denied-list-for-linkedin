import { executeFilter } from './executeFilter.script'

executeFilter()

chrome.runtime.onMessage.addListener((request: { message: string }) => {
  // listen for messages sent from background.js
  if (request.message === 'executeFilter') {
    executeFilter()
  }
})
