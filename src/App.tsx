import { AppConfigProvider } from './context/AppConfig.context'
import { DeniedListProvider } from './context/DeniedList.context'
import { MainView } from './views/Main'

export const App = () => {
  return (
    <AppConfigProvider>
      <DeniedListProvider>
        <MainView />
      </DeniedListProvider>
    </AppConfigProvider>
  )
}
