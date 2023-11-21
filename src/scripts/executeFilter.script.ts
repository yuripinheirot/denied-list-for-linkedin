const jobListSelector = '#main > div > div.scaffold-layout__list > div > ul'
const jobListItemSelector = `${jobListSelector} > li`
const blackList = ['GeekHunter', 'Turing', 'Crossover', 'Netvagas']
const blackListPattern = new RegExp(blackList.join('|'), 'i')

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

const isJobBlacklisted = (element: HTMLElement) =>
  blackListPattern.test(element.innerText)

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
