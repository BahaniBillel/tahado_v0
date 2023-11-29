"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";

import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CATEGORIES,
  GET_OCCASIONS,
  GET_PRODUCTS,
} from "../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";

// AWS S3 IMPORTS

import { useEffect, useState } from "react";

const InventorySchema = z.object({
  quantity: z.number().min(0).max(1000).nonnegative(),
  reserved: z.number().min(0).nonnegative(),
  minimum_level: z.number().min(0).nonnegative(),
  last_updated: z.string().refine(
    (val) => {
      // Check if the string can be converted to a valid date
      const parsedDate = new Date(val);
      return !isNaN(parsedDate.getTime());
    },
    {
      message: "Invalid date format",
    }
  ),
});

const AddInventoryForm = () => {
  // Page parameter
  const params = useParams();
  // const gid = router.query.gid;

  const product_id = parseInt(params.gid);
  console.log(product_id);

  const {
    data: productsData,
    loading: oproductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(GET_PRODUCTS);

  console.log(productsData);

  //.......................... LOGIC FOR FETCHING IMAGES FROM AWS S3
  // FETCHING IMAGES FROM AMAEZON S3

  const [productsLength, setProductsLength] = useState(0);
  const [giftNum, setGiftNum] = useState(0);
  // Fetching the length of the products from database
  const giftId = giftNum;

  useEffect(() => {
    if (productsData && productsData.products) {
      const ProductsLength = productsData.products.length;
      setProductsLength(ProductsLength);
      setGiftNum(ProductsLength + 1);
    }
  }, [productsData]); // Add productsData to the dependency array

  //..................................  THE END OF LOGIC

  // Logic for Handling Form inputs
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InventorySchema),

    shouldUseNativeValidation: true,
  });

  const addInventory = async (addInventoryInput) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `mutation AddInventory($addInventoryInput: AddInventoryInput!) {
  addInventory(addInventoryInput: $addInventoryInput) {
product_id
    last_updated
    minimum_level
    quantity
    reserved
  }
}`;

    try {
      // Modify the inventoryData to sent
      const modifiedInventoryData = {
        ...addInventoryInput,
        product_id,
      };

      const data = await client.request(mutation, {
        addInventoryInput: modifiedInventoryData,
      });
      // console.log("Gift created successfully:", data.createGift);
      toast.success("Gift created successfully");
    } catch (error) {
      console.error("Error creating gift:", error);
      toast.error("Something went wrong while creating the gift");
    }
  };

  const onSubmit = async (data) => {
    try {
      await addInventory(data);
      toast.success(
        `${data.product_id} was successfully added to the database`
      );
      reset();
      refetchProducts();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="max-w-lg w-full  mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl text-charcoal font-bold mb-1">
        Second Page : Inventory Informations :
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            {...register("quantity", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="w-full p-2 border rounded"
          />
          {errors.quantity && (
            <p className="text-red-500">{errors.quantity.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Reserved</label>
          <input
            type="number"
            {...register("reserved", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="w-full p-2 border rounded"
          />
          {errors.reserved && (
            <p className="text-red-500">{errors.reserved.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Minimum</label>
          <input
            type="number"
            {...register("minimum_level", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="w-full p-2 border rounded"
          />
          {errors.minimum_level && (
            <p className="text-red-500">{errors.minimum_level.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Last Update</label>
          <input
            type="date"
            {...register("last_updated", {
              setValueAs: (value) => {
                return value
                  ? new Date(`${value}T00:00:00`).toISOString()
                  : null;
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.last_updated && (
            <p className="text-red-500">{errors.last_updated.message}</p>
          )}
        </div>
        <div className="mt-2">
          <button
            type="submit"
            className="bg-charcoal text-white p-2 rounded hover:scale-95"
            onClick={() => console.log("Button clicked")}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryForm;
