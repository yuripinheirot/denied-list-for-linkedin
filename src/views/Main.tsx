import { Flex, List, Modal } from 'antd'
import { useContext } from 'react'
import { EditableText } from '../components/EditableText'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  BlackListActions,
  BlackListContext,
} from '../context/BlackList.context'
import { BlackListType } from '../types/BlackList.type'
const { confirm } = Modal

export const MainView = () => {
  const { state, dispatch } = useContext(BlackListContext)

  const saveChangesEditableText = (data: BlackListType) => {
    dispatch({
      type: BlackListActions.UPDATE,
      payload: data,
    })
  }

  const deleteFilter = (data: BlackListType) => {
    dispatch({
      type: BlackListActions.DELETE,
      payload: data,
    })
  }

  const handleModal = (data: BlackListType) => {
    confirm({
      title: 'Deseja realmente deletar este filtro?',
      icon: <ExclamationCircleFilled />,
      content: data.description,
      onOk() {
        deleteFilter(data)
      },
    })
  }

  return (
    <Flex
      vertical
      style={{ width: 500, padding: 20 }}
    >
      <List
        itemLayout='horizontal'
        dataSource={state}
        renderItem={(item) => (
          <EditableText
            data={item}
            saveChanges={saveChangesEditableText}
            openModal={handleModal}
          />
        )}
        rowKey={(item) => item.id!}
      />
    </Flex>
  )
}
