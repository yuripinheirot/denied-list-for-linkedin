import { findTechOccurrences, TechOccurrence } from '../../techStack/detectTechStack'
import {
  DESCRIPTION_TEXT_SELECTOR,
  findDescriptionTextBox,
  readDescriptionText,
} from './jobDescription'

export const TECH_HIGHLIGHT_CLASS = 'dlfl-tech-highlight'

const TECH_HIGHLIGHT_SIGNATURE_ATTRIBUTE =
  'data-dlfl-tech-highlight-signature'
const TECH_HIGHLIGHT_FRAGMENT_COUNT_ATTRIBUTE =
  'data-dlfl-tech-highlight-fragment-count'
const EXPAND_BUTTON_SELECTOR = '[data-testid="expandable-text-button"]'

type TextNodeInfo = {
  node: Text
  start: number
  end: number
}

type LocalRange = {
  start: number
  end: number
  occurrence: TechOccurrence
}

const isInsideExpandButton = (node: Text) => {
  return Boolean(node.parentElement?.closest(EXPAND_BUTTON_SELECTOR))
}

const readDescriptionTextNodes = (textBox: HTMLElement) => {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(textBox, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode() as Text | null

  while (current) {
    if (!isInsideExpandButton(current)) {
      textNodes.push(current)
    }

    current = walker.nextNode() as Text | null
  }

  return textNodes
}

const getTextNodeInfo = (textBox: HTMLElement) => {
  let offset = 0

  return readDescriptionTextNodes(textBox).map((node) => {
    const info = {
      node,
      start: offset,
      end: offset + node.data.length,
    }
    offset = info.end
    return info
  })
}

const unwrapExistingHighlights = (textBox: HTMLElement) => {
  const highlights = Array.from(
    textBox.querySelectorAll<HTMLElement>(`.${TECH_HIGHLIGHT_CLASS}`)
  )

  for (const highlight of highlights) {
    const parent = highlight.parentNode

    if (!parent) {
      continue
    }

    while (highlight.firstChild) {
      parent.insertBefore(highlight.firstChild, highlight)
    }

    highlight.remove()
  }
}

const clearHighlightState = (textBox: HTMLElement) => {
  textBox.removeAttribute(TECH_HIGHLIGHT_SIGNATURE_ATTRIBUTE)
  textBox.removeAttribute(TECH_HIGHLIGHT_FRAGMENT_COUNT_ATTRIBUTE)
}

export const clearTechHighlights = (aboutTheJobBlock: HTMLElement) => {
  const textBox = findDescriptionTextBox(aboutTheJobBlock)

  if (!textBox) {
    return
  }

  unwrapExistingHighlights(textBox)
  clearHighlightState(textBox)
}

const addLocalRange = (
  rangesByNode: Map<Text, LocalRange[]>,
  nodeInfo: TextNodeInfo,
  occurrence: TechOccurrence
) => {
  const start = Math.max(occurrence.start, nodeInfo.start)
  const end = Math.min(occurrence.end, nodeInfo.end)

  if (start >= end) {
    return
  }

  const ranges = rangesByNode.get(nodeInfo.node) ?? []
  ranges.push({
    start: start - nodeInfo.start,
    end: end - nodeInfo.start,
    occurrence,
  })
  rangesByNode.set(nodeInfo.node, ranges)
}

const wrapLocalRange = (textNode: Text, range: LocalRange) => {
  const localStartNode =
    range.start === 0 ? textNode : textNode.splitText(range.start)
  const matchLength = range.end - range.start
  const matchNode = localStartNode

  if (matchLength < localStartNode.data.length) {
    localStartNode.splitText(matchLength)
  }
  const parent = matchNode.parentNode

  if (!parent) {
    return false
  }

  const highlight = document.createElement('span')
  highlight.className = TECH_HIGHLIGHT_CLASS
  highlight.setAttribute('data-dlfl-tech-label', range.occurrence.label)
  parent.insertBefore(highlight, matchNode)
  highlight.appendChild(matchNode)
  return true
}

const applyHighlights = (
  textBox: HTMLElement,
  occurrences: TechOccurrence[]
) => {
  const nodeInfos = getTextNodeInfo(textBox)
  const rangesByNode = new Map<Text, LocalRange[]>()

  for (const occurrence of occurrences) {
    for (const nodeInfo of nodeInfos) {
      addLocalRange(rangesByNode, nodeInfo, occurrence)
    }
  }

  let fragmentCount = 0

  for (const nodeInfo of nodeInfos) {
    const ranges = rangesByNode.get(nodeInfo.node) ?? []
    ranges.sort((left, right) => right.start - left.start)

    for (const range of ranges) {
      if (wrapLocalRange(nodeInfo.node, range)) {
        fragmentCount += 1
      }
    }
  }

  return fragmentCount
}

export const highlightTechOccurrences = (aboutTheJobBlock: HTMLElement) => {
  const textBox = aboutTheJobBlock.querySelector<HTMLElement>(
    DESCRIPTION_TEXT_SELECTOR
  )

  if (!textBox) {
    return
  }

  const text = readDescriptionText(textBox)
  const occurrences = findTechOccurrences(text)
  const currentSignature = textBox.getAttribute(
    TECH_HIGHLIGHT_SIGNATURE_ATTRIBUTE
  )
  const currentFragmentCount = textBox.querySelectorAll(
    `.${TECH_HIGHLIGHT_CLASS}`
  ).length
  const appliedFragmentCount = Number(
    textBox.getAttribute(TECH_HIGHLIGHT_FRAGMENT_COUNT_ATTRIBUTE)
  )

  if (
    currentSignature === text &&
    currentFragmentCount === appliedFragmentCount
  ) {
    return
  }

  unwrapExistingHighlights(textBox)
  clearHighlightState(textBox)
  const fragmentCount = applyHighlights(textBox, occurrences)
  textBox.setAttribute(TECH_HIGHLIGHT_SIGNATURE_ATTRIBUTE, text)
  textBox.setAttribute(
    TECH_HIGHLIGHT_FRAGMENT_COUNT_ATTRIBUTE,
    String(fragmentCount)
  )
}
