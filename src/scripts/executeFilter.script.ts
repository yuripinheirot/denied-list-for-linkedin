import {
  insertHideButtons,
  JOB_CARD_SELECTOR,
} from './createHideButton.script'
import { appliedJobsFilter } from './filters/appliedJobs.filter'
import { companyBlacklistFilter } from './filters/companyBlacklist.filter'
import { JobFilter } from './filters/jobFilter.type'

const defaultPropsObservers: MutationObserverInit = {
  childList: true,
  subtree: true,
}
const JOB_LIST_SELECTOR =
  '[data-testid="lazy-column"][componentkey="SearchResultsMainContent"]'
const observedJobLists = new WeakSet<Element>()
const jobFilters: JobFilter[] = [companyBlacklistFilter, appliedJobsFilter]

const processJobCards = (jobList: Element) => {
  const jobCards = jobList.querySelectorAll<HTMLElement>(JOB_CARD_SELECTOR)

  for (const jobCard of jobCards) {
    for (const filter of jobFilters) {
      const handled = filter.apply({ jobCard, jobList })
      if (handled) {
        break
      }
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
