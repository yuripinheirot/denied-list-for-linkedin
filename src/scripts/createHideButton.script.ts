import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'

export const JOB_CARD_SELECTOR =
  '[role="button"][componentkey^="job-card-component-ref-"]'
const HIDE_BUTTON_ATTRIBUTE = 'data-linkedin-company-filter-button'
const DISMISS_BUTTON_SELECTOR =
  'button[aria-label^="Dismiss "][aria-label$=" job"]'

export const extractCompanyFromJobCard = (jobCard: HTMLElement) => {
  const paragraphs = Array.from(jobCard.querySelectorAll('p'))
    .map((paragraph) => paragraph.innerText.trim())
    .filter(Boolean)

  return paragraphs[1] || null
}

const createHideButton = (jobCard: HTMLElement) => {
  const hideButton = document.createElement('button')
  hideButton.textContent = 'Filtrar'
  hideButton.type = 'button'
  hideButton.setAttribute(HIDE_BUTTON_ATTRIBUTE, 'true')
  hideButton.setAttribute('aria-label', 'Filtrar empresa')
  hideButton.style.padding = '5px 10px'
  hideButton.style.marginRight = '8px'
  hideButton.style.backgroundColor = '#f2f2f2'
  hideButton.style.color = '#2e2e2e'
  hideButton.style.border = '1px solid black'
  hideButton.style.borderRadius = '5px'
  hideButton.style.cursor = 'pointer'

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

  hideButton.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const company = extractCompanyFromJobCard(jobCard)

    if (company) {
      addToBlacklist(company)
    } else {
      console.error('Could not identify the company in the job card')
      return
    }

    chrome.runtime.sendMessage({
      message: 'executeFilter',
    })
  })

  return hideButton
}

export const insertHideButtons = (root: ParentNode = document) => {
  const jobCards = root.querySelectorAll<HTMLElement>(JOB_CARD_SELECTOR)

  for (const jobCard of jobCards) {
    if (jobCard.querySelector(`[${HIDE_BUTTON_ATTRIBUTE}]`)) {
      continue
    }

    const dismissButton =
      jobCard.querySelector<HTMLButtonElement>(DISMISS_BUTTON_SELECTOR)

    dismissButton?.parentElement?.insertBefore(
      createHideButton(jobCard),
      dismissButton
    )
  }
}
