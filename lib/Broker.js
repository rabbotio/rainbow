const BaseService = require('./BaseService')
class Broker extends BaseService {
  constructor ({ brokerURI: host, conf, logger = console }) {
    super()
    const { Broker } = require('pigato')
    this.instance = new Broker(host, conf)
  }
}

module.exports = Broker
