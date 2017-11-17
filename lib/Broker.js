const Engine = require('./Engine')

class Broker extends Engine {
  constructor (brokerURI, options = {}) {
    super()
    const PIGATO = require('@rabbotio/pigato')
    this._instance = new PIGATO.Broker(brokerURI, options)

    console.info(`Broker   : ${brokerURI}`)
  }
}

module.exports = Broker
