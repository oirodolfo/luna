import toStr from '../share/native/compat/toStr'
import trim from '../share/native/compat/trim'
import escape from '../share/native/compat/escape'

export const encode = (val: any) => {
  return escape(toStr(val))
    .replace(/\n/g, '↵')
    .replace(/\f|\r|\t/g, '')
}

export function getFnAbstract(str: string) {
  if (str.length > 500) str = str.slice(0, 500) + '...'

  return 'ƒ ' + trim(extractFnHead(str).replace('function', ''))
}

const regFnHead = /function(.*?)\((.*?)\)/

function extractFnHead(str: string) {
  const fnHead = str.match(regFnHead)

  if (fnHead) return fnHead[0]

  return str
}
