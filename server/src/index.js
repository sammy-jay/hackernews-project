const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    info: String!
  }
`;

const resolvers = {
  Query: {
    info: () => "🚀 it works 😀",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfProtection: true,
  cache: true,
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
