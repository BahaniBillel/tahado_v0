"use client";
import Image from "next/image";
import React from "react";
import DefaultImage from "../../../public/images/defaultGiftImage.jpg";

const CheckoutProduct = ({ product }) => {
  // Check if product is defined
  if (!product || !product.product_id) {
    return <div>Error: Product is undefined or does not have product_id.</div>;
  }

  const {
    product_id, // Corrected property name
    product: { giftname, description, price, occasions, sku, main_image },
  } = product;

  console.log("checkout image", main_image, giftname);

  const handleAddToCart = async () => {
    console.log(product);
  };
  return (
    <div className="border border-lightGray p-4 my-4 rounded-md shadow-md grid grid-cols-5 text-xs">
      <div className=" w-32 h-32 bg-mustardYellow relative col-span-1">
        <Image src={main_image || DefaultImage} alt={main_image} fill />
      </div>
      <div className=" col-span-4 flex flex-col text-right items-end">
        <h3 className="text-xl font-semibold mb-2">{giftname}</h3>
        {/* <p className="text-gray-600 mb-2">Description: {description}</p> */}
        <p className="text-yellow-500 mb-2">Price: {price}</p>
        <p className="text-gray-600 mb-2">SKU: {sku}</p>

        <div className=" pl-6 mb-4  flex-row flex flex-nowrap  justify-end">
          {occasions.map((occasion) => (
            <div
              key={occasion.occasion.name}
              className="text-charcoal/60 text-right"
            >
              {occasion.occasion.name}
            </div>
          ))}
        </div>
        {/* Add more product details as needed */}
        <button
          onClick={() => handleAddToCart(product_id)}
          className="bg-turquoise text-charcoal rounded-sm font-semibold px-4 py-2 w-4/6 max-w-sm hover:bg-coralPinkLight transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
