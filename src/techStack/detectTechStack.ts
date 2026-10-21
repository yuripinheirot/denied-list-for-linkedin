import { foldForMatch, stripAccents } from '../deniedList/foldForMatch'
import { buildTechMatchers, TechMatcher } from './buildTechMatchers'
import { techCatalog } from './techCatalog'
import {
  DetectedTech,
  DetectedTechStack,
  TECH_CATEGORIES,
} from './techStack.type'

const techMatchers = buildTechMatchers(techCatalog)

type MatchTexts = {
  folded: string
  accentless: string
}

const countMatches = (pattern: RegExp | null, text: string) => {
  if (!pattern) {
    return 0
  }

  return text.match(pattern)?.length ?? 0
}

const countTechMentions = (matcher: TechMatcher, texts: MatchTexts) => {
  return (
    countMatches(matcher.foldedPattern, texts.folded) +
    countMatches(matcher.caseSensitivePattern, texts.accentless)
  )
}

const createEmptyStack = (): DetectedTechStack => {
  return {
    frontend: [],
    backend: [],
    additional: [],
  }
}

const sortByMentions = (techs: DetectedTech[]) => {
  return [...techs].sort((left, right) => right.count - left.count)
}

export const detectTechStack = (text: string): DetectedTechStack => {
  const accentless = stripAccents(text)
  const texts: MatchTexts = { folded: foldForMatch(accentless), accentless }
  const stack = createEmptyStack()

  for (const matcher of techMatchers) {
    const count = countTechMentions(matcher, texts)

    if (count > 0) {
      stack[matcher.definition.category].push({
        label: matcher.definition.label,
        count,
      })
    }
  }

  for (const category of TECH_CATEGORIES) {
    stack[category] = sortByMentions(stack[category])
  }

  return stack
}

export const hasDetectedTechs = (stack: DetectedTechStack) => {
  return TECH_CATEGORIES.some((category) => stack[category].length > 0)
}
