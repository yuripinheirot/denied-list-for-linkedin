import { foldForMatch } from '../deniedList/foldForMatch'
import {
  buildFlexibleSpacingSource,
  buildWholeWordSource,
  NOT_FOLLOWED_BY_WORD_CHARACTER,
} from '../textMatch/wholeWordPattern'
import { TechDefinition } from './techStack.type'

export type TechMatcher = {
  definition: TechDefinition
  foldedPattern: RegExp | null
  caseSensitivePattern: RegExp | null
}

const sortLongestFirst = (aliases: string[]) => {
  return [...aliases].sort((left, right) => right.length - left.length)
}

const buildExcludedNextWordsSource = (words: string[] | undefined) => {
  if (!words?.length) {
    return ''
  }

  const alternatives = words.map(buildFlexibleSpacingSource).join('|')

  return `(?![\\s-]+(?:${alternatives})${NOT_FOLLOWED_BY_WORD_CHARACTER})`
}

const buildAliasesPattern = (
  aliases: string[],
  excludedNextWordsSource: string,
  flags: string
) => {
  if (aliases.length === 0) {
    return null
  }

  const alternatives = sortLongestFirst(aliases).map(
    (alias) => `${buildWholeWordSource(alias)}${excludedNextWordsSource}`
  )

  return new RegExp(alternatives.join('|'), flags)
}

const buildTechMatcher = (definition: TechDefinition): TechMatcher => {
  const excludedNextWordsSource = buildExcludedNextWordsSource(
    definition.excludedNextWords
  )

  return {
    definition,
    foldedPattern: buildAliasesPattern(
      definition.aliases.map(foldForMatch),
      '',
      'gu'
    ),
    caseSensitivePattern: buildAliasesPattern(
      definition.caseSensitiveAliases ?? [],
      excludedNextWordsSource,
      'gu'
    ),
  }
}

export const buildTechMatchers = (catalog: readonly TechDefinition[]) => {
  return catalog.map(buildTechMatcher)
}
