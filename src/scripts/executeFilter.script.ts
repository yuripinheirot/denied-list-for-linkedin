import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'
import {
  extractCompanyFromJobCard,
  insertHideButtons,
  JOB_CARD_SELECTOR,
} from './createHideButton.script'

const defaultPropsObservers: MutationObserverInit = {
  childList: true,
  subtree: true,
}
const JOB_LIST_SELECTOR =
  '[data-testid="lazy-column"][componentkey="SearchResultsMainContent"]'
const observedJobLists = new WeakSet<Element>()

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const blackListPattern = () => {
  const blackList = localStorage.getItem(KeysStorage.BLACKLIST)
  if (!blackList) {
    localStorage.setItem(KeysStorage.BLACKLIST, JSON.stringify([]))
  }

  const blackListParsed = JSON.parse(blackList || '[]') as BlackListType[]

  if (blackListParsed.length === 0) {
    return new RegExp('$.^', 'i')
  }

  return new RegExp(
    blackListParsed
      .map((b) => escapeRegExp(b.description.toLowerCase()))
      .join('|'),
    'i'
  )
}

const removeJob = (element: HTMLElement) => {
  element.remove()
  console.log('Removed job: ', element.innerText.replaceAll('\n', ''))
}

const isJobBlacklisted = (element: HTMLElement) => {
  const company = extractCompanyFromJobCard(element)
  return company ? blackListPattern().test(company.toLowerCase()) : false
}

const processJobCards = (jobList: Element) => {
  const jobCards = jobList.querySelectorAll<HTMLElement>(JOB_CARD_SELECTOR)

  for (const jobCard of jobCards) {
    if (isJobBlacklisted(jobCard)) {
      removeJob(jobCard)
    }
  }

  insertHideButtons(jobList)
}

const addJobListObserver = async () => {
  let jobList = document.querySelector(JOB_LIST_SELECTOR)

  while (!jobList) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    jobList = document.querySelector(JOB_LIST_SELECTOR)
  }

  const currentJobList = jobList
  processJobCards(currentJobList)

  if (observedJobLists.has(currentJobList)) {
    return
  }

  const observer = new MutationObserver(() => {
    processJobCards(currentJobList)
  })

  observer.observe(currentJobList, defaultPropsObservers)
  observedJobLists.add(currentJobList)
}

export const executeFilter = async () => {
  await addJobListObserver()
}
