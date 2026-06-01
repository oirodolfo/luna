export default function range(start, end, step = 1) {
  let from = start
  let to = end
  if (to == null) {
    from = 0
    to = start
  }
  const result = []
  for (let value = from; value < to; value += step) result.push(value)
  return result
}
