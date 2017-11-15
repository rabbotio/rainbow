const BaseService = require('./BaseService')
let logger = console

class Broker extends BaseService {
  constructor (brokerURI, option = {}) {
    logger = option.logger || logger
    super()
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Broker(brokerURI, option)
  }
}

module.exports = Broker
