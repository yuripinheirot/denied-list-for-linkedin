import { Alert, Flex } from 'antd'

const UNSUPPORTED_PAGE_MESSAGE =
  'Esta extensão só funciona na página de resultados de pesquisa de vagas: https://www.linkedin.com/jobs/search-results'

export const UnsupportedPage = () => {
  return (
    <Flex
      style={{
        width: 400,
        padding: 16,
        backgroundColor: '#fff',
      }}
    >
      <Alert
        type='warning'
        showIcon
        message={UNSUPPORTED_PAGE_MESSAGE}
      />
    </Flex>
  )
}
