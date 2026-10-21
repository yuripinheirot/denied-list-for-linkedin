const JOB_SEARCH_RESULTS_HOST = 'www.linkedin.com'
const JOB_SEARCH_RESULTS_PATH = '/jobs/search-results'

const pathnameWithoutTrailingSlash = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '')
  }

  return pathname
}

export const isJobSearchResultsUrl = (url: string | undefined) => {
  if (!url) {
    return false
  }

  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    return false
  }

  return (
    parsed.protocol === 'https:' &&
    parsed.hostname === JOB_SEARCH_RESULTS_HOST &&
    pathnameWithoutTrailingSlash(parsed.pathname) === JOB_SEARCH_RESULTS_PATH
  )
}
