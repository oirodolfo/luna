export type AnyFn = (...args: any[]) => any
export type PlainObj<T = any> = Record<string, T>
export type Fn<T = any> = (...args: any[]) => T

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function each<T>(collection: any, iterator: (value: any, key: any) => any) {
  if (!collection) return collection
  if (Array.isArray(collection) || typeof collection.length === 'number') {
    for (let i = 0; i < collection.length; i += 1) {
      if (iterator(collection[i], i) === false) break
    }
    return collection
  }
  for (const key of Object.keys(collection)) {
    if (iterator(collection[key], key) === false) break
  }
  return collection
}

export function map<T, U>(collection: any, iterator: (value: any, key: any) => U): U[] {
  const result: U[] = []
  each(collection, (value, key) => {
    result.push(iterator(value, key))
  })
  return result
}

export function filter<T>(collection: any, iterator: (value: any, key: any) => boolean): T[] {
  const result: T[] = []
  each(collection, (value, key) => {
    if (iterator(value, key)) result.push(value)
  })
  return result
}

export function some(collection: any, iterator: (value: any, key: any) => boolean) {
  let result = false
  each(collection, (value, key) => {
    if (iterator(value, key)) {
      result = true
      return false
    }
    return undefined
  })
  return result
}

export function every(collection: any, iterator: (value: any, key: any) => boolean) {
  let result = true
  each(collection, (value, key) => {
    if (!iterator(value, key)) {
      result = false
      return false
    }
    return undefined
  })
  return result
}

export function find<T>(collection: any, iterator: (value: any, key: any) => boolean): T | undefined {
  let found: T | undefined
  each(collection, (value, key) => {
    if (iterator(value, key)) {
      found = value
      return false
    }
    return undefined
  })
  return found
}

export function contain(target: any, value: any) {
  if (target == null) return false
  if (typeof target === 'string') return target.includes(String(value))
  if (Array.isArray(target)) return target.includes(value)
  return false
}

export const trim = (value = '') => String(value).trim()
export const lowerCase = (value = '') => String(value).toLowerCase()
export const upperCase = (value = '') => String(value).toUpperCase()
export const startWith = (value = '', search = '') => String(value).startsWith(String(search))
export const endWith = (value = '', search = '') => String(value).endsWith(String(search))
export const toStr = (value: any) => value == null ? '' : String(value)
export const toNum = (value: any) => {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : num
}
export const toInt = (value: any) => parseInt(String(value), 10) || 0
export const toBool = (value: any) => {
  if (typeof value === 'string') return !['false', '0', ''].includes(value.toLowerCase())
  return Boolean(value)
}
export const toArr = (value: any) => Array.isArray(value) ? value : value == null ? [] : [value]
export const last = <T>(arr: T[]) => arr[arr.length - 1]
export const fill = <T>(arr: T[], value: T, start?: number, end?: number) => arr.fill(value, start, end)
export const clamp = (value: number, minValue: number, maxValue: number) => Math.min(maxValue, Math.max(minValue, value))
export const min = (arr: number[]) => Math.min(...arr)
export const max = (arr: number[]) => Math.max(...arr)
export const sum = (arr: number[]) => arr.reduce((total, value) => total + value, 0)
export const now = () => Date.now()
export const perfNow = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now())
export const raf = (fn: FrameRequestCallback) => requestAnimationFrame(fn)
export const noop = () => undefined
export const reverse = <T>(arr: T[]) => [...arr].reverse()
export const concat = <T>(...values: T[][]) => ([] as T[]).concat(...values)
export const chunk = <T>(arr: T[], size: number) => {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}
export const keys = (obj: any) => Object.keys(obj || {})
export const allKeys = (obj: any) => {
  const ret: string[] = []
  for (let current = obj; current; current = Object.getPrototypeOf(current)) {
    ret.push(...Object.getOwnPropertyNames(current))
  }
  return [...new Set(ret)]
}
export const has = (obj: any, key: string) => Object.prototype.hasOwnProperty.call(obj, key)
export const getProto = (obj: any) => Object.getPrototypeOf(obj)
export const invert = (obj: PlainObj<any>) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]))
export const difference = <T>(arr: T[], values: T[]) => arr.filter((item) => !values.includes(item))
export const remove = <T>(arr: T[], predicate: (item: T, index: number) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (predicate(arr[i], i)) arr.splice(i, 1)
  }
  return arr
}
export const extend = (target: any, ...sources: any[]) => Object.assign(target, ...sources)
export const defaults = (target: any, ...sources: any[]) => {
  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      if (target[key] === undefined) target[key] = value
    }
  }
  return target
}

