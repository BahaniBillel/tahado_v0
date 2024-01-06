"use client";
import React, { useEffect, useState } from "react";

import CheckoutProduct from "../../components/checkout/checkoutProduct";
import MyToggle from "../../components/checkout/MyToggle";

import { useDispatch, useSelector } from "react-redux";
import {
  resetItems,
  setLastVisitedUrl,
  selectItems,
  selectTotal,
  clearLastVisitedUrl,
  selectLastVisitedUrl,
} from "../../../slices/basketSlice";
import { GET_ALL_ORDERS } from "../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";
import { useMutation, useQuery } from "@apollo/client";
import { getSession, useSession } from "next-auth/react";
import { Toaster, toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

function Checkout() {
  const dispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  const subTotal = useSelector(selectTotal);
  const items = useSelector(selectItems);
  const [delivery, setDelivery] = React.useState(0);
  const [wilaya, setWilaya] = React.useState("");
  const [livraison, setLivraison] = React.useState(0);
  const [isItems, setIsItems] = useState(items);
  const [enabled, setEnabled] = useState(false);

  console.log("isItems", isItems);
  console.log("items", items);

  const [order, setOrder] = React.useState({});

  const wilayaDelivery = [
    {
      id: 1,
      name: "01-Algers",
      price: 0,
    },
    {
      id: 2,
      name: "02-Chlef",
      price: 800,
    },
    {
      id: 9,
      name: "09-Blida",
      price: 1000,
    },
  ];

  const [selectedWilaya, setSelectedWilaya] = React.useState(null);

  useEffect(() => {
    setIsItems(items);
  }, [items]);

  console.log("isItems :", isItems);
  useEffect(() => {
    if (wilayaDelivery) {
      const foundWilaya = wilayaDelivery.find((w) => w.name === wilaya);
      setSelectedWilaya(foundWilaya);
    }
  }, [wilaya, wilayaDelivery]);

  // const livraison = wilaya ? delivery : 0;
  const total = Number(subTotal) + Number(livraison);

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

  const SubmitOrderToDatabase = async (e, total, delivery) => {
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

  const HandleWilayaChange = (e) => {
    setWilaya(e.target.value);
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
  return (
    <div className="px-3 md:px-10 py-5">
      <p className="font-bold text-2xl text-right ">: سلة الهدايا </p>
      <div className="  flex  flex-col items-start md:grid grid-cols-2  max-h-full w-full p-3 md:p-5 font-sans rounded-md bg-lightGray">
        <section className="flex flex-col items-center justify-center  py-5 col-span-1 order-1 w-full ">
          <MyToggle
            initialEnabled={true}
            onToggle={(state) => setEnabled(state)}
            enabledColor="bg-green-500"
            disabledColor="bg-red-500"
            ariaLabel="Enable feature"
          />

          {enabled ? (
            <form className="    flex flex-col space-y-3 items-start  md:px-10  w-full ">
              <h1 className="text-xl md:text-2xl text-charcoal font-semibold py-4">
                Enter your delivery address
              </h1>

              {/* fullname */}
              <div className="flex flex-col items-start space-y-1 w-full">
                <label
                  for="fullname"
                  className=" flex flex-row justify-center items-center whitespace-pre w-full "
                >
                  Nom Complet
                  <label className="flex flex-grow"></label>
                  <label className="">الاسم الكامل</label>
                </label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Ecrir votre nom et prenom ici..."
                  className="input  w-full  "
                  required
                />
              </div>

              {/* wilaya et commune */}
              <div className="flex flex-row items-center space-x-3 w-full">
                <div className="w-1/2">
                  <label
                    for="wilaya"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Wilaya
                    <label className="flex flex-grow"></label>
                    <label className="">ولاية</label>
                  </label>
                  <select
                    id="wilaya"
                    name="wilaya"
                    className="input w-full"
                    required
                    onChange={HandleWilayaChange}
                  >
                    {wilayaDelivery.map((wilaya) => {
                      return (
                        <option key={wilaya.id} value={wilaya.name}>
                          {wilaya.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-grow"></div>
                <div className="w-1/2">
                  <label
                    for="commune"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Commune
                    <label className="flex flex-grow"></label>
                    <label className="">البلدية</label>
                  </label>
                  <input
                    type="text"
                    id="commune"
                    className="input w-full "
                    required
                  />
                </div>
              </div>
              {/* Livraison */}
              <div className=" flex-row items-center space-x-3 w-full hidden">
                <div className="w-1/2">
                  <label
                    for="price"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Livraison
                    <label className="flex flex-grow"></label>
                    <label className="">السعر</label>
                  </label>
                  <select
                    id="livraison"
                    name="livraison"
                    className="input w-full"
                    disabled
                    onChange={(e) => setDelivery(e.target.value)}
                  >
                    {wilayaDelivery
                      .filter((wilayaObj) => wilayaObj.name === wilaya)
                      .map((wilayaObj) => (
                        <option key={wilayaObj.id} value={wilayaObj.price}>
                          {wilayaObj.price}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* address */}
              <div className="flex flex-col items-start space-y-1 w-full">
                <label
                  for="address"
                  className=" flex flex-row justify-center items-center whitespace-pre w-full "
                >
                  Adresse
                  <label className="flex flex-grow"></label>
                  <label className="">العنوان</label>
                </label>
                <input
                  type="text"
                  id="address"
                  className=" input  w-full  "
                  required
                />
              </div>
              {/* email */}
              <div className="flex flex-row items-center space-x-3 w-full">
                <div className="w-full">
                  <label
                    for="email"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Votre email
                    <label className="flex flex-grow"></label>
                    <label className="">البريد الإلكلتروني </label>
                  </label>
                  <input type="text" id="email" className="input  w-full " />
                </div>
              </div>
              {/* Mobile number */}
              <div className="flex flex-row items-center space-x-3 w-full">
                <div className="w-4/6">
                  <label
                    for="mobile"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Numéro Telephone
                    <label className="flex flex-grow"></label>
                    <label className="">رقم الهاتف</label>
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    className="input  w-full "
                    required
                  />
                </div>
              </div>

              {/* Extra info */}
              <div className="flex flex-row items-center space-x-3 w-full">
                <div className="w-4/6">
                  <label
                    for="notes"
                    className=" flex flex-row justify-center items-center whitespace-pre "
                  >
                    Autres Informations
                    <label className="flex flex-grow"></label>
                    <label className="">معلومات أخرى </label>
                  </label>
                  <textarea type="text" id="notes" className="input  w-full " />
                </div>
              </div>

              <div className="flex flex-grow"></div>
              <button
                className=" w-full py-3 text-white font-semibold bg-charcoal 
          text-xl hover:scale-95 transition-all ease-in-out duration-150 rounded-md"
                onClick={(e) => SubmitOrderToDatabase(e, total, delivery)}
              >
                Confirmer la commande
              </button>
            </form>
          ) : (
            "recepient"
          )}
        </section>
        <section className="col-span-1 order-2 bg-white px-5 py-5 rounded-md ">
          <p className="font-bold text-xl py-2">
            {isItems.length ? "Vous avez Commandé :" : "There is no items"}
          </p>
          <div>
            {isItems.map((order, i) => (
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
            ))}
          </div>
          {/* Flower fee */}
          <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5">
            <div className="flex flex-row flex-nowrap items-center w-full ">
              <p>
                {totalFlowerPocketCharge} <span>DA</span>
              </p>
              <p className="flex flex-grow"></p>
              <p>باقة زهور </p>
            </div>
          </div>
          {/* Delivery */}
          <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5">
            <div className="flex flex-row flex-nowrap items-center w-full ">
              <p>
                {subTotal} <span>DA</span>
              </p>
              <p className="flex flex-grow"></p>
              <p>المجموع الفرعي </p>
            </div>
            <div className="flex flex-row flex-nowrap items-center w-full ">
              <p>
                {items.length ? livraison : null} <span>DA</span>
              </p>
              <p className="flex flex-grow"></p>
              <p>تكاليف التوصيل</p>
            </div>

            <div className=" font-bold border-t pt-3 flex flex-row flex-nowrap items-center w-full ">
              <p>
                <span>دج</span> {items.length ? total : null}
              </p>
              <p className="flex flex-grow"></p>
              <p>المجموع </p>
            </div>
            <div>
              <p className="text-xl font-semibold">Livraison | التوصيل</p>
              <div className=" text-sm flex flex-col space-y-2">
                <p>
                  Est et Ouest : 24 H-72h (Oum Bouaghi - Souk Ahras : 1j-4j)
                </p>
                <p>Centre : 24h-48h</p>
                <p>Alger : 24h</p>
                <p>Blida : jour meme</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
