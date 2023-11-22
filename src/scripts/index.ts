import { executeFilter } from './executeFilter.script'

chrome.runtime.onMessage.addListener((request: { message: string }) => {
  // listen for messages sent from background.js
  if (request.message === 'executeFilter') {
    console.log('Linkedin Filter extension running...')
    executeFilter()
  }
})
