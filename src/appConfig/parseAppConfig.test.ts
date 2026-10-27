import { initialAppConfig, parseAppConfig } from './parseAppConfig'

describe('parseAppConfig', () => {
  it('enables the modal auto-close option by default', () => {
    expect(parseAppConfig({ active: true })).toEqual(initialAppConfig)
  })

  it('preserves an explicitly disabled modal auto-close option', () => {
    expect(
      parseAppConfig({
        active: true,
        autoClosePostApplyModal: false,
      }),
    ).toEqual({
      active: true,
      autoClosePostApplyModal: false,
    })
  })

  it('keeps the modal auto-close option enabled for invalid stored data', () => {
    expect(parseAppConfig(undefined)).toEqual(initialAppConfig)
  })
})
