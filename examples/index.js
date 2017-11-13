const start = async () => {
  // Config
  const brokerURI = 'tcp://127.0.0.1:55555'

  const config = {
    service: 'foo',
    graphqlURI: 'http://localhost:4040/graphql',
    brokerURI
  }

  // GraphQL server
  const { Server } = require('@rabbotio/rainbow')
  const schema = require('./schemas')
  const server = new Server({ schema, port: 4040 })
  await server.start()

  // Broker
  const { Broker } = require('@rabbotio/rainbow')
  const broker = new Broker(config)
  broker.start()

  // Worker
  const { Worker } = require('@rabbotio/rainbow')
  const worker = new Worker(config)
  worker.start()

  // Client
  const { Client } = require('@rabbotio/rainbow')
  const client = new Client(config)
  client.start()

  // Fetch
  const query = `mutation { setFoo(bar: "ok") }`
  const result = await client.fetch({ query }).catch(console.error)
  console.log('result:', result)

  // FetchOnce
  const { fetchOnce } = require('@rabbotio/rainbow')
  fetchOnce({
    service: 'foo',
    brokerURI,
    query: `{ getFoo }`
  })
    .then(console.log)
    .catch(console.error)
}

start()
