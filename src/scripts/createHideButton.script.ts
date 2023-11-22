const createHideButton = () => {
  const divElement = document.createElement('div')
  divElement.style.textAlign = 'right'
  divElement.id = 'hide-button'

  const hideButton = document.createElement('button')
  hideButton.textContent = 'Filtrar'
  hideButton.style.padding = '5px 10px'
  hideButton.style.margin = '0px 10px 10px 0px'
  hideButton.style.backgroundColor = '#f2f2f2'
  hideButton.style.color = '#2e2e2e'
  hideButton.style.border = '1px solid black'
  hideButton.style.borderRadius = '5px'

  hideButton.addEventListener('click', () => {
    alert('clicou')
  })

  divElement.appendChild(hideButton)

  return divElement
}

export const insertHideButtons = () => {
  const jobList = document.querySelectorAll(
    '#main > div > div.scaffold-layout__list > div > ul > li'
  )

  for (const children of jobList) {
    if (!children.querySelector('#hide-button')) {
      children.append(createHideButton())
    }
  }
}
