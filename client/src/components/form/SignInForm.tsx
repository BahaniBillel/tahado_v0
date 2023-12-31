"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  selectLastVisitedUrl,
  clearLastVisitedUrl,
  setLastVisitedUrl,
  selectLastLikedItem,
} from "../../../slices/basketSlice";
import { useSelector, useDispatch } from "react-redux";

import { GET_USERS } from "../../graphql/querries";
import { useMutation, useQuery } from "@apollo/client";
import { GraphQLClient, gql } from "graphql-request";

const FormSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Invalid phone number"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, status, update } = useSession();
  const lastVisitedUrl = useSelector(selectLastVisitedUrl);
  const lastLikedItem = useSelector(selectLastLikedItem);
  const productId = parseInt(lastLikedItem);
  console.log("lastvisit☺edUrl from sigin:", lastVisitedUrl);
  console.log("lastLikedItem from sigin:", lastLikedItem);

  console.log("checking data from useSession", data);

  // Checking if the user is admin
  const isAdmin = data?.user?.roles?.includes("admin");
  console.log("chcking if the user has admin previliges", isAdmin);

  // GraphQL Query to get users data

  const { data: usersData, refetch: refetchUsers } = useQuery(GET_USERS);
  console.log(usersData);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });

  const AddLike = async (userId) => {
    // Initialize GraphQLClient
    const client = new GraphQLClient("http://localhost:3001/graphql");

    // Define the GraphQL mutation
    const mutation = gql`
      mutation CreateWishItem($wishData: WishInput!) {
        createWishItem(wishData: $wishData) {
          wishlist {
            wishlist_id
          }
          product {
            gift_id
          }
        }
      }
    `;

    // Construct the wishData object
    const wishData = {
      user_id: userId, // GET IT FROM AUTH ONCE USER IS SIGNEDIN
      product_id: productId, // GET IT FROM REDUX STORE
    };

    try {
      // If the product is not currently liked, add it to the wishlist
      if (userId) {
        const response = await client.request(mutation, { wishData });

        return response;
      }
    } catch (error) {
      console.error("Error in ToggleLikes:", error);
      // Handle error
    }
  };

  function findUserByPhoneNumber(phoneNumber: string) {
    const users = usersData.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].phone_number === phoneNumber) {
        return users[i];
      }
    }
    return null; // Return null if no user with the given phone number is found
  }

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      phone_number: values.phone_number,
      password: values.password,
      redirect: false,
    });

    const user = findUserByPhoneNumber(values.phone_number);
    const userId = parseInt(user.user_id);

    if (user && signInData) {
      console.log("User found:", user.phone_number);
      await AddLike(userId);
    } else {
      console.log("No user found with phone number:", values.phone_number);
    }

    if (signInData?.error) {
      console.log(signInData.error);
    } else {
      if (lastVisitedUrl === "/checkout") {
        router.push(lastVisitedUrl);
        dispatch(clearLastVisitedUrl());
      } else {
        if (isAdmin) {
          router.push("/admin");
          router.refresh();
        } else {
          router.push("/");
          router.refresh();
        }
      }
    }
  };

  return (
    <div
      className="max-w-md  min-h-screen h-full  bg-lightGray  flex flex-col items-center justify-center flex-nowrap 
    p-6 rounded-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder=" votre numero" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6 bg-charcoal text-white" type="submit">
            Sign in
          </Button>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-charcoal after:ml-4 after:block after:h-px after:flex-grow after:bg-charcoal">
          or
        </div>
        <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you don&apos;t have an account, please&nbsp;
          <Link className="text-turquoise hover:underline" href="/register">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;
