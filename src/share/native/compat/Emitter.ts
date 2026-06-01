export default class Emitter {
  private listeners = new Map<string, Set<(...args: any[]) => void>>()

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(listener)
    return this
  }

  off(event: string, listener?: (...args: any[]) => void) {
    if (!listener) {
      this.listeners.delete(event)
      return this
    }
    this.listeners.get(event)?.delete(listener)
    return this
  }

  once(event: string, listener: (...args: any[]) => void) {
    const wrapped = (...args: any[]) => {
      this.off(event, wrapped)
      listener(...args)
    }
    return this.on(event, wrapped)
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((listener) => listener(...args))
    return this
  }

  removeAllListeners(event?: string) {
    if (event) this.listeners.delete(event)
    else this.listeners.clear()
    return this
  }
}
