const fetchOnce = async ({ brokerURI, service, query }) => {
  const { Client } = require('../')
  const client = new Client({ service, brokerURI })
  client.start()

  return client
    .fetch({ query })
    .then(result => {
      client.stop()
      return result
    })
    .catch(console.error)
}

module.exports = { fetchOnce }
