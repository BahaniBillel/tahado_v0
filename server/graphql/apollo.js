require("dotenv").config();
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { graphqlHTTP } = require("express-graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { ApolloServer } = require("@apollo/server");

// GraphQL server imports
const typeDefs = require("./schema.js");
const resolvers = require("./resolvers.js");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const apolloServer = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: 4000 },
  });
}

startServer();
