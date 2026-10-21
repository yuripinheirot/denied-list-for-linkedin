import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

const renderSettings = () => {
  render(
    <LocaleProvider>
      <LocaleSettingsButton />
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
})
