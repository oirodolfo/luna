export default class ResizeSensor {
  private observer: ResizeObserver
  private listeners = new Set<() => void>()

  constructor(private element: Element, listener?: () => void) {
    if (listener) this.listeners.add(listener)
    this.observer = new ResizeObserver(() => {
      this.listeners.forEach((callback) => callback())
    })
    this.observer.observe(element)
  }

  addListener(listener: () => void) {
    this.listeners.add(listener)
  }

  removeListener(listener: () => void) {
    this.listeners.delete(listener)
  }

  detach() {
    this.observer.unobserve(this.element)
    this.observer.disconnect()
    this.listeners.clear()
  }
}
