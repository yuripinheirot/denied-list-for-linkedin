import { detectTechStack } from '../../techStack/detectTechStack'
import {
  readCachedTechStack,
  writeCachedTechStack,
} from '../storage/techStackCache.repository'
import { updateTechStackPanel } from './techStackPanel.script'

const createStackedPane = (
  jobId: string,
  text: string,
  isTruncated: boolean
) => {
  const pane = document.createElement('div')
  pane.setAttribute(
    'data-sdui-screen',
    'com.linkedin.sdui.flagshipnav.jobs.SemanticJobDetails'
  )
  pane.innerHTML = `
    <div componentkey="JobDetails_AboutTheJob_${jobId}">
      <h2>About the job</h2>
      <p><span data-testid="expandable-text-box"></span></p>
    </div>
  `

  const block = pane.firstElementChild as HTMLElement
  const textBox = block.querySelector(
    '[data-testid="expandable-text-box"]'
  ) as HTMLElement
  textBox.textContent = text

  if (isTruncated) {
    const button = document.createElement('button')
    button.setAttribute('data-testid', 'expandable-text-button')
    button.textContent = '… more'
    textBox.appendChild(button)
    jest
      .spyOn(button, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList)
  }

  document.body.appendChild(pane)

  return { pane, block }
}

describe('techStackPanel.script', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renderiza uma stack cacheada mesmo com a descricao truncada', () => {
    const cachedStack = detectTechStack('React and Docker')
    writeCachedTechStack('123', cachedStack)
    const { pane, block } = createStackedPane('123', 'React and Docker', true)

    updateTechStackPanel(pane)

    const panel = pane.querySelector('.dlfl-tech-panel')

    expect(panel).not.toBeNull()
    expect(panel?.nextElementSibling).toBe(block)
    expect(panel?.textContent).toContain('React')
    expect(panel?.textContent).toContain('Docker')
  })

  it('aguarda a descricao completa quando nao existe cache', () => {
    const { pane } = createStackedPane('123', 'React and Docker', true)

    updateTechStackPanel(pane)

    expect(pane.querySelector('.dlfl-tech-panel')).toBeNull()
    expect(readCachedTechStack('123')).toBeNull()
  })

  it('detecta e salva a stack quando a descricao completa chega', () => {
    const text = 'React and Docker'
    const { pane } = createStackedPane('123', text, false)

    updateTechStackPanel(pane)

    expect(readCachedTechStack('123')).toEqual(detectTechStack(text))
    expect(pane.querySelector('.dlfl-tech-panel')).not.toBeNull()
  })

  it('atualiza a cache quando uma descricao completa muda', () => {
    writeCachedTechStack('123', detectTechStack('React'))
    const { pane } = createStackedPane('123', 'Vue.js', false)

    updateTechStackPanel(pane)

    expect(readCachedTechStack('123')).toEqual(detectTechStack('Vue.js'))
    expect(pane.querySelector('.dlfl-tech-panel')?.textContent).toContain(
      'Vue.js'
    )
    expect(pane.querySelector('.dlfl-tech-panel')?.textContent).not.toContain(
      'React'
    )
  })

  it('remove a stack anterior e usa a cache da nova vaga', () => {
    writeCachedTechStack('123', detectTechStack('React'))
    writeCachedTechStack('456', detectTechStack('Node.js'))
    const { pane, block } = createStackedPane('123', 'React', true)

    updateTechStackPanel(pane)
    block.setAttribute('componentkey', 'JobDetails_AboutTheJob_456')

    const textBox = block.querySelector(
      '[data-testid="expandable-text-box"]'
    ) as HTMLElement
    textBox.textContent = 'Node.js'
    const button = document.createElement('button')
    button.setAttribute('data-testid', 'expandable-text-button')
    jest
      .spyOn(button, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList)
    textBox.appendChild(button)

    updateTechStackPanel(pane)

    const panels = pane.querySelectorAll('.dlfl-tech-panel')

    expect(panels).toHaveLength(1)
    expect(panels[0].getAttribute('data-dlfl-job-id')).toBe('456')
    expect(panels[0].textContent).toContain('Node.js')
    expect(panels[0].textContent).not.toContain('React')
  })
})
