"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraphQLClient } from "graphql-request";
import { toast } from "sonner";

// Your Zod validation schema
const categorySchema = z.object({
  category_name: z.string().min(2).max(50),
  parent_category_id: z
    .number()
    .transform((value) =>
      typeof value === "string" ? parseInt(value, 10) : value
    )
    .optional(),
  // Add other fields as needed
});

const CategoryForm = () => {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: zodResolver(categorySchema),
  });
  const { errors } = formState;

  const createCategory = async (categoryData) => {
    console.log("logging from categoryform", categoryData);
    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `
      mutation CreateCategory($categoryData: CategoryInput!) {
        createCategory(categoryData: $categoryData) {
       
          category_name
          parent_category_id
          # Add other fields you want to return
        }
      }
    `;

    try {
      const data = await client.request(mutation, { categoryData });
      console.log("Category created successfully:", data.createCategory);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Something went wrong while creating the category");
    }
  };

  const onSubmit = async (data) => {
    console.log("data about to submit category", data);
    try {
      await createCategory(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto ">
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

      <div className="mb-4">
        <label
          htmlFor="parent_category_id"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Parent Category ID
        </label>
        <input
          type="number"
          id="parent_category_id"
          {...register("parent_category_id", {
            setValueAs: (value) => parseFloat(value),
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.parent_category_id && (
          <p className="text-red-500 text-xs italic">
            {errors.parent_category_id.message}
          </p>
        )}
      </div>

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
