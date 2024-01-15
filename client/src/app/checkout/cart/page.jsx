"use client";
import React, { useEffect, useState } from "react";

import CheckoutProduct from "../../../components/checkout/checkoutProduct";
import { MdLock } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import {
  resetItems,
  setLastVisitedUrl,
  selectItems,
  receiveFromCart,
  selectTotal,
  clearLastVisitedUrl,
  selectLastVisitedUrl,
} from "../../../../slices/basketSlice";
import { GET_ALL_ORDERS } from "../../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";
import { useMutation, useQuery } from "@apollo/client";
import { getSession, useSession } from "next-auth/react";
import { Toaster, toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const items = useSelector(selectItems);

  const [isItems, setIsItems] = useState(items);
  const [total, setTotal] = useState(items);

  console.log("isItems", isItems);
  console.log("items", items);

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

  console.log("isItems :", isItems);

  // const total = Number(subTotal);

  const addToOrder = async (addToOrderInput) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");
    const mutation = `
      mutation AddToOrder($addToOrderInput: AddOrderItemInput!) {
        addToOrder(addToOrderInput: $addToOrderInput) {
          order {
            user_id
            order_date
            sender
            flower_pocket
            recipient
            gifter_message
          
          }
          orderItem {
            product_id
            quantity
            product {
              price
            }
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

  const SubmitOrderToDatabase = async (e) => {
    e.preventDefault();

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
    }));

    try {
      // Submit each item in the order
      for (const orderItem of addToOrderInput) {
        // await addToOrder(orderItem);
        dispatch(receiveFromCart(orderItem));
        console.log("orderItem :", orderItem);
      }

      // Notify the user of success
      toast.success("Order was successfully submitted");

      // Only reset the items if the order submission is successful
      // dispatch(resetItems());

      router.push("/checkout/shipping-address");
    } catch (error) {
      console.error("Order Submission Error:", error);
      // Handle submission error
      // Consider not clearing the items here, so the user can try again
    }
  };

  // USER ATHENTIFICATION
  const { data, status } = useSession();

  const firstName = data?.user?.first_name;
  const lastName = data?.user?.last_name;
  const userID = parseInt(data?.user?.user_id);
  const role = data?.user?.roles[0];
  // Checking if the user is admin
  const isAdmin = data?.user?.roles?.includes("admin");

  // GRAPHQL SETUP
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch,
  } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  useEffect(() => {
    // Function to execute the desired action, for example, refetching the data
    const fetchData = () => {
      refetch();
    };

    // Call the function
    fetchData();

    // Set up the polling (re-fetching) interval
    const interval = setInterval(fetchData, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [refetch]); // Add any dependencies for useEffect here

  // Render your component based on the state of the query
  if (ordersLoading) return <p>Loading...</p>;
  if (ordersError) return <p>Error :(</p>;

  // console.log(ordersData.orders);

  console.log(ordersData);
  // Notifying the dispatched product
  const notify = (message) => {
    if (ordersData.orders.length === 0) {
      toast.warning(message);
    }
  };

  // Calculate the total flower pocket charge
  const totalFlowerPocketCharge = isItems.reduce((total, item) => {
    return total + (item.flower_pocket === "true" ? 1200 : 0);
  }, 0);
  const subtotal = total + totalFlowerPocketCharge;

  return (
    <div className="px-3 md:px-10 py-5">
      <p className="font-bold text-2xl text-right ">: سلة الهدايا </p>
      <div
        className="  flex  flex-col items-start md:grid grid-cols-5  max-h-full w-full 
      p-3 md:p-5  rounded-md bg-white"
      >
        <section className="flex flex-col items-center justify-center  py-5 col-span-2 order-1  w-full  ">
          <div className="w-full px-10 bg-lightGray/60 py-5">
            {/* Delivery */}
            <div className="my-5 pt-5  flex flex-col flex-nowrap space-y-5">
              <div className="flex flex-row flex-nowrap items-center w-full ">
                <p>
                  {total} <span>DA</span>
                </p>
                <p className="flex flex-grow"></p>
                <p>مجموع الهدايا </p>
              </div>
            </div>
            {/* Flower fee */}
            <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5 ">
              <div className="flex flex-row flex-nowrap items-center w-full ">
                <p>
                  {totalFlowerPocketCharge} <span>DA</span>
                </p>
                <p className="flex flex-grow"></p>
                <p>باقة زهور </p>
              </div>
            </div>

            {/* Sub-total */}

            <div className=" font-bold border-t pt-3 flex flex-row flex-nowrap items-center w-full ">
              <p>
                <span>دج</span> {items.length ? subtotal : null}
              </p>
              <p className="flex flex-grow"></p>
              <p>المجموع الفرعي </p>
            </div>

            <div className="flex flex-grow"></div>
            <button
              className=" w-full flex flex-row flex-nowrap justify-center items-center space-x-2 py-3 text-white hover:text-charcoal font-semibold bg-charcoal 
          text-xl hover:bg-lightPink transition-all ease-in-out duration-50  mt-10"
              onClick={(e) => SubmitOrderToDatabase(e)}
            >
              <MdLock className="text-black h-10 cursor-pointer " />
              <p>Confirmer la commande</p>
            </button>
          </div>
        </section>
        <section className="col-span-3 order-2  bg-white px-5 py-5 rounded-md ">
          <div>
            {isItems.length
              ? isItems.map((order, i) => (
                  <CheckoutProduct
                    key={order.product_id}
                    productId={order.product_id} //
                    name={`${order.giftname}`}
                    productImage={order.main_image}
                    price={`${order.price}`}
                    amount={`${order.quantity * order.price}`}
                    sender={order.sender}
                    flower_pocket={order.flower_pocket}
                    recipient={order.recipient}
                    quantity={order.quantity}
                    isCheckout={true}
                  />
                ))
              : "There is no items"}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Cart;
