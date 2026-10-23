import { foldForMatch } from '../deniedList/foldForMatch'
import { buildWholeWordSource } from '../textMatch/wholeWordPattern'
import { DetectedTech } from './techStack.type'

type EnglishLevelDefinition = {
  label: string
  aliases: readonly string[]
  rank: number
  cefr?: string
}

type TextMatch = {
  definition: EnglishLevelDefinition
  start: number
  end: number
}

type ContextMatch = {
  start: number
  end: number
}

type SourceRange = {
  start: number
  end: number
}

type NormalizedText = {
  value: string
  sourceRanges: SourceRange[]
}

export type EnglishProficiencyOccurrence = {
  label: string
  category: 'english'
  start: number
  end: number
}

const MAX_CONTEXT_DISTANCE = 80
const CONTEXT_BREAK_PATTERN = /[.!?\n;]/u
const GENERIC_DESCRIPTOR_FOLLOWING_WORD_PATTERN =
  /^\s+(?:communication|concepts|experience|familiarity|knowledge|skills|understanding)(?![\p{L}\p{N}_])/u

const languageAliases = [
  'english',
  'english language',
  'ingles',
  'inglês',
  'idioma ingles',
  'idioma inglês',
  'lingua inglesa',
  'língua inglesa',
]

const levelDefinitions: readonly EnglishLevelDefinition[] = [
  {
    label: 'A1',
    aliases: ['a1', 'a 1', 'cefr a1', 'cefr a 1'],
    rank: 1,
    cefr: 'A1',
  },
  {
    label: 'A2',
    aliases: ['a2', 'a 2', 'cefr a2', 'cefr a 2'],
    rank: 2,
    cefr: 'A2',
  },
  {
    label: 'B1',
    aliases: ['b1', 'b 1', 'cefr b1', 'cefr b 1'],
    rank: 3,
    cefr: 'B1',
  },
  {
    label: 'B2',
    aliases: ['b2', 'b 2', 'cefr b2', 'cefr b 2'],
    rank: 4,
    cefr: 'B2',
  },
  {
    label: 'C1',
    aliases: ['c1', 'c 1', 'cefr c1', 'cefr c 1'],
    rank: 5,
    cefr: 'C1',
  },
  {
    label: 'C2',
    aliases: ['c2', 'c 2', 'cefr c2', 'cefr c 2'],
    rank: 6,
    cefr: 'C2',
  },
  {
    label: 'Basic',
    aliases: [
      'basic',
      'beginner',
      'elementary',
      'basico',
      'básico',
      'iniciante',
      'elementar',
    ],
    rank: 1,
  },
  {
    label: 'Intermediate',
    aliases: [
      'intermediate',
      'intermedio',
      'intermédio',
      'intermediario',
      'intermediária',
      'intermediário',
      'conversational',
      'conversacao',
      'conversação',
    ],
    rank: 3,
  },
  {
    label: 'Upper-intermediate',
    aliases: [
      'upper intermediate',
      'upper-intermediate',
      'upperintermediate',
      'advanced intermediate',
      'intermediario avancado',
      'intermediário avançado',
      'intermedio avanzado',
    ],
    rank: 4,
  },
  {
    label: 'Advanced',
    aliases: ['advanced', 'avancado', 'avançado'],
    rank: 5,
  },
  {
    label: 'Proficient',
    aliases: [
      'proficient',
      'proficiente',
      'full professional proficiency',
      'professional working proficiency',
    ],
    rank: 6,
  },
  {
    label: 'Fluent',
    aliases: [
      'fluent',
      'fluency',
      'fluent speaker',
      'fluente',
      'fluencia',
      'fluência',
    ],
    rank: 7,
  },
  {
    label: 'Native',
    aliases: [
      'native',
      'native speaker',
      'nativo',
      'falante nativo',
    ],
    rank: 8,
  },
]

const languageDefinition: EnglishLevelDefinition = {
  label: 'English',
  aliases: languageAliases,
  rank: 0,
}

const createPattern = (aliases: readonly string[]) => {
  const sources = [...new Set(aliases.map((alias) => foldForMatch(alias)))]
    .sort((left, right) => right.length - left.length)
    .map((alias) => buildWholeWordSource(alias))

  return new RegExp(sources.join('|'), 'gu')
}

const languagePattern = createPattern(languageAliases)
const levelMatchers = levelDefinitions.map((definition) => ({
  definition,
  pattern: createPattern(definition.aliases),
}))

const normalizeWithSourceMap = (text: string): NormalizedText => {
  let value = ''
  const sourceRanges: SourceRange[] = []

  for (let sourceIndex = 0; sourceIndex < text.length; ) {
    const sourceChar = String.fromCodePoint(text.codePointAt(sourceIndex) ?? 0)
    const normalizedChar = foldForMatch(sourceChar)

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

const findMatches = (
  text: string,
  pattern: RegExp,
  definition: EnglishLevelDefinition
): TextMatch[] => {
  const matches: TextMatch[] = []
  pattern.lastIndex = 0

  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match[0].length === 0) {
      pattern.lastIndex += 1
      continue
    }

    matches.push({
      definition,
      start: match.index,
      end: match.index + match[0].length,
    })
  }

  pattern.lastIndex = 0
  return matches
}

const findLanguageMatches = (text: string) => {
  return findMatches(text, languagePattern, languageDefinition).map(
    ({ start, end }) => ({ start, end })
  )
}

const distanceBetween = (left: ContextMatch, right: ContextMatch) => {
  if (left.end < right.start) {
    return right.start - left.end
  }

  if (right.end < left.start) {
    return left.start - right.end
  }

  return 0
}

