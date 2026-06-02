const args = () => globalThis.__LUNA_STORY_ARGS__ || {}
const normalize = (name) =>
  String(name)
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase())

const readArg = (name, fallback) => {
  const key = normalize(name)
  const value = args()[key]
  return value === undefined ? fallback : value
}

export const withKnobs = (story) => story()
export const text = (name, value) => readArg(name, value)
export const number = (name, value) => Number(readArg(name, value))
export const boolean = (name, value) => Boolean(readArg(name, value))
export const select = (_name, options, value) => readArg(_name, value ?? Object.values(options)[0])
export const optionsKnob = (name, options, value) => readArg(name, value ?? Object.values(options)[0])
export const color = (name, value) => readArg(name, value)
