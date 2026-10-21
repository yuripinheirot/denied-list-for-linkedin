import { Locale } from '../types/Locale.type'

const JOB_SEARCH_RESULTS_URL =
  'https://www.linkedin.com/jobs/search-results'

export type Messages = {
  title: string
  settings: string
  language: string
  languagePtBr: string
  languageEn: string
  extensionActive: string
  extensionActiveDescription: string
  deniedListSection: string
  newTermAction: string
  emptyDeniedList: string
  deleteTermTitle: string
  cancel: string
  delete: string
  newTermTitle: string
  termLabel: string
  termRequired: string
  save: string
  edit: string
  unsupportedPage: string
}

const ptBR: Messages = {
  title: 'Denied list',
  settings: 'Configurações',
  language: 'Idioma',
  languagePtBr: 'Português (Brasil)',
  languageEn: 'English',
  extensionActive: 'Extensão ativa',
  extensionActiveDescription: 'Aplica a denied list na busca de vagas',
  deniedListSection: 'Denied list',
  newTermAction: 'Nova',
  emptyDeniedList: 'Nenhum termo na denied list',
  deleteTermTitle: 'Deseja realmente deletar este termo?',
  cancel: 'Cancelar',
  delete: 'Deletar',
  newTermTitle: 'Novo termo',
  termLabel: 'Insira um termo',
  termRequired: 'Por favor, insira um termo!',
  save: 'Salvar',
  edit: 'Editar',
  unsupportedPage:
    'Esta extensão só funciona na página de resultados de pesquisa de vagas: ' +
    JOB_SEARCH_RESULTS_URL,
}

const en: Messages = {
  title: 'Denied list',
  settings: 'Settings',
  language: 'Language',
  languagePtBr: 'Português (Brasil)',
  languageEn: 'English',
  extensionActive: 'Extension active',
  extensionActiveDescription: 'Applies the denied list to the job search',
  deniedListSection: 'Denied list',
  newTermAction: 'New',
  emptyDeniedList: 'No terms in the denied list',
  deleteTermTitle: 'Do you really want to delete this term?',
  cancel: 'Cancel',
  delete: 'Delete',
  newTermTitle: 'New term',
  termLabel: 'Enter a term',
  termRequired: 'Please enter a term.',
  save: 'Save',
  edit: 'Edit',
  unsupportedPage:
    'This extension only works on the job search results page: ' +
    JOB_SEARCH_RESULTS_URL,
}

export const messagesByLocale: Record<Locale, Messages> = {
  'pt-BR': ptBR,
  en,
}
