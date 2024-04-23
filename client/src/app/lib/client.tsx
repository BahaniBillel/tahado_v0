// import { HttpLink } from "@apollo/client";
// import {
//   NextSSRInMemoryCache,
//   NextSSRApolloClient,
// } from "@apollo/experimental-nextjs-app-support/ssr";
// import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

// export const { getClient } = registerApolloClient(() => {
//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),

//     link: new HttpLink({
//       uri: "http://localhost:3001/graphql",
//     }),
//   });
// });

import { ApolloClient, InMemoryCache } from "@apollo/client";

// export const getClient = new ApolloClient({
//   uri: "http://localhost:3001/graphql",
//   cache: new InMemoryCache(),
// });

export function getClient() {
  return new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });
}
