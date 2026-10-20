import { AppConfigType } from '../../types/AppConfig.type'
import { KeysStorage } from '../../types/KeysStorage.type'
import { JOB_CARD_SELECTOR } from '../createHideButton.script'
import { JobFilter } from './jobFilter.type'

const APPLIED_JOB_STATUSES = new Set([
  'applied',
  'candidatura enviada',
  'candidatou-se',
  'você se candidatou',
])
const APPLIED_HIDDEN_ATTRIBUTE = 'data-linkedin-applied-hidden'

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

export const appliedJobsFilter: JobFilter = {
  apply: ({ jobCard, jobList }) => {
    const container = getJobCardContainer(jobCard, jobList)

    if (shouldHideAppliedJobs() && isAppliedJob(jobCard)) {
      hideAppliedJob(container)
      return true
    }

    showAppliedJob(container)
    return false
  },
}
