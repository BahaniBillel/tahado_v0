"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { GET_SEARCH_PRODUCTS } from "../../graphql/querries";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("query");

  console.log("logging query:", search);

  useEffect(() => {
    // Moved inside useEffect
    if (!search) {
      return; // If there's no search term, we don't do anything
    }
    setSearchTerm(search);
  }, [search]); // Dependency array ensures this runs when 'search' changes

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
        <Suspense>
          {data &&
            data.products
              .filter((product) => product.giftname === search)
              .map((product) => <div key={product.id}>{product.giftname}</div>)}
        </Suspense>
      </div>
    </div>
  );
}

export default SearchPage;
