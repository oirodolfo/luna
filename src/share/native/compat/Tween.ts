import { clamp } from './shared'

type TweenOptions = {
  from: Record<string, number>
  to: Record<string, number>
  duration?: number
  ease?: (value: number) => number
  onUpdate?: (value: Record<string, number>) => void
  onComplete?: () => void
}

export default class Tween {
  private frame = 0
  private startTime = 0

  constructor(private options: TweenOptions) {}

  play() {
    this.startTime = performance.now()
    const tick = (time: number) => {
      const duration = this.options.duration ?? 300
      const progress = clamp((time - this.startTime) / duration, 0, 1)
      const eased = this.options.ease ? this.options.ease(progress) : progress
      const nextValue = Object.fromEntries(
        Object.keys(this.options.from).map((key) => [
          key,
          this.options.from[key] + (this.options.to[key] - this.options.from[key]) * eased,
        ])
      )
      this.options.onUpdate?.(nextValue)
      if (progress < 1) {
        this.frame = requestAnimationFrame(tick)
      } else {
        this.options.onComplete?.()
      }
    }
    this.frame = requestAnimationFrame(tick)
  }

  stop() {
    cancelAnimationFrame(this.frame)
  }
}
