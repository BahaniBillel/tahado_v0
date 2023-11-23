import { gql } from "@apollo/client";
import {GraphQLClient} from "graphql-request"

const client = new GraphQLClient("http://localhost:3001/graphql")





export async function getUsers(){
  const query = gql`
  
  query Users {
  users {
    first_name
  }
}`
const {users}= await client.request(query)
return users
}

export const GET_CATEGORIES = gql`
  query Categories {
    categories {
      category_name
      parent_category_id
      category_id
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      first_name
      last_name
      email
    }
  }
`;

export const GET_WISHLIST = gql`
  query Wishlist {
    wishlist {
      wishlist_id
      user_id
    }
  }
`;

export const GET_OCCASIONS = gql`
  query Occasions {
    occasions {
      name
    }
  }
`;

export const GET_PORODUCT_OCCASION = gql`
  query ProductsOccasions {
    products {
      gift_id
      giftname
      craftman_id
      craftman {
        name
      }
      description
      price
      sku
      url
      occasions {
        occasion {
          id
          name
        }
      }
    }
  }
`;

export const GET_WISHLIST_BY_USERID = gql`
  query WishlistByUser($userId: Int!) {
    wishlistByUser(userId: $userId) {
      user_id
      user {
        first_name
        last_name
      }
      wishlist_id
      wishlistitems {
        product_id
        product {
          giftname
          occasions {
            occasion {
              name
            }
          }
          price
          description
          sku
        }
      }
    }
  }
`;
