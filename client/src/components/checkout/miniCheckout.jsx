"use client";
import { StarIcon, TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import {
  removeFromBasket,
  selectItems,
  incrementQuantity,
  decrementQuantity,
} from "../../../slices/basketSlice";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Graphql
import { GET_ALL_ORDERS, GET_PRICE_LIST } from "../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";
import { useMutation, useQuery } from "@apollo/client";

function MiniCheckout({
  name,
  isCheckout,
  sender,
  recipient,
  flower_pocket,
  productImage,
  amount,
  price,
  quantity,
  productId,
}) {
  const dispatch = useDispatch();
  // const items = useSelector(selectItems);

  const [orderQuantity, setOrderQuantity] = useState(quantity);
  const [orderAmount, setOrderAmount] = useState(amount);
  const orderPrice = parseInt(price);

  // GRAPHQL SETUP
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch,
  } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  useEffect(() => {
    // Function to execute the desired action, for example, refetching the data
    const fetchData = () => {
      refetch();
    };

    // Call the function
    fetchData();

    // Set up the polling (re-fetching) interval
    const interval = setInterval(fetchData, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [refetch]); // Add any dependencies for useEffect here

  // Render your component based on the state of the query
  if (ordersLoading) return <p>Loading...</p>;
  if (ordersError) return <p>Error :(</p>;

  return (
    <div
      className="grid grid-cols-5 gap-y-10  items-center border-lightGray
       border-solid border mb-1 py-2 px-5 h-20 overflow-hidden
        bg-white cursor-pointer rounded-sm "
    >
      {/* left section */}
      <div className="col-span-1  flex flex-col items-end  ">
        <div className="font-semibold text-sm whitespace-pre">{amount} DA</div>

        <div className="flex flex-grow"></div>
      </div>
      {/* middle section */}
      <div className="col-span-3 mx-5 flex flex-col text-right">
        <p className="font-bold ">{name}</p>
        {isCheckout ? null : (
          <div className="">
            <StarRatings
              rating={2}
              starRatedColor="gold"
              changeRating={3}
              numberOfStars={5}
              name="rating"
              starDimension="16px"
            />
          </div>
        )}
        {flower_pocket ? (
          <p className="font-light text-xs text-charcoal/40 md:text-sm mt-2 line-clamp-1">
            شامل لثمن باقة الورود
          </p>
        ) : (
          <p className="font-light text-xs text-charcoal/40 md:text-sm mt-2 line-clamp-1">
            بدون باقة ورورد
          </p>
        )}
      </div>
      {/* right section */}
      <div className="flex flex-col space-y-2 items-end relative">
        <Image
          src={productImage}
          width={70}
          height={70}
          alt={name}
          className="p-2"
        />
        <span
          className="absolute right-0 -top-1 bg-magenta
         text-white rounded-full text-xs py-1 px-2 "
        >
          {quantity}
        </span>
      </div>
    </div>
  );
}

export default MiniCheckout;
