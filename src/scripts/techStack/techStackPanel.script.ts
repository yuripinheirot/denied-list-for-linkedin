import { detectTechStack } from '../../techStack/detectTechStack'
import {
  JOB_DETAILS_PANE_SELECTOR,
  JobDescription,
  readFullJobDescription,
  readJobIdFromPane,
} from './jobDescription'
import { createTechStackPanel } from './renderTechStackPanel'

const PANEL_SELECTOR = '.dlfl-tech-panel'
const JOB_ID_ATTRIBUTE = 'data-dlfl-job-id'

const observerOptions: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
}

const renderedTexts = new WeakMap<Element, string>()

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

const isPanelUpToDate = (panel: HTMLElement, description: JobDescription) => {
  return (
    panel.parentElement === description.aboutTheJobBlock.parentElement &&
    panel.getAttribute(JOB_ID_ATTRIBUTE) === description.jobId &&
    renderedTexts.get(panel) === description.text
  )
}

const removeStalePanel = (pane: Element) => {
  const panel = findPanel(pane)

  if (panel && panel.getAttribute(JOB_ID_ATTRIBUTE) !== readJobIdFromPane(pane)) {
    panel.remove()
  }
}

const renderPanel = (description: JobDescription) => {
  const container = description.aboutTheJobBlock.parentElement

  if (!container) {
    return
  }

  const panel = createTechStackPanel(detectTechStack(description.text))
  panel.setAttribute(JOB_ID_ATTRIBUTE, description.jobId)
  renderedTexts.set(panel, description.text)
  container.prepend(panel)
}

const updatePanel = (pane: Element) => {
  removeStalePanel(pane)

  const description = readFullJobDescription(pane)

  if (!description) {
    return
  }

  const currentPanel = findPanel(pane)

  if (currentPanel && isPanelUpToDate(currentPanel, description)) {
    return
  }

  currentPanel?.remove()
  renderPanel(description)
}

const observePane = (pane: Element) => {
  paneObserver?.disconnect()
  observedPane = pane
  paneObserver = new MutationObserver(
    throttleToAnimationFrame(() => updatePanel(pane))
  )
  paneObserver.observe(pane, observerOptions)
  updatePanel(pane)
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
