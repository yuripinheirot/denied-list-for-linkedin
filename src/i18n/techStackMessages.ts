import { TechCategory } from '../techStack/techStack.type'
import { Locale } from '../types/Locale.type'

export type TechStackMessages = {
  title: string
  empty: string
  categories: Record<TechCategory, string>
}

const ptBR: TechStackMessages = {
  title: 'Tecnologias identificadas',
  empty: 'Nenhuma tecnologia identificada',
  categories: {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'Inteligência Artificial',
    additional: 'Adicionais',
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
  },
}

export const techStackMessagesByLocale: Record<Locale, TechStackMessages> = {
  'pt-BR': ptBR,
  en,
}
