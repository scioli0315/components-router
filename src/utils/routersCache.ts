const cache: Record<number, boolean> = {}
const routersCache = (): { clear: () => void; getValue: (uid: number) => boolean } => {
  return {
    clear: () => {
      for (const k in cache) {
        delete cache[k]
      }
    },
    getValue: (uid: number) => {
      let v = false
      if (cache[uid]) {
        v = true
      } else {
        cache[uid] = true
      }
      return v
    }
  }
}

export default routersCache
