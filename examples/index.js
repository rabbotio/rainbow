const start = async () => {
  // Config
  const brokerURI = 'tcp://127.0.0.1:55555'
  const baseURL = 'http://localhost:4040'

  const config = {
    service: 'foo',
    graphqlURI: `${baseURL}/graphql`,
    brokerURI
  }

  // GraphQL server
  const { GraphQLServer } = require('../')
  const schema = require('./schemas')
  const graphQLServer = new GraphQLServer({ schema, baseURL, graphiqlEnabled: true })
  await graphQLServer.start()

  // Broker
  const { Broker } = require('../')
  const broker = new Broker(config)
  broker.start()

  // Worker
  const { Worker } = require('../')
  const worker = new Worker(config)
  worker.start()

  // Client
  const { Client } = require('../')
  const client = new Client(config)
  client.start()

  // Fetch
  const query = `mutation { setFoo(bar: "ok") }`
  const result = await client.fetch({ query }).catch(console.error)
  console.log('result:', result)

  // Or FetchOnce
  const { fetchOnce } = require('../')
  fetchOnce({
    service: 'foo',
    brokerURI,
    query: `{ getFoo }`
  })
    .then(console.log)
    .catch(console.error)
}

start()
