chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == 'set') {
    localStorage.setItem(request.key, JSON.stringify(request.value))
  }
  if (request.action == 'get') {
    sendResponse(JSON.parse(localStorage.getItem(request.key)))
  }
})
