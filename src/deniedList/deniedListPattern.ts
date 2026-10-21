import { buildWholeWordSource } from '../textMatch/wholeWordPattern'
import { foldForMatch } from './foldForMatch'
import { normalizeDeniedList } from './parseDeniedList'

export const buildDeniedListPattern = (terms: string[]) => {
  const normalizedTerms = normalizeDeniedList(terms)

  if (normalizedTerms.length === 0) {
    return null
  }

  const alternatives = normalizedTerms.map((term) =>
    buildWholeWordSource(foldForMatch(term))
  )

  return new RegExp(alternatives.join('|'), 'iu')
}
