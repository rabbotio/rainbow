const fetchOnce = async ({ brokerURI, service, query, variables = null, operationName = null, logger = console }) => {
  const { Client } = require('../')
  const client = new Client({ service, brokerURI })
  client.start()

  return client
    .fetch({ query, variables, operationName })
    .then(result => {
      client.stop()
      return result
    })
    .catch(logger.error)
}

module.exports = { fetchOnce }
