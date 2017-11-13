class Worker {
  constructor ({ brokerURI: host, service, graphqlURI: uri, logger = console }) {
    // Logger
    this.logger = logger

    // Worker
    const { Worker: PigatoWorker } = require('pigato')
    this.instance = new PigatoWorker(host, service)

    // Capture error
    this.instance.on('error', this.logger.error)

    this.instance.on('request', (inp, rep) => {
      // GraphQL
      const { createApolloFetch } = require('apollo-fetch')
      const apolloFetch = createApolloFetch({ uri })

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

  start () {
    this.instance.start()
    return this.instance
  }

  stop () {
    this.instance.stop()
    return this.instance
  }
}

module.exports = Worker
