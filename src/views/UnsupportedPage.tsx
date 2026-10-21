import { useContext } from 'react'

import { Alert, Flex } from 'antd'

import { PopupHeader } from '../components/PopupHeader'
import { LocaleContext } from '../context/Locale.context'

export const UnsupportedPage = () => {
  const { messages } = useContext(LocaleContext)

  return (
    <Flex
      vertical
      gap={20}
      style={{
        width: 400,
        padding: 16,
        backgroundColor: '#fff',
      }}
    >
      <PopupHeader />
      <Alert
        type='warning'
        showIcon
        message={messages.unsupportedPage}
      />
    </Flex>
  )
}
