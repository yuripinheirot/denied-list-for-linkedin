import { useContext } from 'react'

import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'

import { Button, Empty, Flex, Form, Input, List, Modal, Typography } from 'antd'

import { EditableText } from '../components/EditableText'
import { PopupHeader } from '../components/PopupHeader'
import { SettingRow } from '../components/SettingRow'
import { AppConfigContext } from '../context/AppConfig.context'
import { DeniedListContext } from '../context/DeniedList.context'
import { LocaleContext } from '../context/Locale.context'

const { info, confirm, destroyAll } = Modal

export const MainView = () => {
  const { appConfig, appConfigActions } = useContext(AppConfigContext)
  const { deniedList, deniedListActions } = useContext(DeniedListContext)
  const { messages } = useContext(LocaleContext)

  const handleDeleteModal = (term: string) => {
    confirm({
      title: messages.deleteTermTitle,
      icon: <ExclamationCircleFilled />,
      maskClosable: true,
      content: term,
      cancelText: messages.cancel,
      okText: messages.delete,
      onOk: async () => {
        await deniedListActions.delete(term)
      },
    })
  }

  const handleCreateModal = () => {
    info({
      icon: <ExclamationCircleFilled />,
      footer: null,
      maskClosable: true,
      title: messages.newTermTitle,
      content: (
        <Form
          layout='vertical'
          onFinish={(payload: { term: string }) => {
            void deniedListActions.create(payload.term)
            destroyAll()
          }}
        >
          <Form.Item
            name='term'
            label={messages.termLabel}
            rules={[{ required: true, message: messages.termRequired }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: 0,
            }}
          >
            <Button onClick={() => destroyAll()}>{messages.cancel}</Button>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginLeft: 8 }}
            >
              {messages.save}
            </Button>
          </Form.Item>
        </Form>
      ),
    })
  }

  return (
    <Flex
      vertical
      style={{
        width: 400,
        height: 500,
        padding: 16,
        backgroundColor: '#fff',
        overflowY: 'auto',
      }}
      gap={20}
    >
      <PopupHeader />
      <SettingRow
        label={messages.extensionActive}
        description={messages.extensionActiveDescription}
        checked={appConfig.active}
        onChange={(checked) => {
          void appConfigActions.setActiveStatus(checked)
        }}
      />

      <Flex
        vertical
        gap={8}
      >
        <Flex
          justify='space-between'
          align='center'
        >
          <Typography.Text
            type='secondary'
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            {messages.deniedListSection}
          </Typography.Text>
          <Button
            type='text'
            size='small'
            icon={<PlusOutlined />}
            onClick={handleCreateModal}
          >
            {messages.newTermAction}
          </Button>
        </Flex>
        <List
          itemLayout='horizontal'
          dataSource={deniedList}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={messages.emptyDeniedList}
              />
            ),
          }}
          renderItem={(term) => (
            <EditableText
              term={term}
              saveChanges={deniedListActions.update}
              openModal={handleDeleteModal}
            />
          )}
          rowKey={(term) => term}
        />
      </Flex>
    </Flex>
  )
}
