const STYLE_ELEMENT_ID = 'dlfl-tech-stack-styles'

const TECH_STACK_CSS = `
.dlfl-tech-panel {
  box-sizing: border-box;
  margin: 0 0 12px;
  padding: 12px 16px;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
}
.dlfl-tech-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
}
.dlfl-tech-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 6px;
}
.dlfl-tech-category {
  flex: 0 0 84px;
  padding-top: 2px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
}
.dlfl-tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dlfl-tech-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.dlfl-tech-badge--frontend {
  color: #378fe9;
  background: rgba(55, 143, 233, 0.15);
}
.dlfl-tech-badge--backend {
  color: #2e9e6a;
  background: rgba(68, 179, 127, 0.16);
}
.dlfl-tech-badge--additional {
  color: inherit;
  background: rgba(128, 128, 128, 0.18);
}
.dlfl-tech-count {
  font-weight: 400;
  opacity: 0.75;
}
.dlfl-tech-empty {
  margin: 0;
  font-size: 12px;
  opacity: 0.7;
}
`

export const ensureTechStackStyles = () => {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return
  }

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  style.textContent = TECH_STACK_CSS
  document.head.appendChild(style)
}
