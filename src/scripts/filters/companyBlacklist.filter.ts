import { BlackListType } from '../../types/BlackList.type'
import { KeysStorage } from '../../types/KeysStorage.type'
import { extractCompanyFromJobCard } from '../createHideButton.script'
import { JobFilter } from './jobFilter.type'

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const blackListPattern = () => {
  const blackList = localStorage.getItem(KeysStorage.BLACKLIST)
  if (!blackList) {
    localStorage.setItem(KeysStorage.BLACKLIST, JSON.stringify([]))
  }

  const blackListParsed = JSON.parse(blackList || '[]') as BlackListType[]

  if (blackListParsed.length === 0) {
    return new RegExp('$.^', 'i')
  }

  return new RegExp(
    blackListParsed
      .map((item) => escapeRegExp(item.description.toLowerCase()))
      .join('|'),
    'i'
  )
}

const removeJob = (element: HTMLElement) => {
  element.remove()
  console.log('Removed job: ', element.innerText.replaceAll('\n', ''))
}

const isJobBlacklisted = (element: HTMLElement) => {
  const company = extractCompanyFromJobCard(element)
  return company ? blackListPattern().test(company.toLowerCase()) : false
}

export const companyBlacklistFilter: JobFilter = {
  apply: ({ jobCard }) => {
    if (!isJobBlacklisted(jobCard)) {
      return false
    }

    removeJob(jobCard)
    return true
  },
}
