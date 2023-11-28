import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";

export const CREATE_CRAFTSMAN = gql`
  mutation Mutation($craftmanData: CraftmanInput!) {
    createCraftman(craftmanData: $craftmanData) {
      name
    }
  }
`;
