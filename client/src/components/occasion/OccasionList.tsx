"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_OCCASIONS } from "../../graphql/querries";

function OccasionList() {
  const { data, loading, error } = useQuery(GET_OCCASIONS);

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

  const mappedOccasions = data.occasions.map((occasion) => occasion.name);

  console.log("these are the occasions:", mappedOccasions[0]);

  return mappedOccasions;
}

export default OccasionList;
