import Emitter from './Emitter'

class ThemeController extends Emitter {
  private mediaQuery =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null

  constructor() {
    super()
    this.mediaQuery?.addEventListener('change', this.handleChange)
  }

  get() {
    return this.mediaQuery?.matches ? 'dark' : 'light'
  }

  private handleChange = () => {
    this.emit('change', this.get())
  }
}

export default new ThemeController()
