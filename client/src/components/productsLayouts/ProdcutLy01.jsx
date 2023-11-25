"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { HeartIcon } from "@heroicons/react/24/solid";

import { useDispatch } from "react-redux";

import { incrementLikes, decrementLikes } from "../../../slices/basketSlice";

// import { PostWishlist, RemoveWishlist } from "../../app/api/wishlistAPIs";

import { GET_WISHLIST } from "../../graphql/querries";
import { useMutation, useQuery } from "@apollo/client";
import { GraphQLClient, gql } from "graphql-request";

function ProductLy01({
  mainImage,
  giftName,
  price,
  feature,
  featureColor,
  link,
  fill,
  width,
  length,

  user_id,
  product_id,
}) {
  const dispatch = useDispatch();
  const [heart, setHeart] = useState(false);

  // GraphQL Query to get wishlist data

  const { data: wishlistData, refetch: refetchWishlist } =
    useQuery(GET_WISHLIST);

  console.log("logging from productlayout01", wishlistData);

  useEffect(() => {
    // Check if the product is liked in localStorage when the component mounts
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || {};
    const isLiked = likedProducts[`${user_id}_${product_id}`] || false;
    setHeart(isLiked);
  }, [user_id, product_id, wishlistData]);

  const product = {
    mainImage,
    giftName,
    price,
    feature,
    featureColor,
    link,
  };

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
        const response = await client.request(mutation, { wishData });

        dispatch(incrementLikes(product));
      } else {
        // Remove from wishlist logic
        const wishlistId = parseInt(wishlistData.wishlist_id, 10);
        if (wishlistId == null) {
          console.error("Wishlist ID is null");
          return; // Exit the function if wishlistId is null
        }
        // TODO: wishlistI is printed NaN in console solve the issue today
        console.log("Removing from wishlist with ID:", wishlistId);
        // If the product is currently liked, remove it from the wishlist
        const response = await client.request(removeWishlistMutation, {
          wishlistRemoveData,
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
    <div className="w-80 group">
      <div
        className={` ${"w-80" || width}  ${
          "h-80" || length
        }  group  border border-charcoal/20 hover:shadow-lg p-2 relative rounded-sm 
    hover:-translate-y-1 transition-all duration-150 ease-in-out cursor-pointer`}
      >
        {feature ? (
          <span
            className={`absolute -left-1 top-1 text-xs font-light px-3 py-1 ${featureColor}  bg-black text-white rounded-r-xl`}
          >
            {feature}
          </span>
        ) : null}
        <Link href={`/gift/${link}`}>
          <div className="h-full overflow-hidden">
            <Image
              src={mainImage}
              alt={giftName}
              fill={fill}
              width={300}
              height={300}
            />
          </div>
        </Link>

        <div className="absolute right-5 top-5 z-40 ">
          <button onClick={ToggleLikes}>
            {heart ? (
              <HeartIcon className="h-6 text-red " />
            ) : (
              <HeartIcon className="h-6 text-lightGray " />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row flex-nowrap text-sm space-y-3 items-center px-1">
        <p>
          {" "}
          <span>دج</span>
          <span>{price}</span>
        </p>
        <div className="flex-grow"></div>
        <p className="whitespace-pre">{giftName}</p>
      </div>
    </div>
  );
}

export default ProductLy01;
