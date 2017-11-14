const BaseService = require('./BaseService')
class Broker extends BaseService {
  constructor ({ brokerURI: host, conf, logger = console }) {
    super()
    const PIGATO = require('pigato')
    this.instance = new PIGATO.Broker(host, conf)
  }
}

module.exports = Broker
