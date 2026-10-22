import { detectTechStack } from '../../techStack/detectTechStack'
import {
  readCachedTechStack,
  writeCachedTechStack,
} from '../storage/techStackCache.repository'
import { TECH_HIGHLIGHT_CLASS } from './jobDescriptionHighlighter'
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

  let expandButton: HTMLButtonElement | null = null

  if (isTruncated) {
    const button = document.createElement('button')
    expandButton = button
    button.setAttribute('data-testid', 'expandable-text-button')
    button.textContent = '… more'
    textBox.appendChild(button)
    jest
      .spyOn(button, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList)
  }

  document.body.appendChild(pane)

  return { pane, block, expandButton }
}

describe('techStackPanel.script', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('expande automaticamente uma descricao truncada', () => {
    const { pane, expandButton } = createStackedPane(
      '123',
      'React and Docker',
      true
    )
    const button = expandButton as HTMLButtonElement
    const clickSpy = jest.spyOn(button, 'click').mockImplementation(() => {
      button.remove()
    })

    updateTechStackPanel(pane)

    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(readCachedTechStack('123')).toEqual(
      detectTechStack('React and Docker')
    )
    expect(pane.querySelector('.dlfl-tech-panel')).not.toBeNull()
  })

  it('nao clica em um botao de expansao oculto', () => {
    const { pane, expandButton } = createStackedPane(
      '123',
      'React and Docker',
      true
    )
    const button = expandButton as HTMLButtonElement
    const clickSpy = jest.spyOn(button, 'click')
    ;(button.getClientRects as jest.Mock).mockReturnValue({
      length: 0,
    } as DOMRectList)

    updateTechStackPanel(pane)

    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('nao repete o clique no mesmo botao em atualizacoes', () => {
    const { pane, expandButton } = createStackedPane(
      '123',
      'React and Docker',
      true
    )
    const clickSpy = jest
      .spyOn(expandButton as HTMLButtonElement, 'click')
      .mockImplementation(() => undefined)

    updateTechStackPanel(pane)
    updateTechStackPanel(pane)

    expect(clickSpy).toHaveBeenCalledTimes(1)
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

  it('exibe labels curtos de IA e preserva os nomes na descricao', () => {
    const text = 'Artificial Intelligence and Large Language Models'
    const { pane, block } = createStackedPane('123', text, false)

    updateTechStackPanel(pane)

    const panel = pane.querySelector('.dlfl-tech-panel')
    const textBox = block.querySelector(
      '[data-testid="expandable-text-box"]'
    ) as HTMLElement

    expect(panel?.textContent).toContain('IA')
    expect(panel?.textContent).toContain('LLMs')
    expect(panel?.textContent).not.toContain('Artificial Intelligence')
    expect(panel?.textContent).not.toContain('Large Language Models')
    expect(textBox.textContent).toBe(text)
    expect(
      Array.from(textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)).map(
        (highlight) => highlight.getAttribute('data-dlfl-tech-label')
      )
    ).toEqual(['IA', 'LLMs'])
  })

  it('destaca todas as tecnologias sem alterar o texto da descricao', () => {
    const text = 'React, NODE, LangChain and <literal & text>'
    const { pane, block } = createStackedPane('123', text, false)

    updateTechStackPanel(pane)

    const textBox = block.querySelector(
      '[data-testid="expandable-text-box"]'
    ) as HTMLElement
    const highlights = Array.from(
      textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)
    )

    expect(highlights.map((highlight) => highlight.textContent)).toEqual([
      'React',
      'NODE',
      'LangChain',
    ])
    expect(textBox.textContent).toBe(text)
  })

  it('preserva elementos filhos e nao duplica destaques em atualizacoes', () => {
    const { pane, block } = createStackedPane('123', '', false)
    const textBox = block.querySelector(
      '[data-testid="expandable-text-box"]'
    ) as HTMLElement
    const strong = document.createElement('strong')
    const emphasis = document.createElement('em')
    strong.textContent = 'Lang'
    emphasis.textContent = 'PyTorch'
    textBox.append(strong, document.createTextNode('Chain and '), emphasis)

    updateTechStackPanel(pane)
    updateTechStackPanel(pane)

    expect(textBox.textContent).toBe('LangChain and PyTorch')
    expect(textBox.querySelector('strong')).toBe(strong)
    expect(textBox.querySelector('em')).toBe(emphasis)
    expect(
      Array.from(textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)).map(
        (highlight) => [
          highlight.getAttribute('data-dlfl-tech-label'),
          highlight.textContent,
        ]
      )
    ).toEqual([
      ['LangChain', 'Lang'],
      ['LangChain', 'Chain'],
      ['PyTorch', 'PyTorch'],
    ])
    expect(
      textBox.querySelectorAll(
        `.${TECH_HIGHLIGHT_CLASS} .${TECH_HIGHLIGHT_CLASS}`
      )
    ).toHaveLength(0)
  })

  it('remove o destaque enquanto a descricao esta truncada e reaplica apos expandir', () => {
    const { pane, block } = createStackedPane('123', 'React and Docker', false)
    const textBox = block.querySelector(
      '[data-testid="expandable-text-box"]'
    ) as HTMLElement

    updateTechStackPanel(pane)
    expect(textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)).toHaveLength(2)

    const button = document.createElement('button')
    button.setAttribute('data-testid', 'expandable-text-button')
    button.textContent = '… more'
    jest
      .spyOn(button, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList)
    textBox.appendChild(button)

    updateTechStackPanel(pane)
    expect(textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)).toHaveLength(0)

    button.remove()
    updateTechStackPanel(pane)
    expect(textBox.querySelectorAll(`.${TECH_HIGHLIGHT_CLASS}`)).toHaveLength(2)
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
