import { AppConfigProvider } from './context/AppConfig.context'
import { BlackListProvider } from './context/BlackList.context'
import { MainView } from './views/Main'

export const App = () => {
  return (
    <AppConfigProvider>
      <BlackListProvider>
        <MainView />
      </BlackListProvider>
    </AppConfigProvider>
  )
}
