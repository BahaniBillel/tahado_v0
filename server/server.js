require("dotenv").config();
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { graphqlHTTP } = require("express-graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { ApolloServer } = require("@apollo/server");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

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

// GraphQL server imports
// const typeDefs = require("./graphql/schema.js");
// const resolvers = require("./graphql/resolvers.js");
// const apolloServer = new ApolloServer({ typeDefs, resolvers });

// async function startServer() {
//   const { url } = await startStandaloneServer(apolloServer, {
//     listen: { port: 3001 },
//   });
// }

// startServer();

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`the app is running on port ${port}`);
});
