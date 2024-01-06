"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";

// Define the schema using Zod
const schema = z.object({
  provider_name: z.string().min(1, "Provider name is required"),
  city: z.string().min(1, "City is required"),
  delivery_time_id: z.number().optional(),
  order_id: z.number().optional(),
  // Add other fields as required based on your model
});

// Component
const DeliveryOptionsForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div
      className="flex justify-center items-start flex-col h-screen bg-gray-100 
    max-w-xl w-full  mx-auto p-6 bg-white rounded shadow"
    >
      <h1 className="text-2xl text-charcoal font-bold mb-1">
        <span className="text-turquoise ">First Page : </span>
        Delivery Form Options.
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" "
        style={{ minWidth: "500px" }}
      >
        {/* provider name */}
        <div className="mb-4">
          <label
            htmlFor="provider_name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Provider Name:
          </label>
          <input
            id="provider_name"
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
            htmlFor="city"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            City:
          </label>
          <input
            id="city"
            {...register("city")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-charcoal leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.city && <p>{errors.city.message}</p>}
        </div>

        {/* Delivery time id */}
        <div className="mb-4">
          <label
            htmlFor="delivery_time_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Delivery Time ID:
          </label>
          <input
            type="number"
            id="delivery_time_id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("delivery_time_id")}
          />
          {errors.delivery_time_id && <p>{errors.delivery_time_id.message}</p>}
        </div>

        {/* order id */}
        <div className="mb-4">
          <label
            htmlFor="order_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Order ID:
          </label>
          <input
            type="number"
            id="order_id"
            {...register("order_id")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-charcoal leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.order_id && <p>{errors.order_id.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-turquoise hover:bg-magenta text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DeliveryOptionsForm;
