import { useContext } from 'react'

import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'

import { Button, Empty, Flex, Form, Input, List, Modal, Typography } from 'antd'

import { EditableText } from '../components/EditableText'
import { SettingRow } from '../components/SettingRow'
import { AppConfigContext } from '../context/AppConfig.context'
import { DeniedListContext } from '../context/DeniedList.context'

const { info, confirm, destroyAll } = Modal

export const MainView = () => {
  const { appConfig, appConfigActions } = useContext(AppConfigContext)
  const { deniedList, deniedListActions } = useContext(DeniedListContext)

  const handleDeleteModal = (term: string) => {
    confirm({
      title: 'Deseja realmente deletar este termo?',
      icon: <ExclamationCircleFilled />,
      maskClosable: true,
      content: term,
      cancelText: 'Cancelar',
      okText: 'Deletar',
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
      title: 'Novo termo',
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
            label='Insira um termo'
            rules={[
              { required: true, message: 'Por favor, insira um termo!' },
            ]}
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
            <Button onClick={() => destroyAll()}>Cancelar</Button>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginLeft: 8 }}
            >
              Salvar
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
          Denied list
        </Typography.Title>
      </Flex>
      <SettingRow
        label='Extensão ativa'
        description='Aplica a denied list na busca de vagas'
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
            Denied list
          </Typography.Text>
          <Button
            type='text'
            size='small'
            icon={<PlusOutlined />}
            onClick={handleCreateModal}
          >
            Nova
          </Button>
        </Flex>
        <List
          itemLayout='horizontal'
          dataSource={deniedList}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='Nenhum termo na denied list'
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
