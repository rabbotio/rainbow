const Engine = require('./Engine')

class Worker extends Engine {
  constructor (brokerURI, serviceName, options = {}) {
    super()

    // Worker
    const PIGATO = require('@rabbotio/pigato')
    this._instance = new PIGATO.Worker(brokerURI, serviceName, options)

    // Secure
    const { secret } = options
    this.decrypt = secret && require('simple-encryptor')(secret).decrypt

    console.info(`Worker   : ${serviceName}`)
  }

  initGraphQL (graphqlURI) {
    if (!this._instance) throw new Error('No instance found')

    // GraphQL
    const { createApolloFetch } = require('apollo-fetch')
    const apolloFetch = createApolloFetch({ uri: graphqlURI })

    this._instance.on('request', (inp, rep, opts) => {
      const { query, variables, operationName, token } = this.decrypt ? this.decrypt(inp) : inp

      // Header
      apolloFetch.use(({ request, options }, next) => {
        options = Object.assign(options, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        next()
      })

      // Fetch
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
