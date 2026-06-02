export type AnyFn = (...args: any[]) => any
export type PlainObj<T = any> = Record<string, T>
export type Fn<T = any> = (...args: any[]) => T

const types = {
  AnyFn: Function,
  PlainObj: Object,
  Fn: Function,
}

export default types
