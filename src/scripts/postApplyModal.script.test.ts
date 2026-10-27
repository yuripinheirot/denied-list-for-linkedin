import { KeysStorage } from '../types/KeysStorage.type'
import {
  closePostApplyModalIfEnabled,
  startPostApplyModalObserver,
  stopPostApplyModalObserver,
} from './postApplyModal.script'

const createPostApplyModal = (ariaHidden = 'false') => {
  const modal = document.createElement('div')
  modal.setAttribute('data-test-modal-container', '')
  modal.setAttribute('aria-hidden', ariaHidden)
  modal.innerHTML = `
    <div role="dialog" aria-labelledby="post-apply-modal">
      <button data-test-modal-close-btn type="button"></button>
    </div>
  `

  return modal
}

const setAppConfig = (autoClosePostApplyModal: boolean) => {
  localStorage.setItem(
    KeysStorage.APP_CONFIG,
    JSON.stringify({
      active: true,
      autoClosePostApplyModal,
    }),
  )
}

const flushMutations = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}

beforeEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
  setAppConfig(true)
})

afterEach(() => {
  stopPostApplyModalObserver()
})

describe('post-apply modal observer', () => {
  it('closes an already visible post-apply modal', () => {
    const modal = createPostApplyModal()
    const closeButton = modal.querySelector('button') as HTMLButtonElement
    const closeHandler = jest.fn()

    closeButton.addEventListener('click', closeHandler)
    document.body.append(modal)

    startPostApplyModalObserver()

    expect(closeHandler).toHaveBeenCalledTimes(1)
  })

  it('closes a post-apply modal added after the observer starts', async () => {
    startPostApplyModalObserver()

    const modal = createPostApplyModal()
    const closeButton = modal.querySelector('button') as HTMLButtonElement
    const closeHandler = jest.fn()

    closeButton.addEventListener('click', closeHandler)
    document.body.append(modal)

    await flushMutations()

    expect(closeHandler).toHaveBeenCalledTimes(1)
  })

  it('closes a modal when it becomes visible', async () => {
    startPostApplyModalObserver()

    const modal = createPostApplyModal('true')
    const closeButton = modal.querySelector('button') as HTMLButtonElement
    const closeHandler = jest.fn()

    closeButton.addEventListener('click', closeHandler)
    document.body.append(modal)
    modal.setAttribute('aria-hidden', 'false')

    await flushMutations()

    expect(closeHandler).toHaveBeenCalledTimes(1)
  })

  it('does not close the modal when the option is disabled', async () => {
    setAppConfig(false)
    const modal = createPostApplyModal()
    const closeButton = modal.querySelector('button') as HTMLButtonElement
    const closeHandler = jest.fn()

    closeButton.addEventListener('click', closeHandler)
    document.body.append(modal)

    startPostApplyModalObserver()
    await flushMutations()

    expect(closeHandler).not.toHaveBeenCalled()
  })

  it('can scan for an open modal after the option is enabled', () => {
    setAppConfig(false)
    const modal = createPostApplyModal()
    const closeButton = modal.querySelector('button') as HTMLButtonElement
    const closeHandler = jest.fn()

    closeButton.addEventListener('click', closeHandler)
    document.body.append(modal)
    startPostApplyModalObserver()

    expect(closeHandler).not.toHaveBeenCalled()

    setAppConfig(true)
    closePostApplyModalIfEnabled()

    expect(closeHandler).toHaveBeenCalledTimes(1)
  })
})
