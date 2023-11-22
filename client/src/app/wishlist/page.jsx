import React from "react";
import { GET_WISHLIST_BY_USERID } from "../../graphql/querries";
import { getClient } from "../lib/client";
import CheckoutProduct from "../../components/checkout/checkoutProduct";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Wishlist() {
  // Filter the wishlist by user_id
  const session = await getServerSession(options);

  if (!session) {
    redirect("api/auth/signin?callbackUrl=/sever");
  }

  console.log("session:", session);

  const userId = parseInt(session?.user?.user_id);
  const client = getClient();
  // Use the client instance to query data for occasions
  const { data: getwishlistbyuserid } = await client.query({
    query: GET_WISHLIST_BY_USERID,
    variables: { userId },
  });

  // Log the wishlist data in the console
  // console.log("Wishlist data:", getwishlistbyuserid.wishlistByUser);

  //  Bring the wishlist product by user_id
  return (
    <div>
      {getwishlistbyuserid.wishlistByUser.map((wishlistItem) => (
        <div key={wishlistItem.wishlist_id}>
          <p>Wishlist ID: {wishlistItem.wishlist_id}</p>
          <p>
            User: {wishlistItem.user.first_name} {wishlistItem.user.last_name}
          </p>

          {/* Use the CheckoutProduct component for each wishlist item */}
          {wishlistItem.wishlistitems.map((wishlistItemDetail) => (
            <CheckoutProduct
              key={wishlistItemDetail.product_id}
              product={wishlistItemDetail}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
