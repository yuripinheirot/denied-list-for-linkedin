import { normalizeDeniedList } from './parseDeniedList'

const WORD_CHARACTER = String.raw`\p{L}\p{N}_`

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const buildDeniedListPattern = (terms: string[]) => {
  const normalizedTerms = normalizeDeniedList(terms)

  if (normalizedTerms.length === 0) {
    return null
  }

  const alternatives = normalizedTerms.map((term) => {
    const words = term.split(/\s+/).map(escapeRegExp)

    return `(?<![${WORD_CHARACTER}])${words.join(String.raw`\s+`)}(?![${WORD_CHARACTER}])`
  })

  return new RegExp(alternatives.join('|'), 'iu')
}
