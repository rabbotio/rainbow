const BaseService = require('./BaseService')
let logger = console

class Client extends BaseService {
  constructor (brokerURI, serviceName, option = {}) {
    logger = option.logger || logger
    super()

    // Service
    this.serviceName = serviceName

    // Client
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Client(brokerURI, option)

    // Capture error
    this._instance.on('error', logger.error)
  }

  fetch (props) {
    return new Promise((resolve, reject) =>
      this._instance.request(
        this.serviceName,
        props, // Pass through props = { query, variables, operationName }
        null, // Partial data from rep.write not handle
        (err, data) => {
          if (err) reject(err)
          resolve(data)
        },
        {
          timeout: props.timeout || 5000
        }
      )
    )
  }
}

module.exports = Client
