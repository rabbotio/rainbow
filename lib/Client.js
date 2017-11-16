const BaseService = require('./BaseService')

class Client extends BaseService {
  constructor (brokerURI, serviceName, options = {}) {
    super()

    // Service
    this.serviceName = serviceName

    // Client
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Client(brokerURI, options)

    // Capture error
    this._instance.on('error', console.error)

    // Secure
    const { secret } = options
    this.encrypt = secret && require('simple-encryptor')(secret).encrypt

    console.info(`Client   : ${serviceName}`)
  }

  fetch (props) {
    // Secure
    const encryptedProps = this.encrypt ? this.encrypt(props) : props

    // Send
    return new Promise((resolve, reject) =>
      this._instance.request(
        this.serviceName,
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
