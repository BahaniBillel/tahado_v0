"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import GoogleSignInButton from "../GoogleSignInButton";
import Link from "next/link";
import { gql, GraphQLClient } from "graphql-request";
import { toast } from "sonner";

// Create Zod schema
const userSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Invalid phone number"),
  password_hash: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

interface CreateUserResponse {
  createUser: {
    phone_number: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
  };
}

const RegisterForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Graphql Implementations

  // const createUser = async (userDataInput) => {
  //   const client = new GraphQLClient("http://localhost:3001/graphql");
  //   const mutation = gql`
  //     mutation Mutation($userDataInput: UserDataInput!) {
  //       createUser(userDataInput: $userDataInput) {
  //         phone_number
  //         password_hash
  //         first_name
  //         last_name
  //       }
  //     }
  //   `;

  //   try {
  //     const data = await client.request(mutation, { userDataInput });
  //     console.log("user created successfully:");
  //     toast.success("user created successfully");
  //     return data.createUser; // Return the created user data
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     toast.error("Something went wrong while creating the user");
  //     throw error; // Rethrow the error to handle it in handleSubmit
  //   }
  // };

  const createUser = async (userDataInput) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");
    const mutation = gql`
      mutation Mutation($userDataInput: UserDataInput!) {
        createUser(userDataInput: $userDataInput) {
          phone_number
          password_hash
          first_name
          last_name
        }
      }
    `;

    try {
      const data = await client.request<CreateUserResponse>(mutation, {
        userDataInput,
      });
      console.log("user created successfully:");
      toast.success("user created successfully");
      return data.createUser;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Something went wrong while creating the user");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = userSchema.parse(formData);
      const user = await createUser(parsedData);

      // Check if user is returned
      if (user) {
        setFormData({}); // Clear the form after successful submission
        setErrors({});
        router.push("/thankyou");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach(({ path, message }) => {
          newErrors[path[0]] = message;
        });
        setErrors(newErrors);
      } else if (error.response && error.response.errors) {
        // Handle specific error from GraphQL response
        const graphqlErrors = error.response.errors;
        graphqlErrors.forEach((err) => {
          if (err.message.includes("phone number already exists")) {
            // Handle the phone number already exists error
            setErrors((prevErrors) => ({
              ...prevErrors,
              phone_number: "This phone number is already registered",
            }));
            toast.error("This phone number is already registered");
          } else if (err.message.includes("email already exists")) {
            // Handle the email already exists error
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "This email is already registered",
            }));
            toast.error("This email is already registered");
          } else {
            toast.error("Something went wrong while creating the user");
          }
        });
      } else {
        console.error("Error creating user:", error);
        toast.error("Something went wrong while creating the user");
      }
    }
  };

  return (
    <div
      className="max-w-fit  min-h-screen h-full w-full  bg-lightGray  flex flex-col items-center justify-center flex-nowrap 
  p-6 rounded-md"
    >
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign Up
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm  space-y-3">
            {/* phone number */}
            <div>
              <label htmlFor="phone_number" className="sr-only">
                phone_number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="phone_number"
                required
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-5"
                placeholder="votre numero"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password_hash"
                type="password"
                required
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-5"
                placeholder="Password"
              />
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="sr-only">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-5"
                placeholder="First Name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="sr-only">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-5"
                placeholder="Last Name"
              />
            </div>

            {/* More fields can be added here */}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm
               font-medium rounded-md text-white bg-charcoal hover:bg-charcoal focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-charcoal/80"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div
          className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 
        before:block before:h-px before:flex-grow before:bg-charcoal 
        after:ml-4 after:block after:h-px after:flex-grow after:bg-charcoal"
        >
          or
        </div>
        <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you don&apos;t have an account, please&nbsp;
          <Link className="text-turquoise hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
