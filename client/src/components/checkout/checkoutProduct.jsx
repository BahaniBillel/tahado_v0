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

function CheckoutProduct({
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

  const increaseProduct = () => {
    dispatch(incrementQuantity({ productId: productId, price }));
  };

  const decrementProduct = () => {
    if (quantity > 1) {
      dispatch(decrementQuantity({ productId: productId }));
    }
  };

  const removeItemFromBasket = async (orderId) => {
    // Remove item from redux store
    dispatch(removeFromBasket(orderId));

    // Remove item from database, but it's not working since the orderId
    // is created a the moment the order is submitted
    // it means that orderId doesn't even exist in the database orders table
    // This function can be implemented once the order is created
    // use it in user profile section : purchases and reviews
    // note that the order cannot be removed once the order is delivered

    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `
    mutation RemoveItem($removeItemInput: RemoveItemInput!) {
      removeItem(removeItemInput: $removeItemInput) {
        order {
          order_id
        }
       
      }
    }
  `;

    try {
      await client.request(mutation, {
        removeItemInput: { order_id: orderId },
      });
      toast.success("Item removed successfully");
      // Here, also dispatch to Redux if needed
      // dispatch(removeFromBasket({ name }));
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Something went wrong while removing the item");
    }
  };

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
  // console.log(ordersData.orders);

  const existingOrder = ordersData.orders.find(
    (order) => order.order_id === productId
  );

  return (
    <div
      className="grid grid-cols-5 gap-y-10  border-lightGray
       border-solid border mb-1 py-2 px-5 h-36 overflow-hidden
        bg-white cursor-pointer
      hover:shadow-md rounded-sm "
    >
      <div className="col-span-1  flex flex-col items-end  ">
        <div className="font-semibold text-sm whitespace-pre">{amount} DA</div>
        <div className="flex flex-row space-x-3 items-center mt-5 whitespace-pre">
          <button
            className="bg-greenSecondary py-1 px-3 rounded-sm text-black hover:scale-95 transition-shadow duration-150"
            onClick={decrementProduct}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            className="bg-greenPrimary py-1 px-3 rounded-sm text-black shadow-md hover:scale-95 transition-shadow duration-150"
            onClick={increaseProduct}
          >
            +
          </button>
        </div>
        <div className="flex flex-grow"></div>
        <div
          className="flex flex-row rounded-md p-2  hover:border-greenSecondary
         hover:shadow-md hover:bg-lightEmerald hover:scale-95 transition-all 
         duration-150 ease-in-out group"
          onClick={() => removeItemFromBasket(productId)}
        >
          <p className="text-red text-sm tracking-wide group-hover:text-greenSecondary whitespace-pre">
            إزالة من السلة
          </p>
          <TrashIcon className="h-5 text-red mr-1 group-hover:text-greenSecondary" />
        </div>
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
        <p className="font-light text-xs md:text-sm mt-2 line-clamp-3">
          {recipient}
        </p>
        <p className="font-light text-xs md:text-sm mt-2 line-clamp-3">
          {sender}
        </p>
        <p className="font-light text-xs md:text-sm mt-2 line-clamp-3">
          {flower_pocket ? "with flower" : "without flower"}
        </p>
      </div>
      {/* right section */}
      <div className="flex flex-col space-y-2 items-end ">
        <Image
          src={productImage}
          width={70}
          height={70}
          alt={name}
          className="p-2"
        />
      </div>
    </div>
  );
}

export default CheckoutProduct;
