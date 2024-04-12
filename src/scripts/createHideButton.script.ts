import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'

const createHideButton = () => {
  const divElement = document.createElement('div')
  divElement.style.textAlign = 'right'
  divElement.id = 'hide-button'

  const hideButton = document.createElement('button')
  hideButton.textContent = 'Filtrar'
  hideButton.style.padding = '5px 10px'
  hideButton.style.margin = '0px 10px 10px 0px'
  hideButton.style.backgroundColor = '#f2f2f2'
  hideButton.style.color = '#2e2e2e'
  hideButton.style.border = '1px solid black'
  hideButton.style.borderRadius = '5px'

  const getGrandParentElement = (element: HTMLElement) => {
    return element.parentElement?.parentElement || null
  }

  const extractCompanyFromElement = (element: HTMLElement) => {
    return element.innerText.split('\n')[1] || null
  }

  const addToBlacklist = (company: string) => {
    try {
      const blackList = localStorage.getItem(KeysStorage.BLACKLIST)
      const blackListParsed = blackList
        ? (JSON.parse(blackList) as BlackListType[])
        : []

      const newFilter = {
        id: Date.now().toString(),
        description: company,
      }

      blackListParsed.push(newFilter)

      localStorage.setItem(
        KeysStorage.BLACKLIST,
        JSON.stringify(blackListParsed)
      )
    } catch (error) {
      console.error('Error updating blacklist:', error)
    }
  }

  hideButton.addEventListener('click', (e) => {
    const parentElement = getGrandParentElement(e.target as HTMLElement)

    if (parentElement) {
      const company = extractCompanyFromElement(parentElement)

      if (company) {
        addToBlacklist(company)
      }
    }

    chrome.runtime.sendMessage({
      message: 'executeFilter',
    })
  })

  divElement.appendChild(hideButton)

  return divElement
}

export const insertHideButtons = () => {
  const jobList = document.querySelectorAll(
    '#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul > li'
  )

  for (const children of jobList) {
    if (!children.querySelector('#hide-button')) {
      children.append(createHideButton())
    }
  }
}
