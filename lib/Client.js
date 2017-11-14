const BaseService = require('./BaseService')
class Client extends BaseService {
  constructor ({ brokerURI: host, service, logger = console }) {
    super()

    // Logger
    this.logger = logger

    // Service
    this.service = service

    // Client
    const { Client: PigatoClient } = require('pigato')
    this.instance = new PigatoClient(host)

    // Capture error
    this.instance.on('error', this.logger.error)
  }

  fetch (props) {
    return new Promise((resolve, reject) =>
      this.instance.request(
        this.service,
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
