type HotkeyOptions = { target?: EventTarget; capture?: boolean; filter?: (event: KeyboardEvent) => boolean }

const aliases: Record<string, string> = {
  space: ' ',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
  down: 'ArrowDown',
  esc: 'Escape',
}

function normalizeKey(key: string) {
  return aliases[key.toLowerCase()] || key
}

export default {
  on(key: string, options: HotkeyOptions | ((event: KeyboardEvent) => void), handler?: (event: KeyboardEvent) => void) {
    const opts = typeof options === 'function' ? {} : options || {}
    const listener = (typeof options === 'function' ? options : handler)!
    const target = (opts.target || document) as Document
    const normalizedKey = normalizeKey(key)
    const wrapped = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null
      if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) && !opts.filter) return
      if (opts.filter && !opts.filter(event)) return
      if (event.key === normalizedKey || event.code === normalizedKey || event.key.toLowerCase() === normalizedKey.toLowerCase()) {
        listener(event)
      }
    }
    target.addEventListener('keydown', wrapped, { capture: opts.capture })
    return () => target.removeEventListener('keydown', wrapped, { capture: opts.capture } as EventListenerOptions)
  },
}
