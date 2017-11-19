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

    // With fetch option
    const queryWithTokenResult = await client.fetch(serviceName, { query: `{ getFoo }` })
    expect(JSON.parse(queryWithTokenResult)).toMatchObject({ data: { getFoo: 'world!' } })

    // Clean exit
    await graphQLServer.stop()
    await worker.stop()
    await client.stop()
    await broker.stop()

    done()
  })

  it('should able to mutate and query with token', async done => {
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
    const middlewares = [
      ({ request, options }, next, inp, rep) => {
        const { fetchOption } = inp

        const _403 = rep => {
          rep.end(JSON.stringify({ error: '403' }))
        }

        // No credentials provide
        if (!fetchOption || !fetchOption.headers || !fetchOption.headers.Authorization) return _403(rep)
        if (!fetchOption.headers.Authorization.includes('Bearer ')) return _403(rep)
        const token = fetchOption.headers.Authorization.split('Bearer ').join('')

        if (!token) return _403(rep)

        const validTokens = ['SOME_VALID_TOKEN', 'SOME_OTHER_VALID_TOKEN']
        if (!validTokens.includes(token)) return _403(rep)

        // Valid
        next()
      }
    ]
    worker.initGraphQL(graphqlURI, { middlewares })
    await worker.start()

    // Client, you need this if you want to fetch something from worker
    const { Client } = require('../')
    const client = new Client(brokerURI, { secret })
    await client.start()

    const token = 'SOME_VALID_TOKEN'
    const fetchOption = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    // Mutate from client
    const mutationWithTokenResult = await client.fetch(serviceName, {
      query: `mutation { setFoo(bar: "world!") }`,
      fetchOption
    })
    expect(JSON.parse(mutationWithTokenResult)).toMatchObject({ data: { setFoo: 'world!' } })

    // Then query
    const queryWithTokenResult = await client.fetch(serviceName, {
      query: `{ getFoo }`,
      fetchOption
    })
    expect(JSON.parse(queryWithTokenResult)).toMatchObject({ data: { getFoo: 'world!' } })

    // Clean exit
    await graphQLServer.stop()
    await worker.stop()
    await client.stop()
    await broker.stop()

    done()
  })
})
