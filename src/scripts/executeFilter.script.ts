import { applyWordlistFilter, restoreFilteredJobs } from './filters/wordlist.filter'
import { readAppConfig } from './storage/pageStorage.script'

const defaultPropsObservers: MutationObserverInit = {
  childList: true,
  subtree: true,
}
const JOB_LIST_SELECTOR =
  '[data-testid="lazy-column"][componentkey="SearchResultsMainContent"]'
const observedJobLists = new WeakSet<Element>()

const processJobCards = (jobList: Element) => {
  if (!readAppConfig().active) {
    restoreFilteredJobs()
    return
  }

  applyWordlistFilter(jobList)
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
