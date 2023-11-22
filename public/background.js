chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log({ changeInfo })
  if (
    changeInfo.url &&
    changeInfo.url.includes('https://www.linkedin.com/jobs/search')
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: 'executeFilter',
    })
  }
})