export function clone<T>(value: T): T {
  if (Array.isArray(value)) return value.slice() as T
  if (value && typeof value === 'object') return { ...(value as any) }
  return value
}

export function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

export function extendDeep(target: any, ...sources: any[]) {
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue
    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        target[key] = cloneDeep(value)
      } else if (value && typeof value === 'object') {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {}
        extendDeep(target[key], value)
      } else {
        target[key] = value
      }
    }
  }
  return target
}

let uid = 0
export const uniqId = (prefix = '') => `${prefix}${++uid}`
export const randomId = () => Math.random().toString(36).slice(2)
export const uuid = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${randomId()}-${randomId()}`
export const random = (minValue = 0, maxValue = 1) => Math.random() * (maxValue - minValue) + minValue
export const idxOf = <T>(arr: T[], value: T) => arr.indexOf(value)
export const naturalSort = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
export const unique = <T>(arr: T[]) => [...new Set(arr)]
export const pick = (obj: PlainObj<any>, props: string[]) => Object.fromEntries(props.filter((key) => key in obj).map((key) => [key, obj[key]]))
export const omit = (obj: PlainObj<any>, props: string[]) => Object.fromEntries(Object.entries(obj).filter(([key]) => !props.includes(key)))

export const isArr = Array.isArray
export const isStr = (value: any): value is string => typeof value === 'string'
export const isNum = (value: any): value is number => typeof value === 'number' && !Number.isNaN(value)
export const isNumeric = (value: any) => value !== '' && value != null && !Number.isNaN(Number(value))
export const isBool = (value: any): value is boolean => typeof value === 'boolean'
export const isFn = (value: any): value is AnyFn => typeof value === 'function'
export const isObj = (value: any) => value !== null && typeof value === 'object'
export const isRegExp = (value: any): value is RegExp => value instanceof RegExp
export const isNull = (value: any) => value === null
export const isUndef = (value: any) => value === undefined
export const isPrimitive = (value: any) => value === null || (typeof value !== 'object' && typeof value !== 'function')
export const isPromise = (value: any) => !!value && typeof value.then === 'function'
export const isDate = (value: any) => value instanceof Date
export const isEl = (value: any): value is Element => typeof Element !== 'undefined' && value instanceof Element
export const isShadowRoot = (value: any) => typeof ShadowRoot !== 'undefined' && value instanceof ShadowRoot
export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'
export const isMobile = () => isBrowser() && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
export const isErr = (value: any) => value instanceof Error
export const isNaNValue = (value: any) => Number.isNaN(value)
export const isStrBlank = (value: any) => trim(value) === ''
export const isOdd = (value: number) => Math.abs(value % 2) === 1
export const isEmpty = (value: any) => {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
export const type = (value: any) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
export const className = (value: any) => value?.constructor?.name || ''
export const bind = (fn: AnyFn, ctx: any) => fn.bind(ctx)

export function escape(value: any) {
  return toStr(value).replace(/[&<>"']/g, (match) => htmlEscapes[match])
}
export function unescape(value: any) {
  return toStr(value)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}
export function escapeJsStr(value: any) {
  return JSON.stringify(toStr(value)).slice(1, -1)
}
export const stripHtmlTag = (value: string) => toStr(value).replace(/<[^>]+>/g, '')
export const stripNum = (value: any) => toStr(value).replace(/[0-9]/g, '')
export function truncate(value: any, length = 30, omission = '...') {
  const str = toStr(value)
  if (str.length <= length) return str
  return `${str.slice(0, Math.max(0, length - omission.length))}${omission}`
}
export function lowerFirst(value = '') {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value
}
export function upperFirst(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}
export function camelCase(value = '') {
  return toStr(value)
    .replace(/^[_.\-\s]+/, '')
    .toLowerCase()
    .replace(/[_.\-\s]+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase())
}
export function spaceCase(value = '') {
  return toStr(value)
    .replace(/([a-z\d])([A-Z]+)/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .toLowerCase()
}
export function wrap(value: string, left: string, right = left) {
  return `${left}${value}${right}`
}
export const splitPath = (value: string) => {
  const normalized = value.replace(/\\/g, '/')
  const idx = normalized.lastIndexOf('/')
  return idx === -1 ? ['', normalized] : [normalized.slice(0, idx), normalized.slice(idx + 1)]
}
export const normalizePath = (value: string) => value.replace(/\\/g, '/')
export const strHash = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) hash = (hash << 5) - hash + value.charCodeAt(i)
  return hash >>> 0
}

export function stripIndent(value: any) {
  const str = Array.isArray(value) ? value.join('') : toStr(value)
  const lines = str.replace(/^\n+|\n+$/g, '').split('\n')
  const indents = lines.filter((line) => trim(line)).map((line) => (line.match(/^\s*/) || [''])[0].length)
  const indent = indents.length ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(indent)).join('\n')
}

export function debounce<T extends AnyFn>(fn: T, wait = 0) {
  let timer: number | undefined
  const debounced = function (this: any, ...args: any[]) {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => fn.apply(this, args), wait)
  } as T & { cancel: () => void }
  debounced.cancel = () => {
    if (timer) window.clearTimeout(timer)
  }
  return debounced
}

export function throttle<T extends AnyFn>(fn: T, wait = 0) {
  let lastCall = 0
  let timer: number | undefined
  let trailingArgs: any[] | undefined
  const throttled = function (this: any, ...args: any[]) {
    const current = Date.now()
    const remaining = wait - (current - lastCall)
    trailingArgs = args
    if (remaining <= 0) {
      if (timer) {
        window.clearTimeout(timer)
        timer = undefined
      }
      lastCall = current
      fn.apply(this, args)
      trailingArgs = undefined
      return
    }
    if (!timer) {
      timer = window.setTimeout(() => {
        lastCall = Date.now()
        timer = undefined
        if (trailingArgs) fn.apply(this, trailingArgs)
        trailingArgs = undefined
      }, remaining)
    }
  } as T & { cancel: () => void }
  throttled.cancel = () => {
    if (timer) window.clearTimeout(timer)
    timer = undefined
    trailingArgs = undefined
  }
  return throttled
}

export const nextTick = (fn: AnyFn) => queueMicrotask(fn)
export const waitUntil = (predicate: AnyFn, { interval = 16, timeout = 5000 } = {}) =>
  new Promise<void>((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (predicate()) {
        resolve()
        return
      }
      if (Date.now() - started > timeout) {
        reject(new Error('waitUntil timeout'))
        return
      }
      window.setTimeout(tick, interval)
    }
    tick()
  })

export function toEl(value: string | Element) {
  if (isEl(value)) return value
  const template = document.createElement('template')
  template.innerHTML = trim(value as string)
  return template.content.firstElementChild as Element
}

export function h(tagName: string, attrs: PlainObj<any> = {}, children: any[] = []) {
  const el = document.createElement(tagName)
  Object.entries(attrs || {}).forEach(([key, value]) => {
    if (key === 'className') el.className = value
    else if (key === 'text') el.textContent = value
    else if (key === 'html') el.innerHTML = value
    else if (key in el) (el as any)[key] = value
    else el.setAttribute(key, toStr(value))
  })
  toArr(children).forEach((child) => {
    if (child == null) return
    el.appendChild(isEl(child) ? child : document.createTextNode(toStr(child)))
  })
  return el
}

export function copy(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
  return Promise.resolve()
}

export function loadImg(url: string, callback: (err: Error | null, image?: HTMLImageElement) => void) {
  const img = new Image()
  img.onload = () => callback(null, img)
  img.onerror = () => callback(new Error(`Failed to load image: ${url}`))
  img.src = url
}

export function loadJs(url: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
    document.head.appendChild(script)
  })
}

export function openFile(accept = '*/*', multiple = false) {
  return new Promise<FileList | null>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.multiple = multiple
    input.addEventListener('change', () => resolve(input.files), { once: true })
    input.click()
  })
}

export function createUrl(value: Blob | MediaSource) {
  return URL.createObjectURL(value)
}

export function download(url: string, filename?: string) {
  const link = document.createElement('a')
  link.href = url
  if (filename) link.download = filename
  link.click()
}

export function detectBrowser() {
  const ua = navigator.userAgent
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'chrome'
  if (/Firefox/i.test(ua)) return 'firefox'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari'
  if (/Edg/i.test(ua)) return 'edge'
  return 'unknown'
}

export function detectOs() {
  const platform = navigator.platform.toLowerCase()
  const ua = navigator.userAgent.toLowerCase()
  if (platform.includes('mac')) return 'os x'
  if (platform.includes('win')) return 'windows'
  if (platform.includes('linux')) return 'linux'
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'unknown'
}

export function dateFormat(date: Date | number, locale = undefined, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date))
}
export function durationFormat(ms: number, format = 'mm:ss') {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  if (format === 'hh:mm:ss') return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(minutes + hours * 60)}:${pad(seconds)}`
}
export function fileSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = size
  let unit = units[0]
  for (let i = 1; i < units.length && value >= 1024; i += 1) {
    value /= 1024
    unit = units[i]
  }
  return `${value.toFixed(value >= 10 || unit === 'B' ? 0 : 1)} ${unit}`
}

