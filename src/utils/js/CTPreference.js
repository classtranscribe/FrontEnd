export class CTPreference {
  constructor() {
    this.TRUE = 'true'
    this.FALSE = 'false'
  }

  localStorageSET(key, bool, setfalse=false) {
    if (bool === undefined) return this[key]
    this[key] = Boolean(bool)
    if (Boolean(bool)) {
      localStorage.setItem(key, this.TRUE)
    } else {
      if (setfalse) {
        localStorage.setItem(key, this.FALSE)
      } else {
        localStorage.removeItem(key)
      }
    }
  }

  isTrue(key) {
    return this.localStorageSET(key) === this.TRUE
  }

  isFalse(key) {
    return this.localStorageSET(key) === this.FALSE
  }
}