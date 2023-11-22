chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url.includes('https://www.linkedin.com/jobs/search') &&
    tab.status === 'complete'
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: 'executeFilter',
    })
  }
})
