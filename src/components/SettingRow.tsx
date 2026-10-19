import { Flex, Switch, Typography } from 'antd'

type SettingRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const SettingRow = ({
  label,
  description,
  checked,
  onChange,
}: SettingRowProps) => {
  return (
    <Flex
      justify='space-between'
      align='center'
      gap={16}
    >
      <Flex
        vertical
        gap={2}
      >
        <Typography.Text strong>{label}</Typography.Text>
        <Typography.Text
          type='secondary'
          style={{ fontSize: 12, lineHeight: 1.4 }}
        >
          {description}
        </Typography.Text>
      </Flex>
      <Switch
        checked={checked}
        onChange={onChange}
      />
    </Flex>
  )
}
