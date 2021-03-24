const localDB = {
  set: (key, val) => {
    return localStorage.setItem(key, JSON.stringify(val))
  },
  get: (key) => {
    return JSON.parse(localStorage.getItem(key))
  },
  remove: (key) => {
    return localStorage.removeItem(key)
  },
  reset: () => {
    return localStorage.clear()
  }
}

export default localDB
