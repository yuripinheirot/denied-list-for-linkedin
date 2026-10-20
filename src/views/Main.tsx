import { useContext, useEffect, useRef } from 'react'

import {
  ExclamationCircleFilled,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'

import {
  Button,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Tooltip,
  Typography,
} from 'antd'

import { EditableText } from '../components/EditableText'
import {
  createSettingsContent,
  openSettingsModal,
} from '../components/SettingsModal'
import { AppConfigContext } from '../context/AppConfig.context'
import { BlackListContext } from '../context/BlackList.context'
import { BlackListType } from '../types/BlackList.type'
const { info, confirm, destroyAll } = Modal

export const MainView = () => {
  const { blackListActions, blackListStore } = useContext(BlackListContext)
  const { appConfig, appConfigActions } = useContext(AppConfigContext)
  const settingsModalRef = useRef<ReturnType<typeof info> | null>(null)
  const appConfigActionsRef = useRef(appConfigActions)
  appConfigActionsRef.current = appConfigActions

  const saveChangesEditableText = (data: BlackListType) => {
    return blackListActions.update(data)
  }

  const deleteFilter = (data: BlackListType) => {
    return blackListActions.delete(data)
  }

  const createFilter = (data: BlackListType) => {
    return blackListActions.create(data)
  }

  const handleDeleteModal = (data: BlackListType) => {
    confirm({
      title: 'Deseja realmente deletar este filtro?',
      icon: <ExclamationCircleFilled />,
      maskClosable: true,
      content: data.description,
      cancelText: 'Cancelar',
      okText: 'Deletar',
      onOk: async () => {
        await deleteFilter(data)
      },
    })
  }

  const settingsContentProps = () => {
    return {
      active: appConfig.active,
      hideAppliedJobs: appConfig.hideAppliedJobs,
      onActiveChange: (checked: boolean) => {
        void appConfigActionsRef.current.setActiveStatus(checked)
      },
      onHideAppliedChange: (checked: boolean) => {
        void appConfigActionsRef.current.setHideAppliedJobs(checked)
      },
    }
  }

  const handleOpenSettings = () => {
    settingsModalRef.current = openSettingsModal({
      ...settingsContentProps(),
      afterClose: () => {
        settingsModalRef.current = null
      },
    })
  }

  useEffect(() => {
    settingsModalRef.current?.update({
      content: createSettingsContent(settingsContentProps()),
    })
  }, [appConfig.active, appConfig.hideAppliedJobs])

  const handleCreateModal = () => {
    info({
      icon: <ExclamationCircleFilled />,
      footer: null,
      maskClosable: true,
      title: 'Novo filtro',
      content: (
        <Form
          layout='vertical'
          onFinish={(payload: BlackListType) => {
            createFilter(payload)
            destroyAll()
          }}
        >
          <Form.Item<string>
            name='description'
            label='Insira uma descrição'
            rules={[
              { required: true, message: 'Por favor, insira uma descrição!' },
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
        justify='space-between'
        align='center'
      >
        <Typography.Title
          level={4}
          style={{ margin: 0 }}
        >
          Filtros
        </Typography.Title>
        <Tooltip title='Configurações'>
          <Button
            type='text'
            icon={<SettingOutlined />}
            aria-label='Configurações'
            onClick={handleOpenSettings}
          />
        </Tooltip>
      </Flex>

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
            Empresas
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
          dataSource={blackListStore}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='Nenhuma empresa filtrada'
              />
            ),
          }}
          renderItem={(item) => (
            <EditableText
              data={item}
              saveChanges={(data) => saveChangesEditableText(data)}
              openModal={handleDeleteModal}
            />
          )}
          rowKey={(item) => item.id!}
        />
      </Flex>
    </Flex>
  )
}
