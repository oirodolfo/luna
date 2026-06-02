const hex = {
  encode(values) {
    return values.map((value) => Number(value).toString(16).padStart(2, '0')).join('')
  },
  decode(value) {
    const normalized = String(value).replace(/^#/, '')
    const matches = normalized.match(/.{1,2}/g) || []
    return [matches.map((part) => parseInt(part, 16))]
  },
}
export default hex
