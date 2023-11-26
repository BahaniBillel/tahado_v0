"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { addOccasionAPI } from "../../app/api/occasionAPIs"; // Update with the correct path to your API

import { GraphQLClient } from "graphql-request"; // Import GraphQLClient
import { toast } from "sonner";

// Your Zod validation schema
const occasionSchema = z.object({
  name: z.string().min(2).max(50),
  // Add other fields as needed
});

const OccasionForm = () => {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: zodResolver(occasionSchema),
  });
  const { errors } = formState;
  const createOccasion = async (occasionData) => {
    console.log("logging frim createOccasion", occasionData);
    const client = new GraphQLClient("http://localhost:3001/graphql"); // Update with your GraphQL endpoint

    const mutation = `
      mutation CreateOccasion($occasionData: OccasionInput!) {
        createOccasion(occasionData: $occasionData) {
          name
        }
      }
    `;

    try {
      const data = await client.request(mutation, { occasionData });
      console.log("Occasion created successfully:", data.createOccasion);
      toast.success(
        ` ${data.createOccasion.name},
         was successfully created in occasions table.`
      );
    } catch (error) {
      console.error("Error creating occasion:", error);
      toast.error("Something went wrong while creating the occasion");
    }
  };

  const onSubmit = async (data) => {
    console.log("data about to submit", data);
    try {
      await createOccasion(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Occasion Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name.message}</p>
        )}
      </div>

      {/* Add other form fields similarly */}
      {/* Example: */}
      {/* <div className="mb-4">
        <label htmlFor="someOtherField" className="block text-gray-700 text-sm font-bold mb-2">
          Some Other Field
        </label>
        <input
          type="text"
          id="someOtherField"
          {...register('someOtherField')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.someOtherField && (
          <p className="text-red-500 text-xs italic">{errors.someOtherField.message}</p>
        )}
      </div> */}

      <button
        type="submit"
        className="bg-charcoal hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default OccasionForm;
