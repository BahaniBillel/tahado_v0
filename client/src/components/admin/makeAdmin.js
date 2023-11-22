"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MakeUserAdminAPI } from "../../app/api/usersAPIs";
import { toast } from "react-toastify";

// Define a schema for the form using zod
const FormSchema = z.object({
  userId: z.number().int(),
});

const MakeUserAdminButton = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleMakeAdmin = async (formData) => {
    try {
      setIsLoading(true);

      // Parse the userId as a number
      const parsedUserId = parseInt(formData.userId, 10);

      // Make the API call to make the user an admin
      const response = await MakeUserAdminAPI(parsedUserId);

      // Display a success message
      toast.success("User is now an admin!", { position: "top-right" });

      return response;
    } catch (error) {
      console.error("Component Error:", error);

      // Display an error message
      toast.error("Failed to make the user an admin", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleMakeAdmin)}>
        <label>
          User ID:
          <input
            type="number"
            {...register("userId", {
              setValueAs: (value) =>
                isNaN(value) ? undefined : parseInt(value),
            })}
            className="outline-none border-red border"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-charcoal text-white"
        >
          Make User Admin
        </button>
        {isLoading && <p>Loading...</p>}
        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
        {/* Display other form errors if needed */}
        {errors.userId && (
          <p style={{ color: "red" }}>{errors.userId.message}</p>
        )}
      </form>
    </div>
  );
};

export default MakeUserAdminButton;
