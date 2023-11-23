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

// Controllers
const productRoutes = require("./routes/productRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const wishlistItemsRoutes = require("./routes/wishlistItemsRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const craftmenRoutes = require("./routes/craftmenRoutes.js");
const occasionsRoutes = require("./routes/occasionsRoutes.js");
const categoriesRoutes = require("./routes/categoriesRoutes.js");

// users
app.use("/api/v1/users", userRoutes);

//products == gifts

app.use("/api/v1/products", productRoutes);

//craftmen,

app.use("/api/v1/craftmen", craftmenRoutes);

//occasions,

app.use("/api/v1/occasion", occasionsRoutes);

//categories,

app.use("/api/v1/categories", categoriesRoutes);

//  wishListList

app.use("/api/v1/wishlist", wishlistRoutes);

// wishlist items
app.use("/api/v1/wishlistitems", wishlistItemsRoutes);

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
