/* eslint-env jest */

describe('Rainbow', () => {
  it('should able to fetch GraphQL', async () => {
    // Config
    const config = {
      service: 'comments',
      graphqlURI: 'http://localhost:4001/graphql',
      brokerURI: 'tcp://127.0.0.1:55555'
    }

    // GraphQL server
    const { Server } = require('../')
    const schema = require('./schemas')
    const server = new Server({ schema, port: 4001 })
    await server.start()

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
    const query = `{
      getFoo(bar:"ok") 
    }`
    const result = await client.fetch({ query }).catch(console.error)
    console.log('result:', result)
    expect(JSON.parse(result)).toMatchObject({ data: { getFoo: 'Hello ok , Please login' } })
  })
})
