/* eslint-env jest */

describe('Rainbow', () => {
  it('should able to fetch GraphQL', async done => {
    // Config
    const baseURL = 'http://localhost:4001'
    const brokerURI = 'tcp://127.0.0.1:55555'
    const config = {
      service: 'foo',
      graphqlURI: `${baseURL}/graphql`,
      brokerURI
    }

    // GraphQL server, you can use your own
    const { GraphQLServer } = require('../')
    const schema = require('./schemas')
    const graphQLServer = new GraphQLServer({ schema, baseURL, graphiqlEnabled: true })
    await graphQLServer.start()

    // Broker, you need this only if you're broker provider
    const { Broker } = require('../')
    const broker = new Broker(config)
    await broker.start()

    // Worker, you need this only if you want to provide some service which is GraphQL in this case
    const { Worker } = require('../')
    const worker = new Worker(config)
    await worker.start()

    // Client, you need this if you want to fetch something from worker
    const { Client } = require('../')
    const client = new Client(config)
    await client.start()

    // Fetch from client
    const result = await client.fetch({ query: `mutation { setFoo(bar: "world!") }` }).catch(console.error)
    expect(JSON.parse(result)).toMatchObject({ data: { setFoo: 'world!' } })

    // Or fetchOnce, it'll auto create Client and fetch
    const { fetchOnce } = require('../')
    const mutationResult = await fetchOnce({
      service: 'foo',
      brokerURI,
      query: `{ getFoo }`
    }).catch(console.error)
    expect(JSON.parse(mutationResult)).toMatchObject({ data: { getFoo: 'world!' } })

    // Close for next test
    await graphQLServer.stop()
    done()
  })
})
