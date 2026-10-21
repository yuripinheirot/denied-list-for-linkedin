import { DetectedTechStack } from '../../techStack/techStack.type'
import {
  readCachedTechStack,
  TECH_STACK_CACHE_STORAGE_KEY,
  TECH_STACK_CACHE_VERSION,
  writeCachedTechStack,
} from './techStackCache.repository'

const emptyStack: DetectedTechStack = {
  frontend: [],
  backend: [],
  additional: [],
}

const reactStack: DetectedTechStack = {
  ...emptyStack,
  frontend: [{ label: 'React', count: 1 }],
}

describe('techStackCache.repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null quando a vaga ainda nao foi cacheada', () => {
    expect(readCachedTechStack('123')).toBeNull()
  })

  it('salva e le a stack pelo ID da vaga', () => {
    writeCachedTechStack('123', reactStack)

    expect(readCachedTechStack('123')).toEqual(reactStack)
    expect(readCachedTechStack('456')).toBeNull()
  })

  it('preserva uma stack vazia como resultado cacheado', () => {
    writeCachedTechStack('123', emptyStack)

    expect(readCachedTechStack('123')).toEqual(emptyStack)
  })

  it.each([
    'not-json',
    JSON.stringify({ version: 2, jobs: { '123': reactStack } }),
    JSON.stringify({ version: TECH_STACK_CACHE_VERSION, jobs: { '123': [] } }),
  ])('ignora cache invalida: %s', (value) => {
    localStorage.setItem(TECH_STACK_CACHE_STORAGE_KEY, value)

    expect(readCachedTechStack('123')).toBeNull()
  })

  it('mantem entradas validas e descarta entradas corrompidas', () => {
    localStorage.setItem(
      TECH_STACK_CACHE_STORAGE_KEY,
      JSON.stringify({
        version: TECH_STACK_CACHE_VERSION,
        jobs: {
          valid: reactStack,
          invalid: { frontend: 'React' },
        },
      })
    )

    expect(readCachedTechStack('valid')).toEqual(reactStack)
    expect(readCachedTechStack('invalid')).toBeNull()
  })

  it('nao cria entrada para ID vazio', () => {
    writeCachedTechStack('', reactStack)

    expect(localStorage.getItem(TECH_STACK_CACHE_STORAGE_KEY)).toBeNull()
  })
})
