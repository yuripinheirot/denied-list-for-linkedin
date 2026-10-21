import { useEffect, useState } from 'react'

import { AppConfigProvider } from './context/AppConfig.context'
import { DeniedListProvider } from './context/DeniedList.context'
import { isJobSearchResultsUrl } from './linkedin/isJobSearchResultsUrl'
import { getActiveTabUrl } from './repository/chromeEvents.repository'
import { MainView } from './views/Main'
import { UnsupportedPage } from './views/UnsupportedPage'

type PopupPage = 'loading' | 'supported' | 'unsupported'

export const App = () => {
  const [popupPage, setPopupPage] = useState<PopupPage>('loading')

  useEffect(() => {
    const loadPopupPage = async () => {
      const url = await getActiveTabUrl()

      setPopupPage(isJobSearchResultsUrl(url) ? 'supported' : 'unsupported')
    }

    void loadPopupPage()
  }, [])

  if (popupPage === 'loading') {
    return null
  }

  if (popupPage === 'unsupported') {
    return <UnsupportedPage />
  }

  return (
    <AppConfigProvider>
      <DeniedListProvider>
        <MainView />
      </DeniedListProvider>
    </AppConfigProvider>
  )
}
