"use client";

import React from "react";
import { useMutation, useQuery } from "@apollo/client";

import { GET_WISHLIST } from "../graphql/querries";

function WishlistLength({ userId }) {
  const { data, loading, error } = useQuery(GET_WISHLIST, {
    pollInterval: 100,
  });

  if (loading)
    return (
      <p className="text-white flex items-center justify-center">
        Loading ....
      </p>
    );
  if (error)
    return (
      <p className="text-white flex items-center justify-center">
        Oops! Something went wrong ....
      </p>
    );
  // Filter the wishlist based on user_id
  const userWishlist = data.wishlist.filter((item) => item.user_id === userId);

  return <div>{userWishlist.length}</div>;
}

export default WishlistLength;
