import { gql } from "@apollo/client";

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
      wishlistitems {
        product_id
      }
    }
  }
`;

export const GET_OCCASIONS = gql`
  query Occasions {
    occasions {
      id
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

export const GET_PRODUCTS = gql`
  query Get_Products {
    products {
      gift_id
      craftman_id
      giftname
      description
      price
      url
      sku

      occasions {
        occasion {
          name
        }
      }
      craftman {
        name
      }
      productCategory {
        category {
          category_name
        }
      }
    }
  }
`;
