const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

let links = [];

const resolvers = {
  Query: {
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (parent, { id }) => {
      return links.find((link) => link.id === id);
    },
  },
  Mutation: {
    addLink: async (parent, { url, description }, context) => {
      const newLink = await context.prisma.link.create({
        data: {
          description,
          url,
        },
      });
      return newLink;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
  
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
