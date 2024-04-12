chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url.includes('https://www.linkedin.com/jobs') &&
    tab.status === 'complete'
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: 'executeFilter',
    })
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'executeFilter' && sender.tab && sender.tab.id) {
    chrome.tabs.sendMessage(sender.tab.id, { message: 'executeFilter' })
  }
})
