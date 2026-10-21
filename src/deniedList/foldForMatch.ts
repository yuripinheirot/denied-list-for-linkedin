const COMBINING_MARK = /\p{M}/gu

export const stripAccents = (value: string) => {
  return value.normalize('NFD').replace(COMBINING_MARK, '')
}

export const foldForMatch = (value: string) => {
  return stripAccents(value).toLowerCase()
}
