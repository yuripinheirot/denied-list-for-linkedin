export const JOB_CARD_SELECTOR =
  '[role="button"][componentkey^="job-card-component-ref-"]'

export const getJobCardContainer = (jobCard: HTMLElement, jobList: Element) => {
  let container = jobCard

  while (
    container.parentElement &&
    container.parentElement !== jobList &&
    container.parentElement.querySelectorAll(JOB_CARD_SELECTOR).length === 1
  ) {
    container = container.parentElement
  }

  return container
}
