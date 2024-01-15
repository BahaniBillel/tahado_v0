"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import React from "react";
import { toast } from "sonner";

// Define the schema using Zod
const deliveryOptionSchema = z.object({
  provider_name: z.string(),
  city: z.string(),
  base_price: z.number().min(0).nonnegative(),
  additional_cost: z.number().min(0).nonnegative(),
  estimated_time: z.number().min(0).nonnegative(),
  // Keep the delivery_option_id if needed
});

const DeliveryOptionForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deliveryOptionSchema),
  });

  const addDeliveryProvider = async (deliveryDataInput) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `mutation AddDeliveryProvider($deliveryDataInput: DeliveryDataInput!) {
  addDeliveryProvider(deliveryDataInput: $deliveryDataInput) {
    deliveryOptions {
    
      provider_name
      city
    }
    deliveryPricing {
      base_price
      additional_cost
  
    }
    deliveryTime {
      estimated_time
    }
  }
  }`;

    try {
      const data = await client.request(mutation, {
        deliveryDataInput,
      });

      // console.log("Gift created successfully:", data.createGift);
      toast.success("Provider_name and city created successfully");
      return data;
    } catch (error) {
      onsole.error("Error creating gift:", error);
      toast.error("Something went wrong while creating the gift");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await addDeliveryProvider(data);
      console.log(response);
      // Handle success
      toast.success(`${data.city} was successfully added to the database`);
      reset();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto my-10 p-8 bg-white shadow-lg rounded"
    >
      <h1 className="text-2xl font-semibold my-2">ADD NEW DELIVERY PROVIDER</h1>
      {/* Provider name */}
      <div className="mb-4">
        <label
          htmlFor="provider_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Provider Name
        </label>
        <input
          id="provider_name"
          type="text"
          {...register("provider_name")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.provider_name && (
          <p className="text-red-500 text-xs italic">
            {errors.provider_name.message}
          </p>
        )}
      </div>

      {/* city */}
      <div className="mb-4">
        <label
          htmlFor="provider_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          City
        </label>
        <input
          id="city"
          type="text"
          {...register("city")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.city && (
          <p className="text-red-500 text-xs italic">{errors.city.message}</p>
        )}
      </div>

      {/* estimated time */}

      <div className="mb-4">
        <label
          htmlFor="estimated_time"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Estimated Time
        </label>

        <input
          type="number"
          {...register("estimated_time", {
            setValueAs: (value) => parseFloat(value),
          })}
          className="w-full p-2 border rounded"
        />
        {errors.estimated_time && (
          <p className="text-red-500 text-xs italic">
            {errors.estimated_time.message}
          </p>
        )}
      </div>

      {/* base price */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Base price
        </label>
        <input
          type="number"
          {...register("base_price", {
            setValueAs: (value) => parseFloat(value),
          })}
          className="w-full p-2 border rounded"
        />
        {errors.base_price && (
          <p className="text-red-500">{errors.base_price.message}</p>
        )}
      </div>

      {/* >Additional costs */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Additional cost{" "}
        </label>
        <input
          type="number"
          {...register("additional_cost", {
            setValueAs: (value) => parseFloat(value),
          })}
          className="w-full p-2 border rounded"
        />
        {errors.additional_cost && (
          <p className="text-red-500">{errors.additional_cost.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-turquoise hover:bg-lightmagenta text-white font-bold 
        py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
      >
        Submit
      </button>
    </form>
  );
};

export default DeliveryOptionForm;
