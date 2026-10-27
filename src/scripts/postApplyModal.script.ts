import { readAppConfig } from './storage/pageStorage.script'

const POST_APPLY_MODAL_SELECTOR =
  '[data-test-modal-container][aria-hidden="false"]'
const POST_APPLY_DIALOG_SELECTOR =
  '[role="dialog"][aria-labelledby="post-apply-modal"]'
const MODAL_CLOSE_BUTTON_SELECTOR = '[data-test-modal-close-btn]'

let modalObserver: MutationObserver | null = null

export const closePostApplyModalIfEnabled = () => {
  if (!readAppConfig().autoClosePostApplyModal) {
    return
  }

  const modals = document.querySelectorAll<HTMLElement>(
    POST_APPLY_MODAL_SELECTOR,
  )

  modals.forEach((modal) => {
    const dialog = modal.querySelector(POST_APPLY_DIALOG_SELECTOR)
    const closeButton = dialog?.querySelector<HTMLButtonElement>(
      MODAL_CLOSE_BUTTON_SELECTOR,
    )

    if (!dialog || !closeButton || closeButton.disabled || !modal.isConnected) {
      return
    }

    closeButton.click()
  })
}

export const startPostApplyModalObserver = () => {
  if (modalObserver === null && document.body) {
    modalObserver = new MutationObserver(() => {
      closePostApplyModalIfEnabled()
    })

    modalObserver.observe(document.body, {
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
