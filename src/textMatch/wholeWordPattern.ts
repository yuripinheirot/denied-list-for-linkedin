const WORD_CHARACTER = String.raw`\p{L}\p{N}_`

export const NOT_PRECEDED_BY_WORD_CHARACTER = `(?<![${WORD_CHARACTER}])`
export const NOT_FOLLOWED_BY_WORD_CHARACTER = `(?![${WORD_CHARACTER}])`

export const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const buildFlexibleSpacingSource = (term: string) => {
  return term.trim().split(/\s+/).map(escapeRegExp).join(String.raw`\s+`)
}

export const buildWholeWordSource = (term: string) => {
  return `${NOT_PRECEDED_BY_WORD_CHARACTER}${buildFlexibleSpacingSource(term)}${NOT_FOLLOWED_BY_WORD_CHARACTER}`
}
