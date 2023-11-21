chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == 'set') {
    console.log('recebeu mensagem')
    localStorage.setItem(request.key, JSON.stringify(request.value))
  }
  if (request.action == 'get') {
    console.log('recebeu mensagem')
    sendResponse(JSON.parse(localStorage.getItem(request.key)))
  }
})
