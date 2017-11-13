let _bazs = {}
const resolvers = {
  Query: {
    getFoo: (root, _, context) => JSON.stringify(_bazs)
  },
  Mutation: {
    setFoo: (_, { bar }, context) => (_bazs[bar] = new Date().toISOString())
  }
}

module.exports = resolvers
