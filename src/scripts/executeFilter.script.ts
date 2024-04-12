import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'
import { insertHideButtons } from './createHideButton.script'

const defaultPropsObservers: MutationObserverInit = {
  childList: true,
  attributes: true,
}

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

const removeJob = (element: Element) => {
  if (element instanceof HTMLLIElement) {
    element.remove()
    console.log('Removed job: ', element.innerText.replaceAll('\n', ''))
  }
}

const isJobBlacklisted = (element: HTMLElement) => {
  return blackListPattern().test(element.innerText.toLowerCase())
}

const addJobItemObserver = (jobItem: HTMLLIElement) => {
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

  observer.observe(jobItem, defaultPropsObservers)

  if (isJobBlacklisted(jobItem)) {
    removeJob(jobItem)
  }
}

const addJobListObserver = async () => {
  const jobListSelector =
    '#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul'
  let jobList = document.querySelector(jobListSelector)

  while (!jobList) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    jobList = document.querySelector(jobListSelector)
  }

  // for loaded jobs
  for (const children of jobList.childNodes) {
    if (children instanceof HTMLLIElement) {
      addJobItemObserver(children)
      insertHideButtons()
    }
  }

  // for unloaded jobs
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.addedNodes.length &&
        mutation.addedNodes[0] instanceof HTMLLIElement
      ) {
        addJobItemObserver(mutation.addedNodes[0])
        insertHideButtons()
      }
    }
  })

  observer.observe(jobList, defaultPropsObservers)
}

export const executeFilter = async () => {
  await addJobListObserver()
}
