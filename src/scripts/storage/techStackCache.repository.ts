import {
  DetectedTech,
  DetectedTechStack,
  TECH_CATEGORIES,
} from '../../techStack/techStack.type'

export const TECH_STACK_CACHE_STORAGE_KEY = 'dlfl-tech-stack-cache'
export const TECH_STACK_CACHE_VERSION = 3

type StoredTechStackCache = {
  version: number
  jobs: Record<string, unknown>
}

const createEmptyCache = (): StoredTechStackCache => ({
  version: TECH_STACK_CACHE_VERSION,
  jobs: {},
})

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isDetectedTech = (value: unknown): value is DetectedTech => {
  return (
    isRecord(value) &&
    typeof value.label === 'string' &&
    value.label.length > 0 &&
    typeof value.count === 'number' &&
    Number.isInteger(value.count) &&
    value.count > 0
  )
}

const isDetectedTechList = (value: unknown): value is DetectedTech[] => {
  return Array.isArray(value) && value.every(isDetectedTech)
}

const isDetectedTechStack = (value: unknown): value is DetectedTechStack => {
  return (
    isRecord(value) &&
    TECH_CATEGORIES.every((category) =>
      isDetectedTechList(value[category])
    )
  )
}

const readStoredCache = (): StoredTechStackCache => {
  try {
    const raw = localStorage.getItem(TECH_STACK_CACHE_STORAGE_KEY)

    if (!raw) {
      return createEmptyCache()
    }

    const parsed: unknown = JSON.parse(raw)

    if (
      !isRecord(parsed) ||
      parsed.version !== TECH_STACK_CACHE_VERSION ||
      !isRecord(parsed.jobs)
    ) {
      return createEmptyCache()
    }

    const jobs: Record<string, unknown> = {}

    for (const [jobId, stack] of Object.entries(parsed.jobs)) {
      if (isDetectedTechStack(stack)) {
        jobs[jobId] = stack
      }
    }

    return { version: TECH_STACK_CACHE_VERSION, jobs }
  } catch (error) {
    console.warn('Unable to read the tech stack cache', error)
    return createEmptyCache()
  }
}

export const readCachedTechStack = (
  jobId: string
): DetectedTechStack | null => {
  if (!jobId) {
    return null
  }

  const cached = readStoredCache().jobs[jobId]

  return isDetectedTechStack(cached) ? cached : null
}

export const writeCachedTechStack = (
  jobId: string,
  stack: DetectedTechStack
) => {
  if (!jobId || !isDetectedTechStack(stack)) {
    return
  }

  const cache = readStoredCache()
  cache.jobs[jobId] = stack

  try {
    localStorage.setItem(
      TECH_STACK_CACHE_STORAGE_KEY,
      JSON.stringify({
        version: TECH_STACK_CACHE_VERSION,
        jobs: cache.jobs,
      })
    )
  } catch (error) {
    console.warn('Unable to write the tech stack cache', error)
  }
}
