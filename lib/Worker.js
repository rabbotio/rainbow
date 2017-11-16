const BaseService = require('./BaseService')

class Worker extends BaseService {
  constructor (brokerURI, serviceName, options = {}) {
    super()

    // Worker
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Worker(brokerURI, serviceName, options)

    // Capture error
    this._instance.on('error', console.error)

    // Secure
    const { secret } = options
    this.decrypt = secret && require('simple-encryptor')(secret).decrypt

    console.info(`Worker   : ${serviceName}`)
  }

  initGraphQL (graphqlURI) {
    if (!this._instance) throw new Error('No instance found')

    this._instance.on('request', (inp, rep) => {
      // GraphQL
      const { createApolloFetch } = require('apollo-fetch')
      const apolloFetch = createApolloFetch({ uri: graphqlURI })

      const { query, variables, operationName } = this.decrypt ? this.decrypt(inp) : inp
      apolloFetch({ query, variables, operationName })
        .then(result => {
          // const { data, errors, extensions } = result
          rep.end(JSON.stringify(result))
        })
        .catch(err => {
          rep.end(JSON.stringify(err))
        })
    })
  }
}

module.exports = Worker
