export type JobCardContext = {
  jobCard: HTMLElement
  jobList: Element
}

export type JobFilter = {
  apply: (context: JobCardContext) => boolean
}
