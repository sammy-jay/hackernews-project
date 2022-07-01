const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

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
    updateLink: (parent, { id, url, description }, context) => {
        const link = await context.prisma.link.update({
            where: { id},
            data: { published: true },
        })
        return link
    },
    // deleteLink: async (parent, { id }, context ) => {
    // //   await context.link.
    //   return null;
    // },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: { prisma },
  csrfProtection: true,
  cache: true,
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
