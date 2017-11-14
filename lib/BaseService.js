class BaseService {
  constructor () {
    this.instance = null
  }

  start () {
    if (!this.instance) return

    return new Promise((resolve, reject) => {
      this.instance.on('start', resolve)
      this.instance.on('error', err => reject(new Error(err)))
      this.instance.start()
    })
  }

  stop () {
    if (!this.instance) return

    return new Promise((resolve, reject) => {
      this.instance.on('stop', resolve)
      this.instance.on('error', err => reject(new Error(err)))
      this.instance.stop()
    })
  }
}

module.exports = BaseService
