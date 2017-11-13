const start = async () => {
  // Config
  const config = {
    service: 'comments',
    graphqlURI: 'http://localhost:4001/graphql',
    brokerURI: 'tcp://127.0.0.1:55555'
  }

  // GraphQL server
  const { Server } = require('@rabbotio/rainbow')
  const schema = require('./schemas')
  const server = new Server({ schema, port: 4001 })
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
  const query = `{
    getFoo(bar:"ok") 
  }`
  const result = await client.fetch({ query }).catch(console.error)
  console.log('result:', result)
}

start()
