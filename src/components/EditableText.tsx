import { useContext, useState } from 'react'

import { DeleteFilled, EditFilled } from '@ant-design/icons'

import { Button, Input, List, Tooltip } from 'antd'

import { LocaleContext } from '../context/Locale.context'

type EditableTextProps = {
  term: string
  saveChanges: (current: string, next: string) => Promise<void>
  openModal: (term: string) => void
}

export const EditableText = ({
  term,
  saveChanges,
  openModal,
}: EditableTextProps) => {
  const { messages } = useContext(LocaleContext)
  const [opened, setOpened] = useState(false)
  const [innerText, setInnerText] = useState(term)

  const handleSaveChanges = () => {
    void saveChanges(term, innerText)
    setOpened(false)
  }

  const cancelChanges = () => {
    setInnerText(term)
    setOpened(false)
  }

  const actions = [
    <Button
      type='primary'
      key='btnSave'
      size='small'
      onClick={handleSaveChanges}
    >
      {messages.save}
    </Button>,
    <Button
      type='primary'
      key='btnCancel'
      danger
      size='small'
      onClick={cancelChanges}
    >
      {messages.cancel}
    </Button>,
  ]

  return (
    <List.Item
      actions={
        opened
          ? actions
          : [
              <Tooltip
                title={messages.delete}
                key='tooltipDelete'
              >
                <Button
                  size='small'
                  onClick={() => openModal(innerText)}
                  icon={<DeleteFilled />}
                />
              </Tooltip>,
              <Tooltip
                title={messages.edit}
                key='tooltipEdit'
              >
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
          onChange={(event) => setInnerText(event.target.value)}
          size='small'
        />
      ) : (
        <List.Item.Meta title={term} />
      )}
    </List.Item>
  )
}
