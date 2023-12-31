"use client";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { GET_SEARCH_PRODUCTS } from "../graphql/querries";

const SearchComp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_SEARCH_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && data.products) {
      setFilteredProducts(data.products);
    }
  }, [data]);

  const handleSearch = () => {
    const searchLower = searchQuery.trim().toLowerCase();
    const filteredProduct = filteredProducts.find((product) =>
      product.giftname.toLowerCase().includes(searchLower)
    );

    console.log("Filtered Product:", filteredProduct);

    if (filteredProduct && filteredProduct.url) {
      router.push(`/gift/${filteredProduct.url}`);
      setSearchQuery(""); // Clear the search input
    } else {
      console.log("Product or URL not found");
      alert("Product not found");
    }
  };

  // console.log("Search Query:", searchQuery);
  // console.log("Filtered Products:", filteredProducts);

  // Log each product's giftname for inspection
  filteredProducts.forEach((product) => {
    // console.log("Product giftname:", product.giftname);
  });

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    const filteredSuggestions = filteredProducts.filter((product) =>
      product.giftname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.giftname);
    setShowSuggestions(false);
    router.push(`/gift/${product.url}`);
    setSearchQuery(""); // Clear the search input
  };

  const handleMouseLeave = () => {
    setShowSuggestions(false);
  };

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  return (
    <div className="relative flex flex-row justify-center items-center  ml-5 h-full w-full ">
      <div className="relative w-full group  " onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden relative rounded-full">
          <input
            type="text"
            value={searchQuery}
            className="border border-lightGray w-full outline-none bg-gray-100 rounded-full 
          text-right pr-3 py-2 focus:bg-lightGray/50  "
            placeholder=" ...ابحث عن هدية "
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          <BsSearch
            className="w-8 h-8 text-white absolute left-2 top-1/2 bg-lightPink 
          rounded-full p-1 transform -translate-y-1/2 cursor-pointer 
          group-hover:rounded-r-none group-hover:h-14 group-hover:w-14
           group-hover:p-4 ease-in-out transition-all duration-200 group-hover:-left-2"
            onClick={handleSearch}
          />
        </div>

        {/* Logic for search propositions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 top-full text-charcoal bg-white border border-lightGray border-t-0 rounded-b-xl w-full shadow-lg">
            {filteredSuggestions.map((product) => (
              <div
                key={product.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(product)}
              >
                {product.giftname}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComp;
