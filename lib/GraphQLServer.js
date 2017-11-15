const Server = require('./Server')
let logger = console

class GraphQLServer extends Server {
  constructor (baseURL, schema, option = {}) {
    logger = option.logger || logger
    super(baseURL, option)

    const { endpointURL = '/graphql', graphiqlEnabled = process.env.NODE_ENV === 'development' } = option
    const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
    this._app.use(endpointURL, graphqlExpress({ schema }))
    logger.info(`GraphQL  : ${baseURL}${endpointURL}`)

    if (graphiqlEnabled) {
      const graphiqlPath = '/graphiql'
      this._app.get(graphiqlPath, graphiqlExpress({ endpointURL }))
      logger.info(`GraphiQL : ${baseURL}${graphiqlPath}`)
    }
  }
}

module.exports = GraphQLServer
