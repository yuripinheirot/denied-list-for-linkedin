import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'

export const JOB_CARD_SELECTOR =
  '[role="button"][componentkey^="job-card-component-ref-"]'
const HIDE_BUTTON_ATTRIBUTE = 'data-linkedin-company-filter-button'
const HIDE_BUTTON_STYLE_ID = 'linkedin-company-filter-button-style'
const DISMISS_BUTTON_SELECTOR =
  'button[aria-label^="Dismiss "][aria-label$=" job"]'

const ensureHideButtonStyles = () => {
  if (document.getElementById(HIDE_BUTTON_STYLE_ID)) {
    return
  }

  const style = document.createElement('style')
  style.id = HIDE_BUTTON_STYLE_ID
  style.textContent = `
    button[${HIDE_BUTTON_ATTRIBUTE}] {
      display: inline-flex;
      align-items: center;
      align-self: center;
      flex: 0 0 auto;
      height: 28px;
      margin-right: 4px;
      padding: 0 12px;
      border: 1px solid #0a66c2;
      border-radius: 999px;
      background-color: transparent;
      color: #0a66c2;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      box-sizing: border-box;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    button[${HIDE_BUTTON_ATTRIBUTE}]:hover {
      background-color: #0a66c2;
      color: #ffffff;
    }

    button[${HIDE_BUTTON_ATTRIBUTE}]:focus-visible {
      outline: 2px solid #0a66c2;
      outline-offset: 2px;
    }
  `
  document.head.appendChild(style)
}

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
  ensureHideButtonStyles()
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
