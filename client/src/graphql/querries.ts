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
      user_id
      first_name
      last_name
      email
      phone_number
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
          main_image
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
      main_image
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

export const GET_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId($userId: ID!) {
    order(user_id: $userId) {
      order_id
      user_id
      total_amount
      orderitems {
        item_id
        product_id
        quantity
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query AllOrders {
    orders {
      order_id
      orderitems {
        product {
          giftname
          main_image
          price
        }
        quantity
      }
      user_id
      user {
        first_name
        last_name
        email
        phone_number
      }
      order_date
      gifter_message
      recipient
      total_amount
      wished_gift_date
    }
  }
`;

export const GET_SEARCH_PRODUCTS = gql`
  query GetSearchProduct {
    products {
      giftname
      description
      url
      craftman {
        name
      }
      main_image
      occasions {
        occasion {
          name
        }
      }
      price
      productCategory {
        category {
          category_name
        }
      }
      productreviews {
        rating
      }
    }
  }
`;

export const GET_PRICE_LIST = gql`
  query PriceList {
    products {
      gift_id
      giftname
      price
    }
  }
`;

export const GET_PROVIDERS = gql`
  query DeliveryOptionsWithDetails {
    deliveryOptionsWithDetails {
      delivery_option_id
      provider_name
      total_cost
      estimated_time
      city
    }
  }
`;
