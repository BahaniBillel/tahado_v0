// useOccasions.js
"use client";
import { useQuery } from "@apollo/client";
import { GET_OCCASIONS } from "../../graphql/queries";

const useOccasions = () => {
  const { data, loading, error } = useQuery(GET_OCCASIONS);

  if (loading) {
    return {
      loading: true,
      occasions: null,
      error: null,
    };
  }

  if (error) {
    return {
      loading: false,
      occasions: null,
      error,
    };
  }

  const occasions = data.occasions.map((occasion) => occasion.name);

  return {
    loading: false,
    occasions,
    error: null,
  };
};

export { useOccasions }; // Export as named export
