const Server = require('./Server')

class GraphQLServer extends Server {
  constructor (config) {
    super(config)

    const { schema, baseURL = '', endpointURL = '/graphql', graphiqlEnabled = process.env.NODE_ENV === 'development', logger = console } = config
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
