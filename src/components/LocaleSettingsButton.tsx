import { useContext } from 'react'

import { SettingOutlined } from '@ant-design/icons'

import { Button, Flex, Popover, Radio, Typography } from 'antd'

import { AppConfigContext } from '../context/AppConfig.context'
import { LocaleContext } from '../context/Locale.context'
import { parseStoredLocale } from '../i18n/resolveLocale'
import { SettingRow } from './SettingRow'

export const LocaleSettingsButton = () => {
  const { locale, messages, setLocale } = useContext(LocaleContext)
  const { appConfig, appConfigActions } = useContext(AppConfigContext)

  return (
    <Popover
      trigger='click'
      placement='bottomRight'
      content={
        <Flex
          vertical
          gap={16}
          style={{ width: 320 }}
        >
          <Flex
            vertical
            gap={12}
          >
            <SettingRow
              label={messages.extensionActive}
              description={messages.extensionActiveDescription}
              checked={appConfig.active}
              onChange={(checked) => {
                void appConfigActions.setActiveStatus(checked)
              }}
            />
            <SettingRow
              label={messages.autoClosePostApplyModal}
              description={messages.autoClosePostApplyModalDescription}
              checked={appConfig.autoClosePostApplyModal}
              onChange={(checked) => {
                void appConfigActions.setAutoClosePostApplyModal(checked)
              }}
            />
          </Flex>
          <Flex
            vertical
            gap={8}
          >
            <Typography.Text strong>{messages.language}</Typography.Text>
            <Radio.Group
              value={locale}
              onChange={(event) => {
                const nextLocale = parseStoredLocale(
                  event.target.value as unknown,
                )

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
