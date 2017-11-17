const Engine = require('./Engine')

class Client extends Engine {
  constructor (brokerURI, options = {}) {
    super()

    // Client
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Client(brokerURI, options)

    // Secure
    const { secret } = options
    this.encrypt = secret && require('simple-encryptor')(secret).encrypt

    console.info(`Client   : ${brokerURI}`)
  }

  fetch (serviceName, props) {
    // Secure
    const encryptedProps = this.encrypt ? this.encrypt(props) : props

    // Send
    return new Promise((resolve, reject) =>
      this._instance.request(
        serviceName,
        encryptedProps, // Pass through props = { query, variables, operationName }
        null, // Partial data from rep.write not handle
        (err, data) => {
          if (err) return reject(err)
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
