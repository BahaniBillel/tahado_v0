require("dotenv").config();
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { ApolloServer } = require("apollo-server-express");
const apolloMiddleware = require("@apollo/server/express4").expressMiddleware;

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schema");

const port = process.env.PORT || 3002;

async function startApolloServer() {
  const app = express();
  const apolloserver = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // If there's no authorization header, return context without user
      if (!req.headers.authorization) {
        return {};
      }

      const token = req.headers.authorization.split(" ")[1]; // Assuming a 'Bearer <token>' format
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { user: decoded };
      } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
      }
    },
  });

  await apolloserver.start();

  apolloserver.applyMiddleware({ app });

  app.use((req, res) => {
    res.status(200);
    res.send("Hello!");
    res.end();
  });

  // function getContext({ req }) {
  //   console.log(req.auth);
  // }
  // app.use("/graphql", apolloMiddleware(apolloserver, { context: getContext }));

  await new Promise((resolve) => app.listen(port, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloserver.graphqlPath}`
  );
  return { apolloserver, app };
}

startApolloServer();
