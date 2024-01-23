"use client";
import React, { useEffect, useState } from "react";
import MiniCheckout from "../../../components/checkout/miniCheckout";
import { MdLock } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  resetItems,
  resetCart,
  setLastVisitedUrl,
  selectItems,
  selectCart,
  selectTotal,
  clearLastVisitedUrl,
  selectLastVisitedUrl,
} from "../../../../slices/basketSlice";
import { GET_ALL_ORDERS, GET_PROVIDERS } from "../../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";
import { useMutation, useQuery } from "@apollo/client";
import { getSession, useSession } from "next-auth/react";
import { Toaster, toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

function ShippingAdress() {
  // State and Redux Hook Initialization
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const subTotal = useSelector(selectTotal);
  const cart = useSelector(selectCart);
  const items = useSelector(selectItems);
  const [delivery, setDelivery] = useState(0);
  const [deliveryOptionId, setDeliveryOptionId] = useState(0);
  const [isItems, setIsItems] = useState(items);
  const [total, setTotal] = useState(cart);
  const [wilaya, setWilaya] = useState("");

  const formSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    wilaya: z.string().min(1, "Wilaya is required"),
    commune: z.string().min(1, "Commune is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email").optional(),
    mobile: z.string().min(1, "Mobile number is required"),
    notes: z.string().optional(),
    deliveryOption: z.number(),
  });

  // For use with React Hook Form
  const formValidationSchema = zodResolver(formSchema);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: formValidationSchema,
    defaultValues: {
      deliveryOption: "",
      // other default values...
    },
  });

  // GraphQL Queries and Mutations
  const {
    data: providersData,
    loading: providersLoading,
    error: providersError,
    refetch: refetchProviders,
  } = useQuery(GET_PROVIDERS, {
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  // Effect Hooks
  useEffect(() => {
    // Function to calculate the total
    const calculateTotal = () => {
      return items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    };

    // Update the total
    const newTotal = calculateTotal();
    // Dispatch an action to update the total in the store if necessary
    // dispatch(updateTotal(newTotal));

    console.log("New Total: ", newTotal);
    // You can also set local state if you don't want to keep total in Redux
    setTotal(newTotal);
  }, [items]); // Dependency on items, will recalculate when items change

  useEffect(() => {
    setIsItems(items);
  }, [items]);

  useEffect(() => {
    // Function to execute the desired action, for example, refetching the data
    const fetchData = () => {
      refetchOrders();
    };

    // Call the function
    fetchData();

    // Set up the polling (re-fetching) interval
    const interval = setInterval(fetchData, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [refetchOrders]); // Add any dependencies for useEffect here

  useEffect(() => {
    // Function to execute the desired action, for example, refetching the data
    const fetchProviders = () => {
      refetchProviders();
    };

    // Call the function
    fetchProviders();

    // Set up the polling (re-fetching) interval
    const interval = setInterval(fetchProviders, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [refetchProviders]); // Add any dependencies for useEffect here

  // USER ATHENTIFICATION
  const { data, status } = useSession();
  const firstName = data?.user?.first_name;
  const lastName = data?.user?.last_name;
  const userID = parseInt(data?.user?.id);
  const role = data?.user?.roles[0];
  const isAdmin = data?.user?.roles?.includes("admin");

  // Utility Functions

  // Handle change in deliveryOption
  const handleDeliveryOptionChange = (e) => {
    const selectedCost = parseFloat(e.target.value);
    const selectedOption = providersData.deliveryOptionsWithDetails.find(
      (option) => option.total_cost === selectedCost
    );
    if (selectedOption) {
      setDelivery(selectedOption.total_cost);
      setDeliveryOptionId(selectedOption.delivery_option_id);
      // Programmatically update the wilaya field
      setValue("wilaya", selectedOption.city, { shouldValidate: true });
    }
  };

  const notify = (message) => {
    if (ordersData.orders.length === 0) {
      toast.warning(message);
    }
  };

  if (!providersData) return <p>Loading...</p>;

  // Event Handler Functions

  const addToOrder = async (addToOrderInput) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");
    const mutation = `
  mutation AddToOrder($addToOrderInput: AddOrderItemInput!) {
  addToOrder(addToOrderInput: $addToOrderInput) {
    order {
      user_id
 
      recipient
      gifter_message
      sender
      flower_pocket
      user {
        phone_number
      }
    }
    orderItem {
      product_id
      quantity
      product {
        price
      }
    }
    shippingaddress {
      address
      city
      commune
    }
    delivery_option {
      delivery_option_id
    }
  }
}

    `;

    try {
      const response = await client.request(
        mutation,

        {
          addToOrderInput: addToOrderInput,
        }
      );
      console.log("Order Response:", response);
    } catch (error) {
      console.error("Order Submission Error:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);

    // Check if there are items in the basket
    if (isItems.length === 0) {
      notify(`No item in the basket`);
      return;
    }

    // If user is not signed in, redirect to sign-in and save the current URL
    if (!firstName) {
      dispatch(setLastVisitedUrl(pathname));
      router.push("/sign-in");
      return; // Stop further execution
    }

    // User is signed in, proceed to submit the order
    const addToOrderInput = isItems.map((item) => ({
      user_id: userID,
      product_id: item.product_id,
      sender: item.sender,
      recipient: item.recipient,
      flower_pocket: item.flower_pocket === "true", // Convert string to boolean
      gifter_message: item.gifter_message,
      quantity: item.quantity,
      price: item.price,
      address: data.address,
      city: data.wilaya,
      commune: data.commune,
      extra_info: data.notes,
      email: data.email,
      phone_number: data.mobile,
      delivery_option_id: deliveryOptionId,
    }));

    console.log("addToOrderInput:", addToOrderInput);

    try {
      // Submit each item in the order
      for (const orderItem of addToOrderInput) {
        await addToOrder(orderItem);
        console.log("orderItem :", orderItem);
      }

      // Notify the user of success
      toast.success("Order was successfully submitted");

      // Only reset the items if the order submission is successful
      dispatch(resetItems());

      router.push("/checkout/thanks");
    } catch (error) {
      console.error("Order Submission Error:", error);
      // Handle submission error
      // Consider not clearing the items here, so the user can try again
    }
  };

  // FETCH DATA FROM POSTGRES DATABASE USING QUERY

  // Render Logic
  if (ordersLoading || providersLoading) return <p>Loading...</p>;
  if (ordersError || providersError) return <p>Error</p>;

  // Calculate the total flower pocket charge
  const totalFlowerPocketCharge = isItems.reduce((total, item) => {
    return total + (item.flower_pocket === "true" ? 1200 : 0);
  }, 0);
  const subtotal = total + totalFlowerPocketCharge;
  const Alltotal = total + totalFlowerPocketCharge + delivery;

  //Logging

  console.log(providersData, deliveryOptionId);

  return (
    <div className="px-3 md:px-10 py-5">
      <p className="font-bold text-2xl text-right pr-16">
        أدخل عنوان التسليم الخاص بك
      </p>
      <div
        className="  flex  flex-col items-start md:grid grid-cols-5  max-h-full w-full 
      p-3 md:p-5  rounded-md bg-white"
      >
        <section className="flex flex-col items-center justify-center  py-5 col-span-2 order-1  w-full  ">
          <div className="w-full px-5 bg-lightGray/60 py-5">
            <div>
              {isItems.length
                ? isItems.map((order, i) => (
                    <MiniCheckout
                      key={i}
                      productId={order.product_id} //
                      name={`${order.giftname}`}
                      productImage={order.main_image}
                      price={`${order.price}`}
                      amount={`${order.quantity * order.price}`}
                      sender={order.sender}
                      flower_pocket={
                        order.flower_pocket === "true" ? true : false
                      }
                      recipient={order.recipient}
                      quantity={order.quantity}
                      isCheckout={true}
                    />
                  ))
                : "There is no items"}
            </div>
            {/* Delivery */}
            <div className="my-5 pt-5  flex flex-col flex-nowrap space-y-5">
              <div className="flex flex-row flex-nowrap items-center w-full ">
                <p>
                  <span>دج</span> {cart.length ? subtotal : null}
                </p>
                <p className="flex flex-grow"></p>
                <p>المجموع الفرعي </p>
              </div>
            </div>
            {/* Flower fee */}
            <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5 ">
              <div className="flex flex-row flex-nowrap items-center w-full ">
                <div>{delivery}</div>
                <div className="flex flex-grow"></div>
                <p> سعر التوصيل </p>
              </div>
            </div>

            {/* Sub-total */}

            <div className=" font-bold border-t pt-3 flex flex-row flex-nowrap items-center w-full ">
              <p>
                <span>دج</span> {cart.length ? Alltotal : null}
              </p>
              <p className="flex flex-grow"></p>
              <p>المجموع </p>
            </div>

            <div className="flex flex-grow"></div>
          </div>
        </section>
        <section className="col-span-3 order-2 w-full bg-white px-5 py-5 rounded-md text-right ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-3 items-start md:px-10 w-full"
          >
            {/* Delivery Option */}
            <div className="flex flex-col items-start space-y-1 w-full">
              <label className="flex flex-row justify-center items-center whitespace-pre w-full">
                Option de Livraison
                <label className="flex flex-grow"></label>
                <label>خيارات التوصيل</label>
              </label>

              <select
                {...register("deliveryOption", {
                  setValueAs: (value) => parseFloat(value),
                })}
                className="input w-full"
                onChange={handleDeliveryOptionChange}
              >
                <option value="">Select a provider</option>
                {providersData.deliveryOptionsWithDetails.map(
                  (option, index) => (
                    <option key={index} value={option.total_cost}>
                      {`${option.provider_name} - ${option.city} - ${option.total_cost}`}
                    </option>
                  )
                )}
              </select>

              {errors.deliveryOption && <p>{errors.deliveryOption.message}</p>}
            </div>

            {/* fullname */}
            <div className="flex flex-col items-start space-y-1 w-full">
              <label
                htmlFor="fullname"
                className="flex flex-row justify-center items-center whitespace-pre w-full"
              >
                Nom Complet
                <label className="flex flex-grow"></label>
                <label>الاسم الكامل</label>
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Ecrir votre nom et prenom ici..."
                {...register("fullname")}
                className="input w-full"
                required
              />
              {errors.fullname && <p>{errors.fullname.message}</p>}
            </div>

            {/* wilaya et commune */}
            <div className="flex flex-row items-center space-x-3 w-full">
              {/* Wilaya */}
              <div className="w-1/2">
                <label
                  htmlFor="wilaya"
                  className="flex flex-row justify-center items-center whitespace-pre"
                >
                  Wilaya
                  <label className="flex flex-grow"></label>
                  <label>ولاية</label>
                </label>
                <select
                  {...register("wilaya")}
                  className="input w-full"
                  disabled // This field is disabled but part of the form submission
                >
                  {providersData.deliveryOptionsWithDetails.map(
                    (option, index) => (
                      <option key={index} value={option.city}>
                        {option.city}
                      </option>
                    )
                  )}
                </select>
                {errors.wilaya && <p>{errors.wilaya.message}</p>}
              </div>

              <div className="flex flex-grow"></div>

              {/* Commune */}
              <div className="w-1/2">
                <label
                  htmlFor="commune"
                  className="flex flex-row justify-center items-center whitespace-pre"
                >
                  Commune
                  <label className="flex flex-grow"></label>
                  <label>البلدية</label>
                </label>
                <input
                  type="text"
                  id="commune"
                  {...register("commune")}
                  className="input w-full"
                  required
                />
                {errors.commune && <p>{errors.commune.message}</p>}
              </div>
            </div>

            {/* address */}
            <div className="flex flex-col items-start space-y-1 w-full">
              <label
                htmlFor="address"
                className="flex flex-row justify-center items-center whitespace-pre w-full"
              >
                Adresse
                <label className="flex flex-grow"></label>
                <label>العنوان</label>
              </label>
              <input
                {...register("address")}
                type="text"
                name="address"
                id="address"
                className="input w-full"
                required
              />
              {errors.address && <p>{errors.address.message}</p>}
            </div>

            {/* email */}
            <div className="flex flex-row items-center space-x-3 w-full">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="flex flex-row justify-center items-center whitespace-pre"
                >
                  Votre email
                  <label className="flex flex-grow"></label>
                  <label>البريد الإلكتروني</label>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="input w-full"
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
            </div>

            {/* Mobile number */}
            <div className="flex flex-row items-center justify-end space-x-3 w-full">
              <div className="w-4/6">
                <label
                  htmlFor="mobile"
                  className="flex flex-row justify-center items-center whitespace-pre"
                >
                  Numéro Telephone
                  <label className="flex flex-grow"></label>
                  <label>رقم الهاتف</label>
                </label>
                <input
                  type="text"
                  id="mobile"
                  {...register("mobile")}
                  className="input w-full"
                  required
                />
                {errors.mobile && <p>{errors.mobile.message}</p>}
              </div>
            </div>

            {/* Extra info */}
            <div className="flex flex-row items-center justify-end space-x-3 w-full">
              <div className="w-4/6">
                <label
                  htmlFor="notes"
                  className="flex flex-row justify-center items-center whitespace-pre"
                >
                  Autres Informations
                  <label className="flex flex-grow"></label>
                  <label>معلومات أخرى</label>
                </label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="input w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className=" w-full flex flex-row flex-nowrap justify-center items-center space-x-2 py-3 text-white hover:text-charcoal font-semibold bg-charcoal 
          text-xl hover:bg-lightPink transition-all ease-in-out duration-50  mt-10"
              type="submit"
            >
              <MdLock className="text-black h-10 cursor-pointer " />
              <p>Confirmer la commande</p>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ShippingAdress;
