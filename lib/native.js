const path = require('path')
const { promises: fs } = require('fs')

function each(collection, iterator) {
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

function map(collection, iterator) {
  const result = []
  each(collection, (value, key) => result.push(iterator(value, key)))
  return result
}

function filter(collection, iterator) {
  const result = []
  each(collection, (value, key) => {
    if (iterator(value, key)) result.push(value)
  })
  return result
}

function some(collection, iterator) {
  for (const value of collection || []) {
    if (iterator(value)) return true
  }
  return false
}

const extend = (target, ...sources) => Object.assign(target, ...sources)
function defaults(target, ...sources) {
  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      if (target[key] === undefined) target[key] = value
    }
  }
  return target
}
const isEmpty = (value) => {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
const endWith = (value, search) => String(value).endsWith(String(search))
const startWith = (value, search) => String(value).startsWith(String(search))
const trim = (value = '') => String(value).trim()
function camelCase(value = '') {
  return String(value)
    .replace(/^[_.\-\s]+/, '')
    .toLowerCase()
    .replace(/[_.\-\s]+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase())
}
function upperFirst(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}
const reverse = (arr) => [...arr].reverse()
const cloneDeep = (value) => JSON.parse(JSON.stringify(value))
function extendDeep(target, ...sources) {
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue
    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) target[key] = cloneDeep(value)
      else if (value && typeof value === 'object') {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {}
        extendDeep(target[key], value)
      } else target[key] = value
    }
  }
  return target
}
function topoSort(edges) {
  const nodes = new Set()
  const incoming = new Map()
  const outgoing = new Map()
  for (const [from, to] of edges) {
    nodes.add(from)
    nodes.add(to)
    if (!outgoing.has(from)) outgoing.set(from, new Set())
    if (!incoming.has(to)) incoming.set(to, new Set())
    outgoing.get(from).add(to)
    incoming.get(to).add(from)
  }
  const queue = [...nodes].filter((node) => !incoming.has(node) || incoming.get(node).size === 0)
  const result = []
  while (queue.length) {
    const node = queue.shift()
    result.push(node)
    for (const next of outgoing.get(node) || []) {
      incoming.get(next).delete(node)
      if (incoming.get(next).size === 0) queue.push(next)
    }
  }
  return result
}
const stringify = (value) => JSON.stringify(value, null, 2)
const promisify = (fn) => (...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)))
const rmdir = async (target) => fs.rm(target, { recursive: true, force: true })
const mime = (ext) => ({ png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', svg:'image/svg+xml', gif:'image/gif', webp:'image/webp', mp3:'audio/mpeg', wav:'audio/wav', ogg:'audio/ogg', json:'application/json', txt:'text/plain', html:'text/html', css:'text/css', js:'text/javascript' }[String(ext).toLowerCase()] || 'application/octet-stream')
const dataUrl = { stringify(data, mimeType) { return `data:${mimeType};base64,${data}` } }
const convertBin = (value, to) => to === 'base64' ? Buffer.from(value).toString('base64') : value
const normalizePath = (value) => value.replace(/\\/g, '/')

module.exports = {
  fs,
  path,
  each,
  map,
  filter,
  some,
  extend,
  defaults,
  isEmpty,
  endWith,
  startWith,
  trim,
  camelCase,
  upperFirst,
  reverse,
  cloneDeep,
  extendDeep,
  topoSort,
  stringify,
  promisify,
  rmdir,
  mime,
  dataUrl,
  convertBin,
  normalizePath,
}
