const BaseService = require('./BaseService')

class Broker extends BaseService {
  constructor (brokerURI, options = {}) {
    super()
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Broker(brokerURI, options)
  }
}

module.exports = Broker
