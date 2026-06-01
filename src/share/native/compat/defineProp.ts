export default function defineProp(obj, key, descriptor) {
  Object.defineProperty(obj, key, descriptor)
  return obj
}
