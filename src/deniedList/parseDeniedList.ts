import { foldForMatch } from './foldForMatch'

const collapseWhitespace = (value: string) => {
  return value.trim().replace(/\s+/g, ' ')
}

export const normalizeDeniedList = (terms: string[]) => {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const term of terms) {
    const collapsed = collapseWhitespace(term)

    if (!collapsed) {
      continue
    }

    const key = foldForMatch(collapsed)

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push(collapsed)
  }

  return normalized
}

const readLegacyDescription = (item: unknown) => {
  if (typeof item !== 'object' || item === null || !('description' in item)) {
    return null
  }

  const { description } = item as { description: unknown }

  return typeof description === 'string' ? description : null
}

export const parseDeniedList = (stored: unknown) => {
  if (!Array.isArray(stored)) {
    return []
  }

  const terms = stored.flatMap((item) => {
    if (typeof item === 'string') {
      return [item]
    }

    const description = readLegacyDescription(item)

    return description ? [description] : []
  })

  return normalizeDeniedList(terms)
}
