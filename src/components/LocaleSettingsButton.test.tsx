import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { initialAppConfig } from '../appConfig/parseAppConfig'
import { AppConfigContext } from '../context/AppConfig.context'
import { LocaleProvider } from '../context/Locale.context'
import { Locale } from '../types/Locale.type'
import { LocaleSettingsButton } from './LocaleSettingsButton'

const storage: { locale?: unknown } = {}

const installChromeStorage = () => {
  global.chrome = {
    runtime: {},
    storage: {
      local: {
        get: (
          _key: string,
          callback: (items: Record<string, unknown>) => void,
        ) => {
          callback({ locale: storage.locale })
        },
        set: (items: Record<string, unknown>, callback: () => void) => {
          storage.locale = items.locale
          callback()
        },
      },
    },
  } as unknown as typeof chrome
}

const renderSettings = (
  appConfig = initialAppConfig,
  appConfigActions = {
    setActiveStatus: async () => {},
    setAutoClosePostApplyModal: async () => {},
  },
) => {
  render(
    <LocaleProvider>
      <AppConfigContext.Provider value={{ appConfig, appConfigActions }}>
        <LocaleSettingsButton />
      </AppConfigContext.Provider>
    </LocaleProvider>,
  )
}

describe('LocaleSettingsButton', () => {
  beforeEach(() => {
    storage.locale = undefined
    document.documentElement.lang = 'en'
    installChromeStorage()
  })

  it('aplica o idioma salvo e permite trocar pelo botao de configuracao', async () => {
    storage.locale = 'pt-BR'
    renderSettings()

    const settingsButton = await screen.findByRole('button', {
      name: 'Configurações',
    })

    expect(document.documentElement.lang).toBe('pt-BR')

    userEvent.click(settingsButton)
    expect(screen.getByText('Idioma')).toBeTruthy()

    userEvent.click(screen.getByRole('radio', { name: 'English' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy()
    })
    expect(storage.locale).toBe<Locale>('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('exibe e altera as configuracoes da extensao dentro do painel', () => {
    const setActiveStatus = jest.fn(async () => {})
    const setAutoClosePostApplyModal = jest.fn(async () => {})

    renderSettings(initialAppConfig, {
      setActiveStatus,
      setAutoClosePostApplyModal,
    })

    userEvent.click(
      screen.getByRole('button', {
        name: 'Settings',
      }),
    )

    const switches = screen.getAllByRole('switch')

    expect(switches).toHaveLength(2)
    expect(switches[0].getAttribute('aria-checked')).toBe('true')
    expect(switches[1].getAttribute('aria-checked')).toBe('true')

    userEvent.click(switches[1])

    expect(setAutoClosePostApplyModal).toHaveBeenCalledWith(false)
    expect(setActiveStatus).not.toHaveBeenCalled()
  })
})
