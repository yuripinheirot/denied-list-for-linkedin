export const TECH_CATEGORIES = [
  'frontend',
  'backend',
  'ai',
  'additional',
] as const

export type TechCategory = (typeof TECH_CATEGORIES)[number]

export type TechDefinition = {
  label: string
  category: TechCategory
  aliases: string[]
  caseSensitiveAliases?: string[]
  excludedNextWords?: string[]
}

export type DetectedTech = {
  label: string
  count: number
}

export type DetectedTechStack = Record<TechCategory, DetectedTech[]>
