type setItemModel = {
  key: string
  value: any
}

export const getItemLocalStorage = async <T = undefined>(key: string) => {
  return new Promise<T | undefined>((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        void chrome.tabs.sendMessage(
          tabs[0].id as number,
          {
            action: 'get',
            key,
          },
          (response: T | undefined) => {
            resolve(response)
          }
        )
      }
    )
  })
}

export const setItemLocalStorage = (payload: setItemModel) => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]) => {
      console.log('enviou mensagem')
      void chrome.tabs.sendMessage(tabs[0].id as number, {
        action: 'set',
        ...payload,
      })
    }
  )
}
