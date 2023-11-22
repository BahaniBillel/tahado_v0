import { gql } from "@apollo/client";

export const DELETE_WISHLIST_ITEM = gql`
  mutation DeleteWishlistItem($wishlist_id: Int!, $user_id: Int!) {
    deleteWishlist(
      where: {
        wishlist_id_user_id: { wishlist_id: $wishlist_id, user_id: $user_id }
      }
    ) {
      wishlist_id
    }
  }
`;
