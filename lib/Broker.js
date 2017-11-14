const BaseService = require('./BaseService')
class Broker extends BaseService {
  constructor (brokerURI, option) {
    super()
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Broker(brokerURI, option)
  }
}

module.exports = Broker
