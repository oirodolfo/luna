import { toArr, toStr } from './shared'

type EventHandler = (event: any, ...args: any[]) => void

type ElementInput = string | Element | Document | Window | ArrayLike<Element> | null | undefined

function createElementsFromHtml(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return Array.from(template.content.childNodes)
}

function toElements(input: ElementInput): any[] {
  if (!input) return []
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (trimmed.startsWith('<')) return createElementsFromHtml(trimmed)
    return Array.from(document.querySelectorAll(trimmed))
  }
  if (input instanceof Window || input instanceof Document || input instanceof Element) return [input]
  return Array.from(input as ArrayLike<Element>)
}

function ensureNode(value: any) {
  if (value instanceof Node) return value
  const template = document.createElement('template')
  template.innerHTML = String(value)
  return template.content
}

function normalizeClasses(classes: any) {
  return toArr(classes).flatMap((item) => toStr(item).split(/\s+/).filter(Boolean))
}

function wrapEvent(event: Event) {
  ;(event as any).origEvent = event
  return event as any
}

function matchesSelector(el: Element, selector: string) {
  return el.matches(selector)
}

export class Dollar {
  [index: number]: any
  length = 0
  private elements: any[]
  private listeners = new WeakMap<EventHandler, Map<string, EventListener>>()

  constructor(input: ElementInput) {
    this.elements = toElements(input)
    this.length = this.elements.length
    this.elements.forEach((element, index) => {
      this[index] = element
    })
  }

  each(iterator: (this: Element, index: number, element: Element) => void) {
    this.elements.forEach((element, index) => iterator.call(element, index, element))
    return this
  }

  find(selector: string) {
    return $(this.elements.flatMap((element) => Array.from(element.querySelectorAll(selector))))
  }

  on(type: string, selectorOrHandler: string | EventHandler, handler?: EventHandler) {
    const delegated = typeof selectorOrHandler === 'string'
    const selector = delegated ? selectorOrHandler : null
    const listener = (delegated ? handler : selectorOrHandler) as EventHandler
    this.elements.forEach((element) => {
      const wrapped = (event: Event) => {
        const target = event.target as Element | null
        if (selector) {
          const matched = target?.closest(selector)
          if (!matched || !(element === document || (element as Element).contains(matched) || matched === element)) return
          listener.call(matched, wrapEvent(event))
          return
        }
        listener.call(element, wrapEvent(event))
      }
      element.addEventListener(type, wrapped)
      if (!this.listeners.has(listener)) this.listeners.set(listener, new Map())
      this.listeners.get(listener)!.set(`${type}:${this.elements.indexOf(element)}`, wrapped)
    })
    return this
  }

  off(type: string, handler: EventHandler) {
    this.elements.forEach((element) => {
      const wrapped = this.listeners.get(handler)?.get(`${type}:${this.elements.indexOf(element)}`)
      if (wrapped) element.removeEventListener(type, wrapped)
    })
    return this
  }

  addClass(classes: any) {
    const normalized = normalizeClasses(classes)
    return this.each(function () {
      ;(this as HTMLElement).classList.add(...normalized)
    })
  }

  rmClass(classes: any) {
    const normalized = normalizeClasses(classes)
    return this.each(function () {
      ;(this as HTMLElement).classList.remove(...normalized)
    })
  }

  toggleClass(name: string, force?: boolean) {
    return this.each(function () {
      ;(this as HTMLElement).classList.toggle(name, force)
    })
  }

  hasClass(name: string) {
    return this.elements.some((element) => element.classList?.contains(name))
  }

  attr(name: string, value?: any): any {
    if (value === undefined) return this.elements[0]?.getAttribute?.(name) ?? ''
    return this.each(function () {
      ;(this as Element).setAttribute(name, String(value))
    })
  }

  rmAttr(name: string) {
    return this.each(function () {
      ;(this as Element).removeAttribute(name)
    })
  }

  data(name: string, value?: any): any {
    const attrName = name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    if (value === undefined) {
      const current = this.elements[0]?.getAttribute?.(`data-${attrName}`)
      if (current === 'true') return true
      if (current === 'false') return false
      if (current != null && current !== '' && !Number.isNaN(Number(current))) return Number(current)
      return current
    }
    return this.each(function () {
      ;(this as Element).setAttribute(`data-${attrName}`, String(value))
    })
  }

  css(name: string | Record<string, any>, value?: any): any {
    if (typeof name === 'string' && value === undefined) return getComputedStyle(this.elements[0] as Element)[name as any]
    const styles = typeof name === 'string' ? { [name]: value } : name
    return this.each(function () {
      Object.entries(styles).forEach(([key, styleValue]) => {
        ;(this as HTMLElement).style[key as any] = typeof styleValue === 'number' ? `${styleValue}px` : String(styleValue)
      })
    })
  }

  html(value?: any): any {
    if (value === undefined) return this.elements[0]?.innerHTML ?? ''
    return this.each(function () {
      ;(this as HTMLElement).innerHTML = String(value)
    })
  }

  text(value?: any): any {
    if (value === undefined) return this.elements[0]?.textContent ?? ''
    return this.each(function () {
      ;(this as HTMLElement).textContent = String(value)
    })
  }

  val(value?: any): any {
    const element = this.elements[0] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined
    if (value === undefined) return element?.value ?? ''
    return this.each(function () {
      ;(this as HTMLInputElement).value = String(value)
    })
  }

  append(content: any) {
    return this.each(function () {
      ;(this as Element).append(ensureNode(content).cloneNode(true))
    })
  }

  prepend(content: any) {
    return this.each(function () {
      ;(this as Element).prepend(ensureNode(content).cloneNode(true))
    })
  }

  before(content: any) {
    return this.each(function () {
      ;(this as Element).before(ensureNode(content).cloneNode(true))
    })
  }

  remove() {
    return this.each(function () {
      ;(this as Element).remove()
    })
  }

  parent() {
    return $(this.elements.map((element) => element.parentElement).filter(Boolean) as Element[])
  }

  children(selector?: string) {
    const children = this.elements.flatMap((element) => Array.from(element.children))
    return selector ? $(children.filter((element) => matchesSelector(element, selector))) : $(children)
  }

  eq(index: number) {
    const normalized = index < 0 ? this.elements.length + index : index
    return $(this.elements[normalized])
  }

  get(index?: number) {
    return index === undefined ? this.elements : this.elements[index]
  }

  hide() {
    return this.css('display', 'none')
  }

  show() {
    return this.each(function () {
      ;(this as HTMLElement).style.display = ''
    })
  }

  offset() {
    const element = this.elements[0] as HTMLElement
    if (!element) return { top: 0, left: 0 }
    const rect = element.getBoundingClientRect()
    return { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
  }

  click(handler?: EventHandler) {
    if (handler) return this.on('click', handler)
    this.elements[0]?.click?.()
    return this
  }
}

export default function $(input: ElementInput) {
  return new Dollar(input)
}

export namespace $ {
  export type $ = Dollar
}
