import { detectTechStack } from '../../techStack/detectTechStack'
import { DetectedTechStack } from '../../techStack/techStack.type'
import {
  readCachedTechStack,
  writeCachedTechStack,
} from '../storage/techStackCache.repository'
import {
  JOB_DETAILS_PANE_SELECTOR,
  findAboutTheJobBlock,
  readFullJobDescription,
  readJobIdFromPane,
} from './jobDescription'
import {
  clearTechHighlights,
  highlightTechOccurrences,
} from './jobDescriptionHighlighter'
import { createTechStackPanel } from './renderTechStackPanel'

const PANEL_SELECTOR = '.dlfl-tech-panel'
const JOB_ID_ATTRIBUTE = 'data-dlfl-job-id'
const RENDER_SIGNATURE_ATTRIBUTE = 'data-dlfl-render-signature'

const observerOptions: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
}

let observedPane: Element | null = null
let paneObserver: MutationObserver | null = null

const throttleToAnimationFrame = (callback: () => void) => {
  let isScheduled = false

  return () => {
    if (isScheduled) {
      return
    }

    isScheduled = true
    requestAnimationFrame(() => {
      isScheduled = false
      callback()
    })
  }
}

const findPanel = (pane: Element) => {
  return pane.querySelector<HTMLElement>(PANEL_SELECTOR)
}

const isPanelUpToDate = (
  panel: HTMLElement,
  aboutTheJobBlock: HTMLElement,
  jobId: string,
  renderSignature: string
) => {
  return (
    panel.parentElement === aboutTheJobBlock.parentElement &&
    panel.getAttribute(JOB_ID_ATTRIBUTE) === jobId &&
    panel.getAttribute(RENDER_SIGNATURE_ATTRIBUTE) === renderSignature
  )
}

const removeStalePanel = (pane: Element) => {
  const panel = findPanel(pane)

  if (panel && panel.getAttribute(JOB_ID_ATTRIBUTE) !== readJobIdFromPane(pane)) {
    panel.remove()
  }
}

const renderPanel = (
  aboutTheJobBlock: HTMLElement,
  jobId: string,
  stack: DetectedTechStack,
  renderSignature: string
) => {
  if (!aboutTheJobBlock.parentElement) {
    return
  }

  const panel = createTechStackPanel(stack)
  panel.setAttribute(JOB_ID_ATTRIBUTE, jobId)
  panel.setAttribute(RENDER_SIGNATURE_ATTRIBUTE, renderSignature)
  aboutTheJobBlock.before(panel)
}

export const updateTechStackPanel = (pane: Element) => {
  removeStalePanel(pane)

  const aboutTheJobBlock = findAboutTheJobBlock(pane)
  const jobId = readJobIdFromPane(pane)

  if (!aboutTheJobBlock || !jobId) {
    return
  }

  const cachedStack = readCachedTechStack(jobId)
  const description = readFullJobDescription(pane)
  let stack: DetectedTechStack
  let renderSignature: string

  if (description) {
    stack = detectTechStack(description.text)
    writeCachedTechStack(jobId, stack)
    highlightTechOccurrences(description.aboutTheJobBlock)
    renderSignature = description.text
  } else if (cachedStack) {
    clearTechHighlights(aboutTheJobBlock)
    stack = cachedStack
    renderSignature = `cache:${jobId}`
  } else {
    clearTechHighlights(aboutTheJobBlock)
    return
  }

  const currentPanel = findPanel(pane)

  if (
    currentPanel &&
    isPanelUpToDate(
      currentPanel,
      aboutTheJobBlock,
      jobId,
      renderSignature
    )
  ) {
    return
  }

  currentPanel?.remove()
  renderPanel(aboutTheJobBlock, jobId, stack, renderSignature)
}

const observePane = (pane: Element) => {
  paneObserver?.disconnect()
  observedPane = pane
  paneObserver = new MutationObserver(
    throttleToAnimationFrame(() => updateTechStackPanel(pane))
  )
  paneObserver.observe(pane, observerOptions)
  updateTechStackPanel(pane)
}

const attachToCurrentPane = () => {
  const pane = document.querySelector(JOB_DETAILS_PANE_SELECTOR)

  if (!pane || pane === observedPane) {
    return
  }

  observePane(pane)
}

export const startTechStackPanel = () => {
  const pageObserver = new MutationObserver(
    throttleToAnimationFrame(attachToCurrentPane)
  )

  pageObserver.observe(document.body, { childList: true, subtree: true })
  attachToCurrentPane()
}
