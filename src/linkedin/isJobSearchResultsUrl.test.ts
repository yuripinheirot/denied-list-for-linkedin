import { isJobSearchResultsUrl } from './isJobSearchResultsUrl'

describe('isJobSearchResultsUrl', () => {
  it.each([
    'https://www.linkedin.com/jobs/search-results',
    'https://www.linkedin.com/jobs/search-results/',
    'https://www.linkedin.com/jobs/search-results/?currentJobId=1&keywords=go',
    'https://www.linkedin.com/jobs/search-results?keywords=go',
    'https://www.linkedin.com/jobs/search-results/#results',
    'https://WWW.LINKEDIN.COM/jobs/search-results',
  ])('aceita a pagina de resultados de pesquisa: %s', (url) => {
    expect(isJobSearchResultsUrl(url)).toBe(true)
  })

  it.each([
    undefined,
    '',
    'not a url',
    'http://www.linkedin.com/jobs/search-results',
    'https://linkedin.com/jobs/search-results',
    'https://br.linkedin.com/jobs/search-results',
    'https://www.linkedin.com/feed',
    'https://www.linkedin.com/jobs',
    'https://www.linkedin.com/jobs/search',
    'https://www.linkedin.com/jobs/search/?currentJobId=1',
    'https://www.linkedin.com/jobs/view/123',
    'https://www.linkedin.com/jobs/search-results/extra',
    'https://example.com/jobs/search-results',
  ])('rejeita url fora da pagina de resultados: %s', (url) => {
    expect(isJobSearchResultsUrl(url)).toBe(false)
  })
})
