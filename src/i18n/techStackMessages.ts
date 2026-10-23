import { TechCategory } from '../techStack/techStack.type'
import { Locale } from '../types/Locale.type'

export type TechStackMessages = {
  title: string
  empty: string
  categories: Record<TechCategory, string>
  englishLevels: Record<string, string>
}

const ptBR: TechStackMessages = {
  title: 'Tecnologias identificadas',
  empty: 'Nenhuma tecnologia identificada',
  categories: {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'Inteligência Artificial',
    additional: 'Adicionais',
    english: 'Proficiência em inglês',
  },
  englishLevels: {
    A1: 'A1',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2',
    C1: 'C1',
    C2: 'C2',
    Basic: 'Básico',
    Intermediate: 'Intermediário',
    'Upper-intermediate': 'Intermediário avançado',
    Advanced: 'Avançado',
    Proficient: 'Proficiente',
    Fluent: 'Fluente',
    Native: 'Nativo',
  },
}

const en: TechStackMessages = {
  title: 'Tech stack detected',
  empty: 'No technologies identified',
  categories: {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'AI',
    additional: 'Additional',
    english: 'English proficiency',
  },
  englishLevels: {
    A1: 'A1',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2',
    C1: 'C1',
    C2: 'C2',
    Basic: 'Basic',
    Intermediate: 'Intermediate',
    'Upper-intermediate': 'Upper-intermediate',
    Advanced: 'Advanced',
    Proficient: 'Proficient',
    Fluent: 'Fluent',
    Native: 'Native',
  },
}

export const techStackMessagesByLocale: Record<Locale, TechStackMessages> = {
  'pt-BR': ptBR,
  en,
}
