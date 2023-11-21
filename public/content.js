const jobListSelector = '#main > div > div.scaffold-layout__list > div > ul'
const jobListItemSelector = `${jobListSelector} > li`
const blackList = ['GeekHunter', 'Turing', 'Crossover', 'Netvagas']
const blackListPattern = new RegExp(blackList.join('|'), 'i')

const removeJob = (element) => {
  if (element instanceof HTMLLIElement) {
    element.remove()
    console.log('Removed job: ', element.innerText.replaceAll('\n', ''))
  }
}

const removeJobsFromJobList = () => {
  document.querySelectorAll(jobListItemSelector).forEach((jobItem) => {
    if (isJobBlacklisted(jobItem)) {
      removeJob(jobItem)
    }
  })
}

const isJobBlacklisted = (element) => blackListPattern.test(element.innerText)

const addJobItemListener = (jobItem) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.addedNodes.length > 0 &&
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
    addJobItemListener(children)
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
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
