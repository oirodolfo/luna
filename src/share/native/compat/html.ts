type HtmlNode = {
  tag?: string
  attrs?: Record<string, string>
  content?: HtmlNode[]
  text?: string
}

function toTree(node: ChildNode): HtmlNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return { text: node.textContent || '' }
  }
  const element = node as Element
  return {
    tag: element.tagName.toLowerCase(),
    attrs: Object.fromEntries(Array.from(element.attributes).map((attr) => [attr.name, attr.value])),
    content: Array.from(element.childNodes).map(toTree),
  }
}

function fromTree(node: HtmlNode): Node {
  if (node.text != null) {
    return document.createTextNode(node.text)
  }
  const element = document.createElement(node.tag || 'div')
  Object.entries(node.attrs || {}).forEach(([name, value]) => element.setAttribute(name, value))
  ;(node.content || []).forEach((child) => element.appendChild(fromTree(child)))
  return element
}

const html = {
  parse(value: string) {
    const template = document.createElement('template')
    template.innerHTML = value.trim()
    return Array.from(template.content.childNodes).map(toTree)
  },
  stringify(tree: HtmlNode[]) {
    const fragment = document.createDocumentFragment()
    tree.forEach((node) => fragment.appendChild(fromTree(node)))
    const container = document.createElement('div')
    container.appendChild(fragment)
    return container.innerHTML
  },
}

export default html
