"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOccasionAPI } from "../../app/api/occasionAPIs"; // Update with the correct path to your API
import { toast } from "react-toastify";

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

  const onSubmit = async (data) => {
    try {
      const response = await addOccasionAPI(data);
      console.log(response.data);

      // Show success toast
      toast.success("New Occasion added to the database!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        theme: "light",
      });

      // Clear the form fields
      reset();
    } catch (error) {
      // handle error, show an error message
      console.error(error);
      toast.error("Failed to add Occasion to the database", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
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
