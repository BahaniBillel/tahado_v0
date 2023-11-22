"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCraftmanAPI } from "../../app/api/craftmenAPIs"; // Update with the correct path

import { toast } from "sonner";
// Your Zod validation schema
const craftmanSchema = z.object({
  name: z.string().min(2).max(100),
  // Add other fields as needed
});

const CraftmanForm = () => {
  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(craftmanSchema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const response = await CreateCraftmanAPI(data);
      console.log(response.data);
      // handle success, maybe redirect or show a success message

      // Show success toast

      // Clear the form fields
      toast.success("seems correct");
      reset();
    } catch (error) {
      // handle error, show an error message
      console.error(error);
      toast.error("somme wrong is going on");
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
