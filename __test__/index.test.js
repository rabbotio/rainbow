/* eslint-env jest */
let logger = console

describe('Rainbow', () => {
  it('should able to mutate and query', async done => {
    // Config
    const baseURL = 'http://localhost:4001'
    const brokerURI = 'tcp://127.0.0.1:55555'
    const serviceName = 'foo'

    // GraphQL server, you can use your own
    const { GraphQLServer } = require('../')
    const schema = require('./schemas')
    const graphQLServer = new GraphQLServer(baseURL, schema, { graphiqlEnabled: true })
    await graphQLServer.start()

    // Broker, you need this only if you're broker provider
    const { Broker } = require('../')
    const broker = new Broker(brokerURI)
    await broker.start()

    // Worker, you need this only if you want to provide some service which is GraphQL in this case
    const graphqlURI = `${baseURL}/graphql`
    const { Worker } = require('../')
    const worker = new Worker(brokerURI, serviceName)
    worker.initGraphQL(graphqlURI)
    await worker.start()

    // Client, you need this if you want to fetch something from worker
    const { Client } = require('../')
    const client = new Client(brokerURI, serviceName)
    await client.start()

    // Mutate from client
    const mutationResult = await client.fetch({ query: `mutation { setFoo(bar: "world!") }` }).catch(logger.error)
    expect(JSON.parse(mutationResult)).toMatchObject({ data: { setFoo: 'world!' } })

    // Then query
    const queryResult = await client.fetch({ query: `{ getFoo }` }).catch(logger.error)
    expect(JSON.parse(queryResult)).toMatchObject({ data: { getFoo: 'world!' } })

    // Close for next test
    await graphQLServer.stop()
    done()
  })
})
