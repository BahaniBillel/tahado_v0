"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { GET_SEARCH_PRODUCTS } from "../../graphql/querries";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("query");

  console.log("logging query:", search);

  if (!search) {
    return <p>Please enter a search query.</p>; // Handle empty query
  }

  useEffect(() => {
    if (search) {
      setSearchTerm(search);
    }
  }, [search]);

  const { data, loading, error } = useQuery(GET_SEARCH_PRODUCTS, {
    variables: { query: searchTerm },
    skip: !searchTerm,
    fetchPolicy: "network-only",
    pollInterval: 200,
  });

  console.log("logging data:", data);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div>
        {data &&
          data.products
            .filter((product) => product.giftname === search)
            .map((product) => <div key={product.id}>{product.giftname}</div>)}
      </div>
    </div>
  );
}

export default SearchPage;
