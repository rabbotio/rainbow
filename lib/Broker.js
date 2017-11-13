class Broker {
  constructor ({ brokerURI: host, logger = console }) {
    var { Broker } = require('pigato')
    this.instance = new Broker(host)
  }

  start () {
    this.instance.start()
  }
}

module.exports = Broker
