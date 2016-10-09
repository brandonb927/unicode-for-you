// Turn an HTML string "template" into a real DOM element
const htmlToElement = (htmlString) => {
  let template = document.createElement('template')
  template.innerHTML = htmlString.trim()
  return template.content.firstChild
}

export default htmlToElement
