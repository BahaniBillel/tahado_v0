"use client";

import React from "react";
import { useMutation, useQuery } from "@apollo/client";

import { GET_USERS } from "../graphql/querries";

function TextGraphql() {
  const { data, loading, error } = useQuery(GET_USERS);

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

  const MappedCategories = data?.users.map((user) => {
    return (
      <p key={user.user_id} className="text-red">
        {user.first_name}
      </p>
    );
  });

  return <div>{MappedCategories}</div>;
}

export default TextGraphql;
