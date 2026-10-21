import { parseStoredLocale, resolveBrowserLocale } from './resolveLocale'

describe('resolveBrowserLocale', () => {
  it.each(['pt', 'pt-BR', 'pt-PT', 'PT-br'])(
    'escolhe pt-BR quando o navegador prefere portugues: %s',
    (language) => {
      expect(resolveBrowserLocale([language])).toBe('pt-BR')
    },
  )

  it.each(['en-US', 'en', 'fr', 'fr-FR'])(
    'escolhe en quando o navegador nao prefere portugues: %s',
    (language) => {
      expect(resolveBrowserLocale([language])).toBe('en')
    },
  )

  it('escolhe en quando a lista de idiomas esta vazia', () => {
    expect(resolveBrowserLocale([])).toBe('en')
  })

  it('respeita a ordem de preferencia do navegador', () => {
    expect(resolveBrowserLocale(['en-US', 'pt-BR'])).toBe('en')
    expect(resolveBrowserLocale(['fr-FR', 'pt-PT'])).toBe('pt-BR')
  })
})

describe('parseStoredLocale', () => {
  it.each(['pt-BR', 'en'] as const)('aceita o idioma salvo %s', (stored) => {
    expect(parseStoredLocale(stored)).toBe(stored)
  })

  it.each([null, undefined, 'pt', 'PT-BR', 'fr', 1, { locale: 'en' }])(
    'ignora valor salvo invalido: %s',
    (stored) => {
      expect(parseStoredLocale(stored)).toBeNull()
    },
  )
})
