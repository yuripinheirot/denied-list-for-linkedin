import { readAppConfig } from './storage/pageStorage.script'

const POST_APPLY_DIALOG_SELECTOR = 'dialog, [role="dialog"]'
const MODAL_CLOSE_BUTTON_SELECTOR =
  '[data-test-modal-close-btn], button[aria-label="Dismiss"], .artdeco-modal__dismiss'
const NOT_NOW_BUTTON_TEXT = 'Not now'

let modalObserver: MutationObserver | null = null

const isPostApplyDialog = (dialog: HTMLElement) => {
  if (dialog.getAttribute('aria-labelledby') === 'post-apply-modal') {
    return true
  }

  if (dialog.querySelector('#post-apply-modal') !== null) {
    return true
  }

  return findNotNowButton(dialog) !== undefined
}

const findNotNowButton = (dialog: ParentNode) => {
  return Array.from(dialog.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === NOT_NOW_BUTTON_TEXT,
  )
}

const isHidden = (element: HTMLElement) =>
  element.getAttribute('aria-hidden') === 'true' || !element.isConnected

export const closePostApplyModalIfEnabled = () => {
  if (!readAppConfig().autoClosePostApplyModal) {
    return
  }

  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>(POST_APPLY_DIALOG_SELECTOR),
  ).filter(isPostApplyDialog)

  dialogs.forEach((dialog) => {
    const modal =
      dialog.closest<HTMLElement>('[data-test-modal-container]') ?? dialog
    const closeButton =
      dialog.querySelector<HTMLButtonElement>(MODAL_CLOSE_BUTTON_SELECTOR) ??
      findNotNowButton(dialog)

    if (
      isHidden(modal) ||
      isHidden(dialog) ||
      !closeButton ||
      closeButton.disabled
    ) {
      return
    }

    closeButton.click()
  })
}

export const startPostApplyModalObserver = () => {
  const observerTarget = document.body

  if (modalObserver === null && observerTarget) {
    modalObserver = new MutationObserver(() => {
      closePostApplyModalIfEnabled()
    })

    modalObserver.observe(observerTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-hidden', 'class'],
    })
  }

  closePostApplyModalIfEnabled()
}

export const stopPostApplyModalObserver = () => {
  modalObserver?.disconnect()
  modalObserver = null
}
