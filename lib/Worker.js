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

  initGraphQL (graphqlURI, { middlewares, afterwares, batchedMiddlewares, batchedAfterwares, customFetch, constructOptions } = {}) {
    if (!this._instance) throw new Error('No instance found')

    // GraphQL
    const { createApolloFetch } = require('apollo-fetch')
    const apolloFetch = createApolloFetch({ uri: graphqlURI, customFetch })

    this._instance.on('request', (inp, rep, opts) => {
      const _inp = this.decrypt ? this.decrypt(inp) : inp
      const { query, variables, operationName } = _inp

      // Middle wares
      middlewares &&
        middlewares.forEach(ware =>
          apolloFetch.use(({ request, options }, next) => {
            return ware({ request, options }, next, _inp, rep)
          })
        )

      // After ware
      afterwares &&
        afterwares.forEach(ware =>
          apolloFetch.useAfter(({ response, options }, next) => {
            return ware({ response, options }, next, _inp, rep)
          })
        )

      // Batched middle wares
      batchedMiddlewares &&
        batchedMiddlewares.forEach(ware =>
          apolloFetch.batchUse(({ requests, options }, next) => {
            return ware({ requests, options }, next, _inp, rep)
          })
        )

      // Batched after wares
      batchedAfterwares &&
        batchedAfterwares.forEach(ware =>
          apolloFetch.batchUseAfter(({ response, options }, next) => {
            return ware({ response, options }, next, _inp, rep)
          })
        )

      // Fetch
      apolloFetch({ query, variables, operationName })
        .then(result => {
          // const { data, errors, extensions } = result
          return rep.end(JSON.stringify(result))
        })
        .catch(err => {
          return rep.end(JSON.stringify(err))
        })
    })
  }
}

module.exports = Worker
