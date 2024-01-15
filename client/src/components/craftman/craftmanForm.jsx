"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraphQLClient } from "graphql-request"; // Import GraphQLClient
// import { CreateCraftmanAPI } from "../../app/api/craftmenAPIs"; // Update with the correct path
import { CREATE_CRAFTSMAN } from "../../graphql/mutations";
import { useMutation, gql } from "@apollo/client";

import { toast } from "sonner";
// Your Zod validation schema
const craftmanSchema = z.object({
  name: z.string().min(2).max(100),
  // Add other fields as needed
});

const CraftmanForm = () => {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: zodResolver(craftmanSchema),
  });
  const { errors } = formState;

  const createCraftman = async (craftmanData) => {
    const client = new GraphQLClient("http://localhost:3001/graphql"); // Update with your GraphQL endpoint

    const mutation = `
      mutation CreateCraftman($craftmanData: CraftmanInput!) {
        createCraftman(craftmanData: $craftmanData) {
          name
        }
      }
    `;

    try {
      const data = await client.request(mutation, { craftmanData });
      console.log("Craftsman created successfully:", data.createCraftman);
      toast.success("Craftsman created successfully");
    } catch (error) {
      console.error("Error creating craftsman:", error);
      toast.error("Something went wrong while creating the craftsman");
    }
  };

  const onSubmit = async (data) => {
    console.log("data about to submit", data);
    try {
      await createCraftman(data);
      toast.success(`${data.name} was successfully added to craftman table`);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Craftman Name
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

export default CraftmanForm;
