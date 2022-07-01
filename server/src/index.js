const { ApolloServer, gql } = require("apollo-server");
7;
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const resolvers = {
  Query: {
    info: () => "🚀 it works 😀",
    feed: () => links,
    link: (parent, { id }) => {
      return links.find((link) => link.id === id);
    },
  },
  Mutation: {
    addLink: (parent, { url, description }) => {
      let idCount = links.length;
      const newLink = {
        id: `link-${idCount++}`,
        description,
        url,
      };
      links.push(newLink);
      return newLink;
    },
    updateLink: (parent, { id, url, description }) => {
      return links.find((link) => {
        if (link.id === id) {
          link.description = description;
          link.url = url;
        }
      });
    },
    deleteLink: (parent, { id }) => {
      links.filter((link) => link.id !== id);
      return null;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  csrfProtection: true,
  cache: true,
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
