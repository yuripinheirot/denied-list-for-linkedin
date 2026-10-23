import { foldForMatch, stripAccents } from '../deniedList/foldForMatch'
import { buildTechMatchers, TechMatcher } from './buildTechMatchers'
import {
  detectEnglishProficiency,
  findEnglishProficiencyOccurrences,
} from './detectEnglishProficiency'
import { techCatalog } from './techCatalog'
import {
  DetectedTech,
  DetectedTechStack,
  TECH_CATEGORIES,
  TechCategory,
} from './techStack.type'

const techMatchers = buildTechMatchers(techCatalog)

type MatchTexts = {
  folded: NormalizedText
  accentless: NormalizedText
}

type SourceRange = {
  start: number
  end: number
}

type NormalizedText = {
  value: string
  sourceRanges: SourceRange[]
}

export type TechOccurrence = {
  label: string
  category: TechCategory
  start: number
  end: number
}

const normalizeWithSourceMap = (text: string, fold: boolean) => {
  let value = ''
  const sourceRanges: SourceRange[] = []

  for (let sourceIndex = 0; sourceIndex < text.length; ) {
    const sourceChar = String.fromCodePoint(text.codePointAt(sourceIndex) ?? 0)
    const normalizedChar = fold
      ? foldForMatch(sourceChar)
      : stripAccents(sourceChar)

    value += normalizedChar

    for (let offset = 0; offset < normalizedChar.length; offset += 1) {
      sourceRanges.push({
        start: sourceIndex,
        end: sourceIndex + sourceChar.length,
      })
    }

    sourceIndex += sourceChar.length
  }

  return { value, sourceRanges }
}

const createMatchTexts = (text: string): MatchTexts => ({
  folded: normalizeWithSourceMap(text, true),
  accentless: normalizeWithSourceMap(text, false),
})

const countMatches = (pattern: RegExp | null, text: string) => {
  if (!pattern) {
    return 0
  }

  return text.match(pattern)?.length ?? 0
}

const countTechMentions = (matcher: TechMatcher, texts: MatchTexts) => {
  return (
    countMatches(matcher.foldedPattern, texts.folded.value) +
    countMatches(matcher.caseSensitivePattern, texts.accentless.value)
  )
}

const findPatternRanges = (
  pattern: RegExp | null,
  normalizedText: NormalizedText
): SourceRange[] => {
  if (!pattern) {
    return []
  }

  const ranges: SourceRange[] = []
  pattern.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(normalizedText.value)) !== null) {
    if (match[0].length === 0) {
      pattern.lastIndex += 1
      continue
    }

    const firstSourceRange = normalizedText.sourceRanges[match.index]
    const lastSourceRange =
      normalizedText.sourceRanges[match.index + match[0].length - 1]

    if (firstSourceRange && lastSourceRange) {
      ranges.push({
        start: firstSourceRange.start,
        end: lastSourceRange.end,
      })
    }
  }

  pattern.lastIndex = 0
  return ranges
}

const findMatcherOccurrences = (
  matcher: TechMatcher,
  texts: MatchTexts
): TechOccurrence[] => {
  const ranges = [
    ...findPatternRanges(matcher.foldedPattern, texts.folded),
    ...findPatternRanges(matcher.caseSensitivePattern, texts.accentless),
  ]
  const uniqueRanges = new Map<string, SourceRange>()

  for (const range of ranges) {
    uniqueRanges.set(`${range.start}:${range.end}`, range)
  }

  return [...uniqueRanges.values()].map((range) => ({
    label: matcher.definition.label,
    category: matcher.definition.category,
    ...range,
  }))
}

const overlaps = (left: TechOccurrence, right: TechOccurrence) => {
  return left.start < right.end && right.start < left.end
}

const resolveOverlappingOccurrences = (occurrences: TechOccurrence[]) => {
  const longestFirst = [...occurrences].sort((left, right) => {
    const lengthDifference =
      right.end - right.start - (left.end - left.start)
    const labelLengthDifference = right.label.length - left.label.length

    return (
      lengthDifference ||
      labelLengthDifference ||
      left.start - right.start ||
      left.label.localeCompare(right.label)
    )
  })
  const selected: TechOccurrence[] = []

  for (const occurrence of longestFirst) {
    if (
      !selected.some((selectedOccurrence) =>
        overlaps(occurrence, selectedOccurrence)
      )
    ) {
      selected.push(occurrence)
    }
  }

  return selected.sort(
    (left, right) => left.start - right.start || left.end - right.end
  )
}

export const findTechOccurrences = (text: string): TechOccurrence[] => {
  const texts = createMatchTexts(text)
  const technologyOccurrences = techMatchers.flatMap((matcher) =>
    findMatcherOccurrences(matcher, texts)
  )
  const englishOccurrences = findEnglishProficiencyOccurrences(text)

  return resolveOverlappingOccurrences([
    ...technologyOccurrences,
    ...englishOccurrences,
  ])
}

const createEmptyStack = (): DetectedTechStack => {
  return {
    frontend: [],
    backend: [],
    ai: [],
    additional: [],
    english: [],
  }
}

const sortByMentions = (techs: DetectedTech[]) => {
  return [...techs].sort((left, right) => right.count - left.count)
}

export const detectTechStack = (text: string): DetectedTechStack => {
  const texts = createMatchTexts(text)
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

  const englishProficiency = detectEnglishProficiency(text)

  if (englishProficiency) {
    stack.english.push(englishProficiency)
  }

  for (const category of TECH_CATEGORIES) {
    stack[category] = sortByMentions(stack[category])
  }

  return stack
}

export const hasDetectedTechs = (stack: DetectedTechStack) => {
  return TECH_CATEGORIES.some((category) => stack[category].length > 0)
}
