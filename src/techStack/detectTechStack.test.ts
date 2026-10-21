import { gmMotorsportsDescription } from './__fixtures__/gmMotorsportsDescription'
import { detectTechStack, hasDetectedTechs } from './detectTechStack'
import { DetectedTechStack } from './techStack.type'

const labelsOf = (stack: DetectedTechStack) => ({
  frontend: stack.frontend.map((tech) => tech.label),
  backend: stack.backend.map((tech) => tech.label),
  additional: stack.additional.map((tech) => tech.label),
})

const allLabels = (text: string) => {
  const labels = labelsOf(detectTechStack(text))

  return [...labels.frontend, ...labels.backend, ...labels.additional]
}

describe('detectTechStack', () => {
  it('identifica a stack da vaga de exemplo sem falsos positivos', () => {
    expect(labelsOf(detectTechStack(gmMotorsportsDescription))).toEqual({
      frontend: ['React'],
      backend: ['C#', '.NET'],
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
})
