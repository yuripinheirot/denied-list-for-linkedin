import { useContext } from 'react'

import { ExclamationCircleFilled, PlusSquareFilled } from '@ant-design/icons'

import {
  Button,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Tooltip,
  Typography,
  Switch,
} from 'antd'

import { EditableText } from '../components/EditableText'
import { AppConfigContext } from '../context/AppConfig.context'
import { BlackListContext } from '../context/BlackList.context'
import { BlackListType } from '../types/BlackList.type'
const { info, confirm, destroyAll } = Modal

export const MainView = () => {
  const { blackListActions, blackListStore } = useContext(BlackListContext)
  const { appConfig, appConfigActions } = useContext(AppConfigContext)

  const saveChangesEditableText = (data: BlackListType) => {
    return blackListActions.update(data)
  }

  const deleteFilter = (data: BlackListType) => {
    return blackListActions.delete(data)
  }

  const createFilter = (data: BlackListType) => {
    return blackListActions.create(data)
  }

  const toggleActiveExtension = (value: boolean) => {
    return appConfigActions.setActiveStatus(value)
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
        padding: 20,
        backgroundColor: '#fff',
        overflowY: 'auto',
      }}
      gap={20}
    >
      <Flex
        justify='space-between'
        align='center'
      >
        <Typography.Title style={{ margin: 0 }}>Filtros</Typography.Title>
        <Flex
          gap={20}
          align='center'
        >
          <Tooltip
            title={`${appConfig.active ? 'Desativar' : 'Ativar'} extensão`}
          >
            <Switch
              size='small'
              checked={appConfig.active}
              onClick={() => {
                toggleActiveExtension(!appConfig.active)
              }}
            />
          </Tooltip>
          <Tooltip title='Novo'>
            <Button
              icon={<PlusSquareFilled />}
              size='small'
              style={{ marginRight: 7 }}
              onClick={handleCreateModal}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <List
        itemLayout='horizontal'
        dataSource={blackListStore}
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
  )
}
