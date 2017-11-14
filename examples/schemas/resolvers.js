let _bar = 'hello!'
const resolvers = {
  Query: {
    getFoo: (root, _, context) => _bar
  },
  Mutation: {
    setFoo: (_, { bar }, context) => (_bar = bar) && _bar
  }
}

module.exports = resolvers
