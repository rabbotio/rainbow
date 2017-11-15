const BaseService = require('./BaseService')
let logger = console

class Worker extends BaseService {
  constructor (brokerURI, serviceName, option = {}) {
    logger = option.logger || logger
    super()

    // Worker
    const PIGATO = require('pigato')
    this._instance = new PIGATO.Worker(brokerURI, serviceName, option)

    // Capture error
    this._instance.on('error', logger.error)
  }

  initGraphQL (graphqlURI) {
    if (!this._instance) throw new Error('No instance found')

    this._instance.on('request', (inp, rep) => {
      // GraphQL
      const { createApolloFetch } = require('apollo-fetch')
      const apolloFetch = createApolloFetch({ uri: graphqlURI })

      const { query, variables, operationName } = inp
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
