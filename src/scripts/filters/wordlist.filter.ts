import { buildDeniedListPattern } from '../../deniedList/deniedListPattern'
import { getJobCardContainer, JOB_CARD_SELECTOR } from '../jobCard'
import { readDeniedList } from '../storage/pageStorage.script'

const HIDDEN_ATTRIBUTE = 'data-denied-list-hidden'
const CARD_TEXT_ATTRIBUTE = 'data-denied-list-text'

const normalizeCardText = (value: string) => {
  return value.replace(/\u00a0/g, ' ')
}

const readCardText = (jobCard: HTMLElement) => {
  const parts: string[] = []
  const walker = document.createTreeWalker(jobCard, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()

  while (current) {
    const value = normalizeCardText(current.textContent ?? '').trim()

    if (value) {
      parts.push(value)
    }

    current = walker.nextNode()
  }

  const stableText = parts.join('\n')

  if (stableText) {
    jobCard.setAttribute(CARD_TEXT_ATTRIBUTE, stableText)
    return stableText
  }

  return jobCard.getAttribute(CARD_TEXT_ATTRIBUTE) ?? ''
}

const hideJob = (container: HTMLElement) => {
  if (container.getAttribute(HIDDEN_ATTRIBUTE) === 'true') {
    return
  }

  container.setAttribute(HIDDEN_ATTRIBUTE, 'true')
  container.style.display = 'none'
}

const showJob = (container: HTMLElement) => {
  if (container.getAttribute(HIDDEN_ATTRIBUTE) !== 'true') {
    return
  }

  container.style.display = ''
  container.removeAttribute(HIDDEN_ATTRIBUTE)
}

export const restoreFilteredJobs = () => {
  const hiddenJobs = document.querySelectorAll<HTMLElement>(
    `[${HIDDEN_ATTRIBUTE}]`
  )

  for (const container of hiddenJobs) {
    showJob(container)
  }
}

export const applyWordlistFilter = (jobList: Element) => {
  const pattern = buildDeniedListPattern(readDeniedList())
  const jobCards = jobList.querySelectorAll<HTMLElement>(JOB_CARD_SELECTOR)

  for (const jobCard of jobCards) {
    const container = getJobCardContainer(jobCard, jobList)
    const matches = pattern?.test(readCardText(jobCard)) ?? false

    if (matches) {
      hideJob(container)
      continue
    }

    showJob(container)
  }
}
