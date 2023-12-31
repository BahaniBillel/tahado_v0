"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";

import {
  incrementLikes,
  decrementLikes,
  setLastVisitedUrl,
  setLastLikedItem,
  toggleLike,
  selectLikes,
} from "../../../slices/basketSlice";

// import { PostWishlist, RemoveWishlist } from "../../app/api/wishlistAPIs";

import { GET_WISHLIST } from "../../graphql/querries";
import { useMutation, useQuery } from "@apollo/client";
import { GraphQLClient, gql } from "graphql-request";

// React Transition Group
import { Transition } from "react-transition-group";

function ProductLy01({
  mainImage,
  secondImage,
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
  const pathname = usePathname();
  const router = useRouter();
  const [heart, setHeart] = useState(false); // Default to not liked
  const userId = parseInt(user_id, 10);
  const [currentImage, setCurrentImage] = useState(mainImage);
  const isUserSignedIn = userId ? true : false;
  const productId = parseInt(product_id, 10);

  // Fetch like status from Redux
  const likes = useSelector(selectLikes);

  useEffect(() => {
    setCurrentImage(mainImage);
  }, [mainImage]);

  const handleMouseEnter = () => {
    setCurrentImage(secondImage);
  };

  const handleMouseLeave = () => {
    setCurrentImage(mainImage);
  };

  // GraphQL Query to get wishlist data

  const { data: wishlistData, refetch: refetchWishlist } =
    useQuery(GET_WISHLIST);

  const ToggleLikesWhenSignedIn = async () => {
    // If user not signedIn , Save the last liked item
    // push the user to signIn
    // Then return to the last page the user was in it
    if (!isUserSignedIn) {
      dispatch(setLastLikedItem(productId));

      dispatch(setLastVisitedUrl(pathname));
      router.push("/sign-in");
      return; // Stop further execution
    }
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

        // dispatch(incrementLikes(product));
        return response;
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
        // dispatch(decrementLikes(product));
      }

      // Refetch the wishlist query to get updated data
      refetchWishlist();
    } catch (error) {
      console.error("Error in ToggleLikes:", error);
      // Handle error
    }
  };

  // This will correctly toggle the heart state based on Redux store
  useEffect(() => {
    setHeart(likes.includes(productId));
  }, [likes, productId]);

  function doesProductIdExist(productId, data) {
    for (let i = 0; i < data?.wishlist.length; i++) {
      const wishlistItems = data?.wishlist[i].wishlistitems;
      for (let j = 0; j < wishlistItems.length; j++) {
        if (wishlistItems[j].product_id === productId) {
          return true; // Product ID found
        }
      }
    }
    return false; // Product ID not found
  }

  const productIdToCheck = productId;
  useEffect(() => {
    const exists = doesProductIdExist(productIdToCheck, wishlistData);
    setHeart(exists);
    console.log(
      `Product ID ${productIdToCheck} ${
        exists ? "exists" : "does not exist"
      } in the wishlist.`
    );
  }, [productIdToCheck, wishlistData]); // Dependencies array

  return (
    <div
      className={`w-80 group  hover:shadow-lg p-2 relative rounded-lg 
   transition-all duration-75 ease-in-out `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={` ${"w-50" || width}  ${
          "h-80" || length
        }  group  p-2 relative  ease-in-out cursor-pointer`}
      >
        {feature ? (
          <span
            className={`absolute left-1 top-2 text-xs font-light px-3 py-1
             ${featureColor}  bg-black text-white rounded-r-xl`}
          >
            {feature}
          </span>
        ) : null}
        <Link href={`/gift/${link}`}>
          <div className="h-full overflow-hidden">
            <Image
              src={currentImage || mainImage}
              alt={giftName}
              fill={fill}
              width={300}
              height={300}
              className="rounded-sm"
            />
          </div>
        </Link>

        <div className="absolute right-5 top-5 z-40 ">
          <button onClick={ToggleLikesWhenSignedIn}>
            {heart ? (
              <HeartIcon className="h-6 text-red " />
            ) : (
              <HeartIcon className="h-6 text-lightGray " />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-nowrap justify-start items-end text-right space-y-1 px-1">
        <p className=" text-xl text-charcoal  line-clamp-2  ">{giftName}</p>
        <div className="flex-grow"></div>

        <div className="flex flex-row justify-start whitespace-pre space-x-1 text-charcoal font-extrabold ">
          <p>دج</p>
          <p>{price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductLy01;
