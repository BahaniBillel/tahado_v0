require("dotenv").config();
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { ApolloServer } = require("apollo-server-express");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schema");

const port = process.env.PORT || 3002;

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use((req, res) => {
    res.status(200);
    res.send("Hello!");
    res.end();
  });

  await new Promise((resolve) => app.listen(port, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  return { server, app };
}

startApolloServer();
