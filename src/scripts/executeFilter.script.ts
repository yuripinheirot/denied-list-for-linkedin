import { BlackListType } from '../types/BlackList.type'
import { KeysStorage } from '../types/KeysStorage.type'
import { insertHideButtons } from './createHideButton.script'

const jobListSelector = '#main > div > div.scaffold-layout__list'

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
    attributes: true,
  })

  if (isJobBlacklisted(jobItem)) {
    removeJob(jobItem)
  }
}

const addJobListObserver = () => {
  const jobListContainer = document.querySelector(jobListSelector)
  if (!jobListContainer) return

  const observerJobContainer = new MutationObserver((mutationsJobContainer) => {
    for (const mutationJobContainer of mutationsJobContainer) {
      const elementAddedInContainer = mutationJobContainer.addedNodes[0]

      if (
        elementAddedInContainer instanceof HTMLDivElement &&
        elementAddedInContainer
          .getAttribute('class')
          ?.includes('jobs-search-results-list')
      ) {
        const jobList = elementAddedInContainer.querySelector('ul')

        if (jobList) {
          const observerJobList = new MutationObserver((mutationsJobList) => {
            for (const mutationJobList of mutationsJobList) {
              const elementAddedInJobList = mutationJobList.addedNodes[0]
              if (elementAddedInJobList instanceof HTMLLIElement) {
                addJobItemListener(elementAddedInJobList)
                insertHideButtons()
              }
            }
          })

          observerJobList.observe(jobList, {
            childList: true,
            attributes: true,
          })
        }
      }
    }
  })

  observerJobContainer.observe(jobListContainer, {
    childList: true,
    attributes: true,
  })
}

export const executeFilter = () => {
  addJobListObserver()
}
