function getDocument() {
  return document as Document & {
    webkitFullscreenElement?: Element
    mozFullScreenElement?: Element
    msFullscreenElement?: Element
    webkitExitFullscreen?: () => Promise<void>
    mozCancelFullScreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
  }
}

function getActiveElement() {
  const doc = getDocument()
  return doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement || null
}

async function request(element: Element) {
  const target = element as Element & {
    webkitRequestFullscreen?: () => Promise<void>
    mozRequestFullScreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
  }
  if (target.requestFullscreen) return target.requestFullscreen()
  if (target.webkitRequestFullscreen) return target.webkitRequestFullscreen()
  if (target.mozRequestFullScreen) return target.mozRequestFullScreen()
  if (target.msRequestFullscreen) return target.msRequestFullscreen()
}

async function exit() {
  const doc = getDocument()
  if (doc.exitFullscreen) return doc.exitFullscreen()
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen()
  if (doc.mozCancelFullScreen) return doc.mozCancelFullScreen()
  if (doc.msExitFullscreen) return doc.msExitFullscreen()
}

export default {
  isActive() {
    return !!getActiveElement()
  },
  async toggle(element: Element) {
    if (getActiveElement()) await exit()
    else await request(element)
  },
}