const sharesContext = (
  left: ContextMatch,
  right: ContextMatch,
  text: string
) => {
  const distance = distanceBetween(left, right)

  if (distance > MAX_CONTEXT_DISTANCE) {
    return false
  }

  const betweenStart = Math.min(left.end, right.end)
  const betweenEnd = Math.max(left.start, right.start)

  return !CONTEXT_BREAK_PATTERN.test(text.slice(betweenStart, betweenEnd))
}

const findClosestLanguageMatch = (
  levelMatch: ContextMatch,
  languageMatches: ContextMatch[],
  text: string
) => {
  return languageMatches
    .filter((languageMatch) => sharesContext(levelMatch, languageMatch, text))
    .sort(
      (left, right) =>
        distanceBetween(levelMatch, left) - distanceBetween(levelMatch, right)
    )[0]
}

const resolveOverlappingMatches = (matches: TextMatch[]) => {
  const sortedMatches = [...matches].sort((left, right) => {
    const lengthDifference =
      right.end - right.start - (left.end - left.start)

    return lengthDifference || right.definition.rank - left.definition.rank
  })
  const selectedMatches: TextMatch[] = []

  for (const match of sortedMatches) {
    const overlaps = selectedMatches.some(
      (selectedMatch) =>
        match.start < selectedMatch.end && selectedMatch.start < match.end
    )

    if (!overlaps) {
      selectedMatches.push(match)
    }
  }

  return selectedMatches
}

const isGenericDescriptorUse = (match: TextMatch, text: string) => {
  if (match.definition.cefr) {
    return false
  }

  const followingText = text.slice(match.end)

  return GENERIC_DESCRIPTOR_FOLLOWING_WORD_PATTERN.test(followingText)
}

const findContextualLevelMatches = (text: string) => {
  const languageMatches = findLanguageMatches(text)
  const matches = levelMatchers.flatMap(({ definition, pattern }) =>
    findMatches(text, pattern, definition)
  )

  return resolveOverlappingMatches(matches)
    .filter((match) => !isGenericDescriptorUse(match, text))
    .filter((match) =>
      languageMatches.some((languageMatch) =>
        sharesContext(match, languageMatch, text)
      )
    )
}

const findClosestDescriptor = (
  cefrMatch: TextMatch,
  descriptorMatches: TextMatch[],
  text: string
) => {
  return descriptorMatches
    .filter((descriptorMatch) => sharesContext(cefrMatch, descriptorMatch, text))
    .sort((left, right) => {
      const distanceDifference =
        distanceBetween(cefrMatch, left) - distanceBetween(cefrMatch, right)

      return distanceDifference || right.definition.rank - left.definition.rank
    })[0]
}

const resolveEnglishProficiency = (
  contextualMatches: TextMatch[],
  text: string
): DetectedTech | null => {
  if (contextualMatches.length === 0) {
    return null
  }

  const cefrMatches = contextualMatches.filter((match) => match.definition.cefr)
  const descriptorMatches = contextualMatches.filter(
    (match) => !match.definition.cefr
  )
  const selectedCefrMatch = [...cefrMatches].sort(
    (left, right) => right.definition.rank - left.definition.rank
  )[0]

  if (selectedCefrMatch) {
    const descriptorMatch = findClosestDescriptor(
      selectedCefrMatch,
      descriptorMatches,
      text
    )
    const descriptorLabel = descriptorMatch?.definition.label

    return {
      label: descriptorLabel
        ? `${selectedCefrMatch.definition.label} / ${descriptorLabel}`
        : selectedCefrMatch.definition.label,
      count: 1,
    }
  }

  const selectedDescriptor = [...descriptorMatches].sort(
    (left, right) => right.definition.rank - left.definition.rank
  )[0]

  return {
    label: selectedDescriptor.definition.label,
    count: 1,
  }
}

export const detectEnglishProficiency = (
  text: string
): DetectedTech | null => {
  const normalizedText = foldForMatch(text)
  const contextualMatches = findContextualLevelMatches(normalizedText)

  return resolveEnglishProficiency(contextualMatches, normalizedText)
}

const toSourceRange = (
  normalizedText: NormalizedText,
  start: number,
  end: number
) => {
  const firstSourceRange = normalizedText.sourceRanges[start]
  const lastSourceRange = normalizedText.sourceRanges[end - 1]

  if (!firstSourceRange || !lastSourceRange) {
    return null
  }

  return {
    start: firstSourceRange.start,
    end: lastSourceRange.end,
  }
}

export const findEnglishProficiencyOccurrences = (
  text: string
): EnglishProficiencyOccurrence[] => {
  const normalizedText = normalizeWithSourceMap(text)
  const contextualMatches = findContextualLevelMatches(normalizedText.value)
  const proficiency = resolveEnglishProficiency(
    contextualMatches,
    normalizedText.value
  )

  if (!proficiency) {
    return []
  }

  const languageMatches = findLanguageMatches(normalizedText.value)

  return contextualMatches.flatMap((levelMatch) => {
    const languageMatch = findClosestLanguageMatch(
      levelMatch,
      languageMatches,
      normalizedText.value
    )

    if (!languageMatch) {
      return []
    }

    const sourceRange = toSourceRange(
      normalizedText,
      Math.min(levelMatch.start, languageMatch.start),
      Math.max(levelMatch.end, languageMatch.end)
    )

    return sourceRange
      ? [
          {
            label: proficiency.label,
            category: 'english' as const,
            ...sourceRange,
          },
        ]
      : []
  })
}
