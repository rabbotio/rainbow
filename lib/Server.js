class Server {
  constructor ({ schema, port = 3000 }) {
    this.port = port

    const express = require('express')
    const bodyParser = require('body-parser')
    const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

    this.app = express()

    this.app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
    this.app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
  }

  start () {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port, err => {
        if (err) return reject(err)
        resolve(this.app)
      })
    })
  }
}

module.exports = Server
