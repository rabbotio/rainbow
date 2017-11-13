# rainbow
[Pigato](https://github.com/prdn/pigato) GraphQL wrapper for lazy dude

## Use
```js
// Config
const config = {
  service: 'comments',
  graphqlURI: 'http://localhost:4001/graphql',
  brokerURI: 'tcp://127.0.0.1:55555'
}

// GraphQL server
const Server = require('../lib/server.js')
const schema = require('./schemas')
const server = new Server({ schema, port: 4001 })
await server.start()

// Broker
const Broker = require('../lib/broker')
const broker = new Broker(config)
broker.start()

// Worker
const Worker = require('../lib/worker')
const worker = new Worker(config)
worker.start()

// Client
const Client = require('../lib/client')
const client = new Client(config)
client.start()

// Fetch
const query = `{
  getFoo(bar:"ok") 
}`
const result = await client.fetch({ query }).catch(console.error)
expect(JSON.parse(result)).toMatchObject({ data: { getFoo: 'Hello ok , Please login' } })
```

## Test
```
npm test
```