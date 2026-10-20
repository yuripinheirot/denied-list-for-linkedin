const COMBINING_MARK = /\p{M}/gu

export const foldForMatch = (value: string) => {
  return value.normalize('NFD').replace(COMBINING_MARK, '').toLowerCase()
}
