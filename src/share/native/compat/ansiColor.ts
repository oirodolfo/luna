const wrap = (code) => (value) => `\u001b[${code}m${value}\u001b[39m`
export default {
  blue: wrap(34),
  green: wrap(32),
  yellow: wrap(33),
  red: wrap(31),
}
