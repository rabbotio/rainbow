class Broker {
  constructor ({ brokerURI: host, conf, logger = console }) {
    var { Broker } = require('pigato')
    this.instance = new Broker(host, conf)
  }

  start () {
    this.instance.start()
    return this.instance
  }

  stop () {
    this.instance.stop()
    return this.instance
  }
}

module.exports = Broker
