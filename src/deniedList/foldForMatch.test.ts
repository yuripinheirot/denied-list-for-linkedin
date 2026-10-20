import { foldForMatch } from './foldForMatch'

describe('foldForMatch', () => {
  it('baixa a caixa', () => {
    expect(foldForMatch('JAVA')).toBe('java')
    expect(foldForMatch('Go')).toBe('go')
  })

  it('remove acentos e cedilha', () => {
    expect(foldForMatch('São Paulo')).toBe('sao paulo')
    expect(foldForMatch('jáva')).toBe('java')
    expect(foldForMatch('ÁÉÍÓÚáéíóúçÇ')).toBe('aeiouaeioucc')
  })

  it('preserva simbolos usados em termos tecnicos', () => {
    expect(foldForMatch('C++')).toBe('c++')
    expect(foldForMatch('C#')).toBe('c#')
    expect(foldForMatch('node.js')).toBe('node.js')
  })
})
