import { buildDeniedListPattern } from './deniedListPattern'
import { foldForMatch } from './foldForMatch'

const cardMatches = (terms: string[], cardText: string) => {
  const pattern = buildDeniedListPattern(terms)

  return pattern?.test(foldForMatch(cardText)) ?? false
}

describe('buildDeniedListPattern', () => {
  it('nao cria padrao quando a lista nao tem termo util', () => {
    expect(buildDeniedListPattern([])).toBeNull()
    expect(buildDeniedListPattern(['', '   '])).toBeNull()
    expect(cardMatches([], 'Desenvolvedor Java')).toBe(false)
    expect(cardMatches(['   '], 'Desenvolvedor Java')).toBe(false)
  })

  describe('palavra inteira', () => {
    it.each(['javascript', 'javas', 'java_script'])(
      'java deixa %s visivel',
      (cardText) => {
        expect(cardMatches(['java'], cardText)).toBe(false)
      },
    )

    it.each(['Desenvolvedor Java', 'Java.', '(Java)', 'java-developer'])(
      'java esconde %s',
      (cardText) => {
        expect(cardMatches(['java'], cardText)).toBe(true)
      },
    )

    it.each(['demagogo', 'golang', 'Google', 'jogo', 'algodão'])(
      'GO deixa %s visivel',
      (cardText) => {
        expect(cardMatches(['GO'], cardText)).toBe(false)
      },
    )

    it.each(['Desenvolvedor Go', 'Go/Python'])('GO esconde %s', (cardText) => {
      expect(cardMatches(['GO'], cardText)).toBe(true)
    })
  })

  describe('frase', () => {
    it('candidatura enviada esconde a frase com espacos flexiveis', () => {
      expect(
        cardMatches(
          ['candidatura enviada'],
          'Status: candidatura   enviada hoje',
        ),
      ).toBe(true)
    })

    it('java script deixa javascript visivel', () => {
      expect(cardMatches(['java script'], 'javascript')).toBe(false)
    })

    it('java script esconde Java Script', () => {
      expect(cardMatches(['java script'], 'Vaga de Java   Script')).toBe(true)
    })
  })

  describe('caixa e acento', () => {
    it('JAVA esconde Java', () => {
      expect(cardMatches(['JAVA'], 'Desenvolvedor Java')).toBe(true)
    })

    it('Sao Paulo esconde São Paulo', () => {
      expect(cardMatches(['Sao Paulo'], 'Empresa em São Paulo')).toBe(true)
    })
  })

  describe('caracteres especiais', () => {
    it.each(['C++', 'Senior C++ Engineer'])('C++ esconde %s', (cardText) => {
      expect(cardMatches(['C++'], cardText)).toBe(true)
    })

    it.each(['C+', 'C'])('C++ deixa %s visivel', (cardText) => {
      expect(cardMatches(['C++'], cardText)).toBe(false)
    })

    it('C# esconde o token e deixa CSharp visivel', () => {
      expect(cardMatches(['C#'], 'C# Developer')).toBe(true)
      expect(cardMatches(['C#'], 'CSharp')).toBe(false)
      expect(cardMatches(['C#'], 'C')).toBe(false)
    })

    it('node.js esconde o token literal', () => {
      expect(cardMatches(['node.js'], 'node.js')).toBe(true)
      expect(cardMatches(['node.js'], 'nodejs')).toBe(false)
      expect(cardMatches(['node.js'], 'node')).toBe(false)
      expect(cardMatches(['node.js'], 'nodexjs')).toBe(false)
    })
  })

  it('aplica cada termo da lista como palavra inteira', () => {
    const terms = ['java', 'GO']

    expect(cardMatches(terms, 'javascript')).toBe(false)
    expect(cardMatches(terms, 'demagogo')).toBe(false)
    expect(cardMatches(terms, 'Desenvolvedor Java')).toBe(true)
    expect(cardMatches(terms, 'Desenvolvedor Go')).toBe(true)
  })
})
