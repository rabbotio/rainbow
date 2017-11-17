class Engine {
  constructor () {
    this._instance = null
  }

  get instance () {
    return this._instance
  }

  start () {
    if (!this._instance) return

    return new Promise((resolve, reject) => {
      this._instance.on('start', () => resolve(this))
      this._instance.on('error', err => reject(new Error(err)))
      this._instance.start()
    })
  }

  stop () {
    if (!this._instance) return

    return new Promise((resolve, reject) => {
      this._instance.on('stop', () => resolve(this))
      this._instance.on('error', err => reject(new Error(err)))
      this._instance.stop()
    })
  }
}

module.exports = Engine
