"use client";
import React, { useEffect, useState } from "react";
import { GET_WISHLIST_BY_USERID } from "../../graphql/querries";

import WishProduct from "../../components/wishProduct";

import { redirect } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { getSession, useSession } from "next-auth/react";

export default function Wishlist() {
  const { data: sessionData, status } = useSession();
  const [wishlist, setWishlist] = useState([]);

  const userId = parseInt(sessionData?.user?.user_id);

  if (!userId) {
    redirect("api/auth/signin?callbackUrl=/sever");
  }

  const {
    data: getwishlistbyuserid,
    loading: wishlistLoading,
    error: wishlistError,
    refetch,
  } = useQuery(GET_WISHLIST_BY_USERID, {
    fetchPolicy: "network-only",
    variables: { userId },
    pollInterval: 500,
    skip: !userId, // Skip query if userId is not available
  });

  useEffect(() => {
    if (getwishlistbyuserid) {
      setWishlist(getwishlistbyuserid.wishlistByUser);
    }
  }, [getwishlistbyuserid]); // Dependency array ensures useEffect runs when getwishlistbyuserid changes

  if (!userId) {
    // Redirect logic here, it might need to be handled differently in Next.js
  }

  if (wishlistError) {
    console.error("Error fetching wishlist:", wishlistError);
    // Handle error here
  }

  if (wishlistLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {wishlist.map((wishlistItem) => (
        <div key={wishlistItem.wishlist_id}>
          <p>Wishlist ID: {wishlistItem.wishlist_id}</p>
          <p>
            User: {wishlistItem.user.first_name} {wishlistItem.user.last_name}
          </p>
          {wishlistItem.wishlistitems.map((wishlistItemDetail) => (
            <WishProduct
              key={wishlistItemDetail.product_id}
              product={wishlistItemDetail}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
