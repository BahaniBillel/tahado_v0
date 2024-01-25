"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/solid";

import { GET_WISHLIST } from "../../graphql/querries";
import { useMutation, useQuery } from "@apollo/client";
import { GraphQLClient, gql } from "graphql-request";

import { getSession, useSession } from "next-auth/react";

function ImageLayout01({ image, alt, price, currency }) {
  const [heart, setHeart] = useState(false);

  // Get the user's session.
  const { data, status } = useSession();

  // console.log("This data from naigation bar", data);

  const isUserSignIn = data?.user?.first_name;
  const user_id = parseInt(data?.user?.user_id);

  // GraphQL Query to get wishlist data

  const { data: wishlistData, refetch: refetchWishlist } =
    useQuery(GET_WISHLIST);

  // console.log("logging from productlayout01", wishlistData);

  // useEffect(() => {
  //   // Check if the product is liked in localStorage when the component mounts
  //   const likedProducts =
  //     JSON.parse(localStorage.getItem("likedProducts")) || {};
  //   const isLiked = likedProducts[`${user_id}_${product_id}`] || false;
  //   setHeart(isLiked);
  // }, [user_id, product_id, wishlistData]);

  const ToggleLikes = async () => {
    const userId = parseInt(user_id, 10);
    const productId = parseInt(product_id, 10);

    // Initialize GraphQLClient
    const client = new GraphQLClient("http://localhost:3001/graphql");

    // Define the GraphQL mutation
    const mutation = gql`
      mutation CreateWishItem($wishData: WishInput!) {
        createWishItem(wishData: $wishData) {
          wishlist {
            wishlist_id
          }
          product {
            gift_id
          }
        }
      }
    `;

    // Construct the wishData object
    const wishData = {
      user_id: userId,
      product_id: productId,
    };

    const removeWishlistMutation = gql`
      mutation RemoveFromWishList($wishlistRemoveData: WishlistRemoveInput!) {
        removeFromWishList(wishlistRemoveData: $wishlistRemoveData) {
          wishlist_id
        }
      }
    `;

    // Define input type for the mutation
    const wishlistRemoveData = {
      wishlist_id: parseInt(wishlistData.wishlist_id, 10),
    };

    try {
      // Toggle the heart state
      setHeart(!heart);

      // Update localStorage to persist the liked state
      const likedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || {};
      likedProducts[`${userId}_${productId}`] = !heart;
      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));

      // If the product is not currently liked, add it to the wishlist
      if (!heart) {
        console.log("Wishlist Data:", wishlistData);
        const response = await client.request(mutation, { wishData });

        dispatch(incrementLikes(product));
      } else {
        // Remove from wishlist logic
        const wishlistWithItem = wishlistData.wishlist.find((wishlist) =>
          wishlist.wishlistitems.some((item) => item.product_id === productId)
        );

        if (!wishlistWithItem) {
          console.error("Wishlist item not found for product ID:", productId);
          return;
        }

        const wishlistId = parseInt(wishlistWithItem.wishlist_id, 10);
        if (isNaN(wishlistId)) {
          console.error("Invalid Wishlist ID for product ID:", productId);
          return;
        }

        console.log("Removing from wishlist with ID:", wishlistId);

        const response = await client.request(removeWishlistMutation, {
          wishlistRemoveData: { wishlist_id: wishlistId },
        });

        console.log("Removed from wishlist:", response);
        dispatch(decrementLikes({ giftName }));
      }

      // Refetch the wishlist query to get updated data
      refetchWishlist();
    } catch (error) {
      console.error("Error in ToggleLikes:", error);
      // Handle error
    }
  };
  return (
    <div className=" h-full flex flex-col items-center justify-center text-center bg-turquoise">
      <div className="w-full h-full relative group">
        <Image
          src={image}
          alt={alt}
          className="rounded-md  "
          style={{ objectFit: "fill" }}
        />

        {price ? (
          <div
            className=" whitespace-pre mt-2 font-sans absolute left-1 bottom-2 
      rounded-full px-2 py-1 w-fit flex flex-row  space-x-3 flex-nowrap  bg-lightPink"
          >
            <p className=" text-xs font-medium text-charcoal">
              {currency} {price}
            </p>
            <p className=" text-xs font-light line-through text-charcoal/50">
              {currency} {price}
            </p>
          </div>
        ) : null}

        <div className="absolute right-5 opacity-0 group-hover:opacity-100 top-44 group-hover:top-5  z-40 transition-all ease-in duration-200 ">
          <button onClick={ToggleLikes}>
            {heart ? (
              <HeartIcon className="h-6 text-red  border rounded-full p-1 bg-lightGray/50 " />
            ) : (
              <HeartIcon className="h-6 text-charcoal border rounded-full p-1 bg-lightGray/50 " />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLayout01;
