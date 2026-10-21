import { useContext } from 'react'

import { Flex, Typography } from 'antd'

import { LocaleContext } from '../context/Locale.context'
import { LocaleSettingsButton } from './LocaleSettingsButton'

export const PopupHeader = () => {
  const { messages } = useContext(LocaleContext)

  return (
    <Flex
      align='center'
      justify='space-between'
      gap={12}
    >
      <Flex
        align='center'
        gap={12}
      >
        <img
          src={`${process.env.PUBLIC_URL}/icons/icon128.png`}
          alt=''
          width={36}
          height={36}
          style={{ borderRadius: 8 }}
        />
        <Typography.Title
          level={4}
          style={{ margin: 0 }}
        >
          {messages.title}
        </Typography.Title>
      </Flex>
      <LocaleSettingsButton />
    </Flex>
  )
}
