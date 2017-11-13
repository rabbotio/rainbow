module.exports = `
type Query {
  getFoo: String
}

type Mutation {
  setFoo(bar: String!): String
}

schema {
  query: Query
  mutation: Mutation
}
`
