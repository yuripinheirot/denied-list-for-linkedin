import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'

const jobListSelector = '#main > div > div.scaffold-layout__list > div > ul'
const jobListItemSelector = `${jobListSelector} > li`

const blackListPattern = () => {
  const blackList = localStorage.getItem(KeysStorage.BLACKLIST)
  if (!blackList) {
    localStorage.setItem(KeysStorage.BLACKLIST, JSON.stringify([]))
  }

  const blackListParsed = JSON.parse(blackList || '[]') as BlackListType[]

  return new RegExp(
    blackListParsed.map((b) => b.description.toLowerCase()).join('|'),
    'i'
  )
}

const removeJob = (element: Element) => {
  if (element instanceof HTMLLIElement) {
    element.remove()
    console.log('Removed job: ', element.innerText.replaceAll('\n', ''))
  }
}

const removeJobsFromJobList = () => {
  const jobsItens = document.querySelectorAll(jobListItemSelector)

  for (const jobItem of jobsItens) {
    if (jobItem instanceof HTMLLIElement && isJobBlacklisted(jobItem)) {
      removeJob(jobItem)
    }
  }
}

const isJobBlacklisted = (element: HTMLElement) => {
  console.log({ blackListPattern: blackListPattern() })
  return blackListPattern().test(element.innerText.toLowerCase())
}

const addJobItemListener = (jobItem: HTMLLIElement) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.addedNodes[0] instanceof HTMLElement &&
        isJobBlacklisted(mutation.addedNodes[0])
      ) {
        removeJob(jobItem)
      }
    }
  })

  observer.observe(jobItem, {
    childList: true,
    characterData: true,
    attributes: true,
  })

  if (isJobBlacklisted(jobItem)) {
    removeJob(jobItem)
  }
}

const addJobListObserver = () => {
  const jobList = document.querySelector(jobListSelector)
  if (!jobList) return

  removeJobsFromJobList()

  for (const children of jobList.childNodes) {
    if (children instanceof HTMLLIElement) {
      addJobItemListener(children)
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.addedNodes.length &&
        mutation.addedNodes[0] instanceof HTMLLIElement
      ) {
        addJobItemListener(mutation.addedNodes[0])
      }
    }
  })

  observer.observe(jobList, { childList: true, attributes: true })
}

const executeFilter = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log('Linkedin Filter extension running...')
  addJobListObserver()
}

executeFilter()

chrome.runtime.onMessage.addListener(
  (request: { message: string; url?: string }) => {
    // listen for messages sent from background.js
    if (
      request.message === 'urlChanged' &&
      request.url?.includes('https://www.linkedin.com/jobs/search')
    ) {
      executeFilter()
    }
  }
)
