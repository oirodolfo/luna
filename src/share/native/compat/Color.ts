type ColorValue = string | { val: number[] }

function clampChannel(value: number, max = 255) {
  return Math.max(0, Math.min(max, value))
}

function hslaToRgba(h: number, s: number, l: number, a = 1) {
  const hue = (((h % 360) + 360) % 360) / 360
  const saturation = clampChannel(s, 100) / 100
  const lightness = clampChannel(l, 100) / 100
  if (saturation === 0) {
    const gray = Math.round(lightness * 255)
    return [gray, gray, gray, a]
  }
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q
  const hueToRgb = (t: number) => {
    let current = t
    if (current < 0) current += 1
    if (current > 1) current -= 1
    if (current < 1 / 6) return p + (q - p) * 6 * current
    if (current < 1 / 2) return q
    if (current < 2 / 3) return p + (q - p) * (2 / 3 - current) * 6
    return p
  }
  return [
    Math.round(hueToRgb(hue + 1 / 3) * 255),
    Math.round(hueToRgb(hue) * 255),
    Math.round(hueToRgb(hue - 1 / 3) * 255),
    a,
  ]
}

function rgbaToHsla(r: number, g: number, b: number, a = 1) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0)
        break
      case green:
        h = (blue - red) / d + 2
        break
      default:
        h = (red - green) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), a]
}

function parseColor(value: ColorValue) {
  if (typeof value !== 'string') {
    const [r, g, b, a = 1] = value.val
    return [r, g, b, a > 1 ? a / 255 : a]
  }
  const input = value.trim()
  if (input.startsWith('#')) {
    const hex = input.slice(1)
    const normalized = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex
    const channels = normalized.match(/.{1,2}/g)?.map((part) => parseInt(part, 16)) || [0, 0, 0]
    const [r, g, b, a = 255] = channels
    return [r, g, b, a / 255]
  }
  const rgbMatch = input.match(/rgba?\(([^)]+)\)/i)
  if (rgbMatch) {
    const values = rgbMatch[1].split(',').map((part) => Number(part.trim()))
    const [r = 0, g = 0, b = 0, a = 1] = values
    return [r, g, b, a]
  }
  const hslMatch = input.match(/hsla?\(([^)]+)\)/i)
  if (hslMatch) {
    const values = hslMatch[1].split(',').map((part) => Number(part.trim().replace('%', '')))
    const [h = 0, s = 0, l = 0, a = 1] = values
    return hslaToRgba(h, s, l, a)
  }
  const probe = document.createElement('div')
  probe.style.color = input
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  return parseColor(computed)
}

export default class Color {
  private rgba: number[]

  constructor(value: ColorValue) {
    this.rgba = parseColor(value)
  }

  static parse(value: ColorValue) {
    const [r, g, b, a = 1] = parseColor(value)
    return { val: [r, g, b, Math.round(a * 255)] }
  }

  toRgb() {
    const [r, g, b, a = 1] = this.rgba
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
  }

  toHsl() {
    const [r, g, b, a = 1] = this.rgba
    const [h, s, l] = rgbaToHsla(r, g, b, a)
    return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`
  }
}
