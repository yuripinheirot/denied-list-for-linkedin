import { gmMotorsportsDescription } from './__fixtures__/gmMotorsportsDescription'
import {
  detectTechStack,
  findTechOccurrences,
  hasDetectedTechs,
} from './detectTechStack'
import { techCatalog } from './techCatalog'
import { DetectedTechStack } from './techStack.type'

const labelsOf = (stack: DetectedTechStack) => ({
  frontend: stack.frontend.map((tech) => tech.label),
  backend: stack.backend.map((tech) => tech.label),
  ai: stack.ai.map((tech) => tech.label),
  additional: stack.additional.map((tech) => tech.label),
})

const allLabels = (text: string) => {
  const labels = labelsOf(detectTechStack(text))

  return [...labels.frontend, ...labels.backend, ...labels.ai, ...labels.additional]
}

describe('detectTechStack', () => {
  it('identifica a stack da vaga de exemplo sem falsos positivos', () => {
    expect(labelsOf(detectTechStack(gmMotorsportsDescription))).toEqual({
      frontend: ['React'],
      backend: ['C#', '.NET'],
      ai: [],
      additional: ['Azure', 'Agile/Scrum', 'CI/CD', 'Electron'],
    })
  })

  it('retorna vazio quando nao ha tecnologia', () => {
    const stack = detectTechStack('Buscamos uma pessoa comunicativa e proativa.')

    expect(hasDetectedTechs(stack)).toBe(false)
  })

  describe('variacoes de escrita', () => {
    it.each(['Node', 'NODE', 'NodeJS', 'node.js', 'Node JS'])(
      '%s vira Node.js',
      (text) => {
        expect(allLabels(`Experiência com ${text} e APIs`)).toContain(
          'Node.js'
        )
      }
    )

    it.each(['React', 'ReactJS', 'react.js', 'React.JS'])(
      '%s vira React',
      (text) => {
        expect(allLabels(`Experiência com ${text}`)).toContain('React')
      }
    )

    it.each(['C#', 'CSharp', 'c sharp'])('%s vira C#', (text) => {
      expect(allLabels(`Strong ${text} skills`)).toEqual(['C#'])
    })

    it.each(['Postgres', 'PostgreSQL'])('%s vira PostgreSQL', (text) => {
      expect(allLabels(`Banco ${text}`)).toEqual(['PostgreSQL'])
    })

    it('k8s vira Kubernetes e microsserviços ignora acento', () => {
      expect(allLabels('Deploy em k8s com microsserviços')).toEqual([
        'Kubernetes',
        'Microservices',
      ])
    })

    it('separa C# e .NET quando escritos juntos', () => {
      expect(allLabels('Knowledge of C#/.NET')).toEqual(['C#', '.NET'])
    })

    it('ASP.NET Core nao conta como .NET isolado', () => {
      expect(allLabels('ASP.NET Core')).toEqual(['ASP.NET Core'])
    })

    it.each(['Elixir', 'elixir-lang', 'Elixir Lang'])(
      '%s vira Elixir',
      (text) => {
        expect(allLabels(`Experiência com ${text}`)).toContain('Elixir')
      }
    )

    it('detecta o ecossistema Elixir', () => {
      expect(
        allLabels('Elixir, Erlang, BEAM, Phoenix e Phoenix LiveView')
      ).toEqual(
        expect.arrayContaining([
          'Elixir',
          'Erlang',
          'BEAM',
          'Phoenix',
          'Phoenix LiveView',
        ])
      )
    })
  })

  describe('limites de palavra', () => {
    it('JavaScript nao conta como Java', () => {
      expect(allLabels('JavaScript developer')).toEqual(['JavaScript'])
    })

    it('Java e JavaScript juntos contam os dois', () => {
      expect(allLabels('Java and JavaScript')).toEqual(['JavaScript', 'Java'])
    })

    it('GitHub Actions nao conta como Git', () => {
      expect(allLabels('GitHub Actions pipelines')).toEqual(['GitHub Actions'])
    })
  })

  describe('palavras ambiguas', () => {
    it.each([
      'Our go to market strategy',
      'Go to the office twice a week',
      'a go-to person for the team',
      'We react to changes quickly',
      'The next step is an interview',
      'Express your ideas',
      'rust removal service',
    ])('"%s" nao detecta nada', (text) => {
      expect(allLabels(text)).toEqual([])
    })

    it.each([
      ['Backend in Go and Python', 'Go'],
      ['Golang microservices', 'Go'],
      ['Built with Next.js', 'Next.js'],
      ['APIs with Express.js', 'Express.js'],
      ['Systems programming in Rust', 'Rust'],
    ])('"%s" detecta %s', (text, label) => {
      expect(allLabels(text)).toContain(label)
    })
  })

  it('ordena pela quantidade de mencoes', () => {
    const stack = detectTechStack('AWS, Docker, Docker, Docker, AWS, Kafka')

    expect(stack.additional).toEqual([
      { label: 'Docker', count: 3 },
      { label: 'AWS', count: 2 },
    ])
    expect(stack.backend).toEqual([{ label: 'Kafka', count: 1 }])
  })

  it('mantem um catalogo dedicado com pelo menos 40 tecnologias de AI', () => {
    const aiTechnologies = techCatalog.filter(
      (technology) => technology.category === 'ai'
    )

    expect(aiTechnologies.length).toBeGreaterThanOrEqual(40)

    expect(
      allLabels(
        'AI, machine learning, LLMs, RAG, OpenAI, GPT-4, Anthropic, ' +
          'Claude, Gemini, LangChain, Langraph, PyTorch, Pinecone and Qdrant'
      )
    ).toEqual(
      expect.arrayContaining([
        'IA',
        'ML',
        'LLMs',
        'RAG',
        'OpenAI',
        'GPT',
        'Anthropic',
        'Claude',
        'Gemini',
        'LangChain',
        'LangGraph',
        'PyTorch',
        'Pinecone',
        'Qdrant',
      ])
    )
  })

  it('mantem nomes completos de IA como aliases para labels curtos', () => {
    expect(
      allLabels(
        'Artificial Intelligence, inteligência artificial, IA, ' +
          'Deep Learning, DL, Computer Vision, CV, GenAI'
      )
    ).toEqual(expect.arrayContaining(['IA', 'DL', 'CV', 'GenAI']))
  })

  it('mantem um catalogo sem labels ou aliases duplicados dentro da definicao', () => {
    const labels = techCatalog.map((technology) => technology.label)

    expect(new Set(labels).size).toBe(labels.length)

    for (const technology of techCatalog) {
      const aliases = [
        ...technology.aliases,
        ...(technology.caseSensitiveAliases ?? []),
      ]

      expect(aliases.every((alias) => alias.trim().length > 0)).toBe(true)
      expect(new Set(aliases).size).toBe(aliases.length)
    }

    expect(techCatalog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Elixir', category: 'backend' }),
        expect.objectContaining({ label: 'Phoenix', category: 'backend' }),
        expect.objectContaining({ label: 'IA', category: 'ai' }),
        expect.objectContaining({ label: 'LLMs', category: 'ai' }),
      ])
    )
  })

  it('retorna ocorrencias com offsets e remove sobreposicoes menores', () => {
    const text = 'Generative AI with LangGraph and AI'
    const occurrences = findTechOccurrences(text)

    expect(
      occurrences.map((occurrence) => ({
        label: occurrence.label,
        text: text.slice(occurrence.start, occurrence.end),
      }))
    ).toEqual([
      { label: 'GenAI', text: 'Generative AI' },
      { label: 'LangGraph', text: 'LangGraph' },
      { label: 'IA', text: 'AI' },
    ])
  })
})
