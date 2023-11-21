import { useState } from 'react'
import { BlackListType } from '../types/BlackList.type'
import { Button, Input, List, Tooltip } from 'antd'
import { EditFilled, DeleteFilled } from '@ant-design/icons'

type Props = {
  data: BlackListType
  initOpened?: boolean
  saveChanges: (data: BlackListType) => void
  openModal: (data: BlackListType) => void
}

export const EditableText = ({
  data,
  initOpened,
  saveChanges,
  openModal,
}: Props) => {
  const [opened, setOpened] = useState(!!initOpened)
  const [innerText, setInnerText] = useState(data.description)

  const handleSaveChanges = () => {
    saveChanges({ id: data.id, description: innerText })
    setOpened(false)
  }

  const cancelChanges = () => {
    setInnerText(data.description)
    setOpened(false)
  }

  const handleOpenModal = () => {
    openModal({ id: data.id, description: innerText })
  }

  const actions = [
    <Button
      type='primary'
      size='small'
      onClick={handleSaveChanges}
    >
      Salvar
    </Button>,
    <Button
      type='primary'
      danger
      size='small'
      onClick={cancelChanges}
    >
      Cancelar
    </Button>,
  ]

  return (
    <List.Item
      actions={
        opened
          ? actions
          : [
              <Tooltip title='Deletar'>
                <Button
                  size='small'
                  onClick={handleOpenModal}
                  icon={<DeleteFilled />}
                />
              </Tooltip>,
              <Tooltip title='Editar'>
                <Button
                  size='small'
                  onClick={() => setOpened(true)}
                  icon={<EditFilled />}
                />
              </Tooltip>,
            ]
      }
    >
      {opened ? (
        <Input
          value={innerText}
          onChange={(e) => setInnerText(e.target.value)}
          size='small'
        />
      ) : (
        <List.Item.Meta title={data.description} />
      )}
    </List.Item>
  )
}
