"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCategoryAPI } from "../../app/api/categoriesAPIs"; // Update with the correct path to your API

import { toast } from "sonner";

// Your Zod validation schema
const categorySchema = z.object({
  category_name: z.string().min(2).max(50),
  // Add other fields as needed
});

const CategoryForm = () => {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: zodResolver(categorySchema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const response = await addCategoryAPI(data);
      console.log(response.data);

      // Show success toast
      toast.success("New Category added to the database!");

      // Clear the form fields
      reset();
    } catch (error) {
      // handle error, show an error message
      console.error(error);
      toast.error("Failed to add Category to the database");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label
          htmlFor="category_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Category Name
        </label>
        <input
          type="text"
          id="category_name"
          {...register("category_name")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.category_name && (
          <p className="text-red-500 text-xs italic">
            {errors.category_name.message}
          </p>
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
        className="bg-charcoal hover:bg-blue-700 text-coralPinkLight font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default CategoryForm;
