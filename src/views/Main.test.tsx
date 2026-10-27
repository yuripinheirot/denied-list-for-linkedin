import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { initialAppConfig } from '../appConfig/parseAppConfig'
import { AppConfigContext } from '../context/AppConfig.context'
import { DeniedListContext } from '../context/DeniedList.context'
import { LocaleContext } from '../context/Locale.context'
import { messagesByLocale } from '../i18n/messages'
import { MainView } from './Main'

const renderMainView = (deniedList: string[]) => {
  render(
    <LocaleContext.Provider
      value={{
        locale: 'en',
        messages: messagesByLocale.en,
        setLocale: async () => {},
      }}
    >
      <AppConfigContext.Provider
        value={{
          appConfig: initialAppConfig,
          appConfigActions: {
            setActiveStatus: async () => {},
            setAutoClosePostApplyModal: async () => {},
          },
        }}
      >
        <DeniedListContext.Provider
          value={{
            deniedList,
            deniedListActions: {
              create: async () => {},
              update: async () => {},
              delete: async () => {},
            },
          }}
        >
          <MainView />
        </DeniedListContext.Provider>
      </AppConfigContext.Provider>
    </LocaleContext.Provider>,
  )
}

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})

describe('MainView', () => {
  it('renders the extension and modal auto-close settings', () => {
    renderMainView([])

    expect(screen.getAllByRole('switch')).toHaveLength(2)
    expect(
      screen.getByText('Close the application modal automatically'),
    ).toBeTruthy()
  })

  it('renders all denied terms without a search query', () => {
    renderMainView(['React', 'Café'])

    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByText('Café')).toBeTruthy()
  })

  it('renders denied terms from newest to oldest', () => {
    renderMainView(['React', 'Café', 'TypeScript'])

    const renderedTerms = ['TypeScript', 'Café', 'React'].map((term) =>
      screen.getByText(term),
    )

    expect(
      renderedTerms[0].compareDocumentPosition(renderedTerms[1]),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(
      renderedTerms[1].compareDocumentPosition(renderedTerms[2]),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('filters by substring without considering case or accents', () => {
    renderMainView(['Café', 'JavaScript', 'Python'])

    const searchInput = screen.getByRole('textbox', {
      name: 'Search the denied list',
    })
    userEvent.type(searchInput, 'CAFE')

    expect(screen.getByText('Café')).toBeTruthy()
    expect(screen.queryByText('JavaScript')).toBeNull()
    expect(screen.queryByText('Python')).toBeNull()

    userEvent.clear(searchInput)

    expect(screen.getByText('JavaScript')).toBeTruthy()
    expect(screen.getByText('Python')).toBeTruthy()
  })

  it('treats a whitespace-only query as empty', () => {
    renderMainView(['React', 'Café'])

    userEvent.type(
      screen.getByRole('textbox', { name: 'Search the denied list' }),
      '   ',
    )

    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByText('Café')).toBeTruthy()
  })

  it('shows a distinct message when no term matches', () => {
    renderMainView(['React', 'Café'])

    userEvent.type(
      screen.getByRole('textbox', { name: 'Search the denied list' }),
      'Python',
    )

    expect(screen.getByText('No terms found')).toBeTruthy()
    expect(screen.queryByText('React')).toBeNull()
    expect(screen.queryByText('Café')).toBeNull()
  })
})
