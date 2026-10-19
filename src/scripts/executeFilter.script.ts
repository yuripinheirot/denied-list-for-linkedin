import { AppConfigType } from '../types/AppConfig.type'
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
const APPLIED_JOB_STATUSES = new Set([
  'applied',
  'candidatura enviada',
  'candidatou-se',
  'você se candidatou',
])
const APPLIED_HIDDEN_ATTRIBUTE = 'data-linkedin-applied-hidden'
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
    'i',
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

const shouldHideAppliedJobs = () => {
  const appConfig = localStorage.getItem(KeysStorage.APP_CONFIG)
  if (!appConfig) {
    return false
  }

  const appConfigParsed = JSON.parse(appConfig) as AppConfigType
  return appConfigParsed.hideAppliedJobs === true
}

const normalizeStatus = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2010-\u2015]/g, '-')
}

const isAppliedJob = (jobCard: HTMLElement) => {
  const paragraphs = jobCard.querySelectorAll('p')

  for (const paragraph of paragraphs) {
    if (APPLIED_JOB_STATUSES.has(normalizeStatus(paragraph.innerText))) {
      return true
    }
  }

  return false
}

const getJobCardContainer = (jobCard: HTMLElement, jobList: Element) => {
  let container = jobCard

  while (
    container.parentElement &&
    container.parentElement !== jobList &&
    container.parentElement.querySelectorAll(JOB_CARD_SELECTOR).length === 1
  ) {
    container = container.parentElement
  }

  return container
}

const hideAppliedJob = (container: HTMLElement) => {
  if (container.getAttribute(APPLIED_HIDDEN_ATTRIBUTE) === 'true') {
    return
  }

  container.setAttribute(APPLIED_HIDDEN_ATTRIBUTE, 'true')
  container.style.display = 'none'
}

const showAppliedJob = (container: HTMLElement) => {
  if (container.getAttribute(APPLIED_HIDDEN_ATTRIBUTE) !== 'true') {
    return
  }

  container.style.display = ''
  container.removeAttribute(APPLIED_HIDDEN_ATTRIBUTE)
}

const processJobCards = (jobList: Element) => {
  const jobCards = jobList.querySelectorAll<HTMLElement>(JOB_CARD_SELECTOR)
  const hideAppliedJobs = shouldHideAppliedJobs()

  for (const jobCard of jobCards) {
    if (isJobBlacklisted(jobCard)) {
      removeJob(jobCard)
      continue
    }

    const container = getJobCardContainer(jobCard, jobList)

    if (hideAppliedJobs && isAppliedJob(jobCard)) {
      hideAppliedJob(container)
      continue
    }

    showAppliedJob(container)
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
