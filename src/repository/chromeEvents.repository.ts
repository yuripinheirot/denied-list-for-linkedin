type setItemModel = {
  key: string
  value: any
}

export const getItemLocalStorage = async <T = any>(key: string) => {
  return new Promise<T>((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        void chrome.tabs.sendMessage(
          tabs[0].id as number,
          {
            action: 'get',
            key,
          },
          (response: T) => {
            resolve(response)
          }
        )
      }
    )
  })
}

const sendMessageToActiveTab = (message: Record<string, unknown>) => {
  return new Promise<void>((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        const tabId = tabs[0]?.id

        if (!tabId) {
          resolve()
          return
        }

        chrome.tabs.sendMessage(tabId, message, () => {
          void chrome.runtime.lastError
          resolve()
        })
      }
    )
  })
}

export const setItemLocalStorage = (payload: setItemModel) => {
  return sendMessageToActiveTab({
    action: 'set',
    ...payload,
  })
}

export const executeFilterOnActiveTab = () => {
  return sendMessageToActiveTab({
    message: 'executeFilter',
  })
}
