import { useContext } from 'react'

import { Divider, Flex, Modal } from 'antd'

import { AppConfigContext } from '../context/AppConfig.context'
import { SettingRow } from './SettingRow'

type SettingsModalProps = {
  open: boolean
  onClose: () => void
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { appConfig, appConfigActions } = useContext(AppConfigContext)

  return (
    <Modal
      title='Configurações'
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable
      width={352}
      mousePosition={null}
      transitionName=''
      maskTransitionName=''
      styles={{ body: { paddingTop: 12 } }}
    >
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
          checked={appConfig.active}
          onChange={(checked) => {
            appConfigActions.setActiveStatus(checked)
          }}
        />
        <Divider style={{ margin: '4px 0' }} />
        <SettingRow
          label='Ocultar vagas aplicadas'
          description='Esconde vagas aplicadas'
          checked={appConfig.hideAppliedJobs}
          onChange={(checked) => {
            appConfigActions.setHideAppliedJobs(checked)
          }}
        />
      </Flex>
    </Modal>
  )
}