export function pointerEvent(type: 'down' | 'move' | 'up') {
  if (typeof window !== 'undefined' && 'PointerEvent' in window) {
    return `pointer${type}`
  }
  const map = { down: 'mousedown', move: 'mousemove', up: 'mouseup' }
  return map[type]
}

export function isHidden(el: Element) {
  return !(el as HTMLElement).offsetParent && getComputedStyle(el as HTMLElement).position !== 'fixed'
}

export function trigger(el: EventTarget, type: string, detail?: any) {
  el.dispatchEvent(new CustomEvent(type, { bubbles: true, cancelable: true, detail }))
}

export function promisify(fn: AnyFn) {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (err: any, result: any) => (err ? reject(err) : resolve(result)))
    })
}

export class Stack<T = any> {
  private items: T[] = []
  get size() {
    return this.items.length
  }
  push(item: T) {
    this.items.push(item)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  clear() {
    this.items = []
  }
}

export function xpath(path: string, root: Node = document) {
  const result = document.evaluate(path, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
  return result.singleNodeValue
}

export const dpr = () => window.devicePixelRatio || 1
export const keyCode = (name: string) => {
  const codes: Record<string, number> = { enter: 13, esc: 27, space: 32, left: 37, up: 38, right: 39, down: 40, backspace: 8, delete: 46, tab: 9 }
  return codes[name.toLowerCase()] ?? name.toUpperCase().charCodeAt(0)
}

export const highlight = (code: string) => code
export const fuzzySearch = (haystack: string, needle: string) => lowerCase(haystack).includes(lowerCase(needle))
export const stringify = (value: any) => JSON.stringify(value)
export const stringifyAll = (value: any) => JSON.stringify(value, (_key, current) => typeof current === 'bigint' ? current.toString() : current)
export const linkify = (value: string) => value.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
export const isSymbol = (value: any) => typeof value === 'symbol'
