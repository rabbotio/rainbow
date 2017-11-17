/* eslint-env jest */
describe('Rainbow', () => {
  it('should able to mutate and query', async done => {
    // Config
    const baseURL = 'http://localhost:4001'
    const brokerURI = 'tcp://0.0.0.0:9000'
    const serviceName = 'foo'
    const secret = 'good morning teacher sit down'

    // GraphQL server, you can use your own
    const { GraphQLServer } = require('../')
    const schema = require('./schemas')
    const graphQLServer = new GraphQLServer(baseURL, schema)
    await graphQLServer.start()

    // Broker, you need this only if you're broker provider
    const { Broker } = require('../')
    const broker = new Broker(brokerURI)
    await broker.start()

    // Worker, you need this only if you want to provide some service which is GraphQL in this case
    const graphqlURI = `${baseURL}/graphql`
    const { Worker } = require('../')
    const worker = new Worker(brokerURI, serviceName, { secret })
    worker.initGraphQL(graphqlURI)
    await worker.start()

    // Client, you need this if you want to fetch something from worker
    const { Client } = require('../')
    const client = new Client(brokerURI, { secret })
    await client.start()

    // Mutate from client
    const mutationResult = await client.fetch(serviceName, { query: `mutation { setFoo(bar: "world!") }` })
    expect(JSON.parse(mutationResult)).toMatchObject({ data: { setFoo: 'world!' } })

    // Then query
    const queryResult = await client.fetch(serviceName, { query: `{ getFoo }` })
    expect(JSON.parse(queryResult)).toMatchObject({ data: { getFoo: 'world!' } })

    // Clean exit
    await graphQLServer.stop()
    await worker.stop()
    await client.stop()
    await broker.stop()

    done()
  })
})
