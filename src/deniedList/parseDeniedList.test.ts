import { normalizeDeniedList, parseDeniedList } from './parseDeniedList'

describe('normalizeDeniedList', () => {
  it('remove vazios, junta espacos e corta as bordas', () => {
    expect(
      normalizeDeniedList(['  machine   learning  ', '', '   ', '  Go  ']),
    ).toEqual(['machine learning', 'Go'])
  })

  it('deduplica ignorando caixa e acento e mantem a primeira forma', () => {
    expect(normalizeDeniedList(['Java', 'java', 'jáva', '  JAVA  '])).toEqual([
      'Java',
    ])
  })
})

describe('parseDeniedList', () => {
  it.each([null, undefined, 'java', 1, { description: 'java' }])(
    'devolve lista vazia quando o valor armazenado nao e uma lista',
    (stored) => {
      expect(parseDeniedList(stored)).toEqual([])
    },
  )

  it('le strings e o formato legado description', () => {
    expect(
      parseDeniedList([
        '  Java  ',
        { description: 'Go' },
        { description: '  candidatura   enviada  ' },
        { description: '' },
        { description: '   ' },
        { description: 1 },
        { name: 'Acme' },
        null,
        42,
      ]),
    ).toEqual(['Java', 'Go', 'candidatura enviada'])
  })

  it('deduplica termo atual e description legada pela mesma chave', () => {
    expect(
      parseDeniedList([
        'Java',
        { description: 'java' },
        { description: 'jáva' },
      ]),
    ).toEqual(['Java'])
  })
})
