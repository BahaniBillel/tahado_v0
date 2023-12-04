"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDERS_BY_USER_ID } from "../graphql/querries";

function BasketLength({ userId }) {
  const { data, loading, error } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables: { userId }, // Pass userId as a variable
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  if (loading) {
    return (
      <p className="text-white flex items-center justify-center">
        Loading ....
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-white flex items-center justify-center">
        Oops! Something went wrong ....
      </p>
    );
  }

  // Use the data directly as the query is already fetching orders for the given userId
  const orderCount = data?.order?.length || 0;

  return <div>{orderCount}</div>;
}

export default BasketLength;
