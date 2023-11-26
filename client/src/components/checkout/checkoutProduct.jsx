"use client";
import React from "react";

const CheckoutProduct = ({ product }) => {
  // Check if product is defined
  if (!product || !product.product_id) {
    return <div>Error: Product is undefined or does not have product_id.</div>;
  }

  const {
    product_id, // Corrected property name
    product: { giftname, description, price, occasions, sku },
  } = product;

  return (
    <div className="border p-4 my-4 rounded-md shadow-md text-right rtl">
      <h3 className="text-xl font-semibold mb-2">{giftname}</h3>
      <p className="text-gray-600 mb-2">Description: {description}</p>
      <p className="text-yellow-500 mb-2">Price: {price}</p>
      <p className="text-gray-600 mb-2">SKU: {sku}</p>
      <ul className="list-disc pl-6 mb-4 right-aligned-bullets ">
        {occasions.map((occasion) => (
          <li
            key={occasion.occasion.name}
            className="text-charcoal/60 text-right"
          >
            {occasion.occasion.name}
          </li>
        ))}
      </ul>
      {/* Add more product details as needed */}
      <button
        onClick={() => handleAddToCart(product_id)}
        className="bg-coralPink text-white px-4 py-2 rounded-md hover:bg-coralPinkLight transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CheckoutProduct;
