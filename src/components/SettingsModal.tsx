import { Divider, Flex, Modal } from 'antd'

import { SettingRow } from './SettingRow'

const { info } = Modal

type SettingsContentProps = {
  active: boolean
  hideAppliedJobs: boolean
  onActiveChange: (checked: boolean) => void
  onHideAppliedChange: (checked: boolean) => void
}

export const createSettingsContent = ({
  active,
  hideAppliedJobs,
  onActiveChange,
  onHideAppliedChange,
}: SettingsContentProps) => {
  return (
    <Flex
      vertical
      style={{
        padding: '4px 14px',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        backgroundColor: '#fafafa',
      }}
    >
      <SettingRow
        label='Extensão ativa'
        description='Aplica os filtros na busca de vagas'
        checked={active}
        onChange={onActiveChange}
      />
      <Divider style={{ margin: '4px 0' }} />
      <SettingRow
        label='Ocultar vagas aplicadas'
        description='Esconde vagas aplicadas'
        checked={hideAppliedJobs}
        onChange={onHideAppliedChange}
      />
    </Flex>
  )
}

export const openSettingsModal = (
  props: SettingsContentProps & { afterClose?: () => void }
) => {
  return info({
    icon: null,
    footer: null,
    closable: true,
    maskClosable: true,
    title: 'Configurações',
    content: createSettingsContent(props),
    afterClose: props.afterClose,
  })
}
