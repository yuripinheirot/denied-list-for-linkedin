export const JOB_DETAILS_PANE_SELECTOR = '[data-sdui-screen$="SemanticJobDetails"]'

const ABOUT_THE_JOB_PREFIX = 'JobDetails_AboutTheJob_'
const ABOUT_THE_JOB_SELECTOR = `[componentkey^="${ABOUT_THE_JOB_PREFIX}"]`
const DESCRIPTION_TEXT_SELECTOR = '[data-testid="expandable-text-box"]'
const EXPAND_BUTTON_SELECTOR = '[data-testid="expandable-text-button"]'

export type JobDescription = {
  jobId: string
  text: string
  aboutTheJobBlock: HTMLElement
}

const readJobId = (aboutTheJobBlock: HTMLElement) => {
  const componentKey = aboutTheJobBlock.getAttribute('componentkey') ?? ''
  const jobId = componentKey.slice(ABOUT_THE_JOB_PREFIX.length).trim()

  return jobId || null
}

const readTextNodes = (element: HTMLElement) => {
  const parts: string[] = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()

  while (current) {
    const value = (current.textContent ?? '').trim()

    if (value) {
      parts.push(value)
    }

    current = walker.nextNode()
  }

  return parts.join('\n')
}

const isTruncated = (aboutTheJobBlock: HTMLElement) => {
  const expandButton = aboutTheJobBlock.querySelector(EXPAND_BUTTON_SELECTOR)

  return expandButton !== null && expandButton.getClientRects().length > 0
}

export const findAboutTheJobBlock = (pane: ParentNode) => {
  return pane.querySelector<HTMLElement>(ABOUT_THE_JOB_SELECTOR)
}

export const readJobIdFromPane = (pane: ParentNode) => {
  const aboutTheJobBlock = findAboutTheJobBlock(pane)

  return aboutTheJobBlock ? readJobId(aboutTheJobBlock) : null
}

export const readFullJobDescription = (
  pane: ParentNode
): JobDescription | null => {
  const aboutTheJobBlock = findAboutTheJobBlock(pane)

  if (
    !aboutTheJobBlock ||
    !aboutTheJobBlock.querySelector(DESCRIPTION_TEXT_SELECTOR) ||
    isTruncated(aboutTheJobBlock)
  ) {
    return null
  }

  const text = readTextNodes(aboutTheJobBlock)

  if (!text) {
    return null
  }

  const jobId = readJobId(aboutTheJobBlock)

  if (!jobId) {
    return null
  }

  return { jobId, text, aboutTheJobBlock }
}
