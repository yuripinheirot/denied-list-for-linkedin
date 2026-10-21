import { useContext } from 'react'

import { SettingOutlined } from '@ant-design/icons'

import { Button, Flex, Popover, Radio, Typography } from 'antd'

import { LocaleContext } from '../context/Locale.context'
import { parseStoredLocale } from '../i18n/resolveLocale'

export const LocaleSettingsButton = () => {
  const { locale, messages, setLocale } = useContext(LocaleContext)

  return (
    <Popover
      trigger='click'
      placement='bottomRight'
      content={
        <Flex
          vertical
          gap={8}
        >
          <Typography.Text strong>{messages.language}</Typography.Text>
          <Radio.Group
            value={locale}
            onChange={(event) => {
              const nextLocale = parseStoredLocale(event.target.value as unknown)

              if (!nextLocale) {
                return
              }

              void setLocale(nextLocale)
            }}
          >
            <Flex
              vertical
              gap={8}
            >
              <Radio value='pt-BR'>{messages.languagePtBr}</Radio>
              <Radio value='en'>{messages.languageEn}</Radio>
            </Flex>
          </Radio.Group>
        </Flex>
      }
    >
      <Button
        type='text'
        icon={<SettingOutlined />}
        aria-label={messages.settings}
      />
    </Popover>
  )
}
