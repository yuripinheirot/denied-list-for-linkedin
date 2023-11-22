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
} from 'antd'

import { EditableText } from '../components/EditableText'
import { BlackListContext } from '../context/BlackList.context'
import { BlackListType } from '../types/BlackList.type'
const { info, confirm, destroyAll } = Modal

export const MainView = () => {
  const { blackListActions, blackListStore } = useContext(BlackListContext)

  const saveChangesEditableText = (data: BlackListType) => {
    return blackListActions.update(data)
  }

  const deleteFilter = (data: BlackListType) => {
    return blackListActions.delete(data)
  }

  const handleDeleteModal = (data: BlackListType) => {
    confirm({
      title: 'Deseja realmente deletar este filtro?',
      icon: <ExclamationCircleFilled />,
      closable: true,
      content: data.description,
      onOk: async () => {
        await deleteFilter(data)
      },
    })
  }

  const handleCreateModal = () => {
    info({
      icon: <ExclamationCircleFilled />,
      footer: null,
      closable: true,
      maskClosable: true,
      title: 'Novo filtro',
      content: (
        <Form
          layout='vertical'
          onFinish={(payload: BlackListType) => {
            blackListActions.create(payload)
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
        <Tooltip title='Novo'>
          <Button
            icon={<PlusSquareFilled />}
            size='small'
            style={{ marginRight: 7 }}
            onClick={handleCreateModal}
          />
        </Tooltip>
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
