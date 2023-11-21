import { BlackListProvider } from './context/BlackList.context'
import { MainView } from './views/Main'

export const App = () => {
  return (
    <BlackListProvider>
      <MainView />
    </BlackListProvider>
  )
}
