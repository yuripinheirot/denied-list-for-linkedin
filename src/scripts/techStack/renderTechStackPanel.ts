import { resolveBrowserLocale } from '../../i18n/resolveLocale'
import {
  TechStackMessages,
  techStackMessagesByLocale,
} from '../../i18n/techStackMessages'
import { hasDetectedTechs } from '../../techStack/detectTechStack'
import {
  DetectedTech,
  DetectedTechStack,
  TECH_CATEGORIES,
  TechCategory,
} from '../../techStack/techStack.type'
import { ensureTechStackStyles } from './techStackStyles'

const createElement = (tagName: string, className: string, text?: string) => {
  const element = document.createElement(tagName)
  element.className = className

  if (text !== undefined) {
    element.textContent = text
  }

  return element
}

const formatBadgeLabel = (
  tech: DetectedTech,
  category: TechCategory,
  messages: TechStackMessages
) => {
  if (category !== 'english') {
    return tech.label
  }

  return tech.label
    .split(' / ')
    .map((part) => messages.englishLevels[part] ?? part)
    .join(' / ')
}

const createBadge = (
  tech: DetectedTech,
  category: TechCategory,
  messages: TechStackMessages
) => {
  const badge = createElement(
    'span',
    `dlfl-tech-badge dlfl-tech-badge--${category}`,
    formatBadgeLabel(tech, category, messages)
  )

  if (tech.count > 1) {
    badge.appendChild(createElement('span', 'dlfl-tech-count', `×${tech.count}`))
  }

  return badge
}

const createCategoryRow = (
  category: TechCategory,
  techs: DetectedTech[],
  messages: TechStackMessages
) => {
  const row = createElement('div', 'dlfl-tech-row')
  const badges = createElement('div', 'dlfl-tech-badges')

  for (const tech of techs) {
    badges.appendChild(createBadge(tech, category, messages))
  }

  row.append(
    createElement('span', 'dlfl-tech-category', messages.categories[category]),
    badges
  )

  return row
}

export const createTechStackPanel = (stack: DetectedTechStack) => {
  ensureTechStackStyles()

  const messages = techStackMessagesByLocale[resolveBrowserLocale()]
  const panel = createElement('section', 'dlfl-tech-panel')
  panel.appendChild(createElement('h3', 'dlfl-tech-title', messages.title))

  if (!hasDetectedTechs(stack)) {
    panel.appendChild(createElement('p', 'dlfl-tech-empty', messages.empty))
    return panel
  }

  for (const category of TECH_CATEGORIES) {
    if (stack[category].length > 0) {
      panel.appendChild(createCategoryRow(category, stack[category], messages))
    }
  }

  return panel
}
