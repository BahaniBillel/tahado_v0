"use client";
import React, { useEffect, useState } from "react";
import { selectItems, selectTotal } from "../../../slices/basketSlice";
import { useSelector } from "react-redux";
import CheckoutProduct from "../../components/checkout/checkoutProduct";

import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { resetItems } from "../../../slices/basketSlice";
import { GET_ALL_ORDERS } from "../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";
import { useMutation, useQuery } from "@apollo/client";

function Checkout() {
  const dispatch = useDispatch();
  const subTotal = useSelector(selectTotal);
  const items = useSelector(selectItems);
  const [delivery, setDelivery] = React.useState(0);
  const [wilaya, setWilaya] = React.useState("");
  const [livraison, setLivraison] = React.useState(0);

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
    if (wilayaDelivery) {
      const foundWilaya = wilayaDelivery.find((w) => w.name === wilaya);
      setSelectedWilaya(foundWilaya);
    }
  }, [wilaya, wilayaDelivery]);

  // const livraison = wilaya ? delivery : 0;
  const total = Number(subTotal) + Number(livraison);

  const HandleOrder = async (e, total, delivery) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const commune = document.getElementById("commune").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const notes = document.getElementById("notes").value;
    const wilaya = document.getElementById("wilaya").value;
    const livraison = document.getElementById("livraison").value;

    // Check if required fields are empty
    if (!fullname || !commune || !address || !mobile || !wilaya) {
      // Handle the fallback logic (e.g., show an error message)

      notify();
      return;
    }

    const timestamp = Date.now(); // Generate a timestamp
    const uniqueFullname = `${fullname}_${timestamp}`; // Append timestamp to fullname

    const orderItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));

    const newOrder = {
      name: fullname,
      price: subTotal,
      wilaya,
      livraison,
      total,
      orderItems,
      date: Timestamp.now(),
      commune: commune,
      address: address,
      email: email,
      mobile: mobile,
      notes: notes,
    };

    try {
      // Store the order details in the database
      await setDoc(doc(db, "orders", uniqueFullname), newOrder);
      setOrder(newOrder);
      // Decreasing stock from firebase
      for (const item of orderItems) {
        const { name, quantity } = item;

        // Retrieve the document from Firestore
        const itemDocRef = doc(db, "products", name);
        let itemDoc;

        try {
          itemDoc = await getDoc(itemDocRef);
        } catch (error) {
          console.error("Error retrieving document:", error);
          continue; // Skip to the next iteration if there's an error
        }

        if (itemDoc.exists()) {
          // Subtract the quantity from the sku value
          const sku = itemDoc.data().sku - quantity;

          console.log(quantity, itemDoc.data().sku);

          // Update the Firestore document with the new sku value
          await updateDoc(itemDoc.ref, { sku });
        } else {
          console.error("Document does not exist:", name);
          continue; // Skip to the next iteration if the document doesn't exist
        }
      }

      // Clear the form fields after submission
      document.getElementById("fullname").value = "";
      document.getElementById("commune").value = "";
      document.getElementById("address").value = "";
      document.getElementById("email").value = "";
      document.getElementById("mobile").value = "";
      document.getElementById("notes").value = "";
      document.getElementById("wilaya").value = "";
      document.getElementById("livraison").value = "";
      // Dispatch the resetItems action to empty the items array
      dispatch(resetItems());
      // redirect to thank you page
      router.push("/thankyou");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  // Notifying the dispatched product
  const notify = () => {
    toast.info(` "Veuillez remplir tous les champs obligatoires"`, {
      position: toast.POSITION.TOP_LEFT,
      className: "foo-bar text-xs font-light",
    });
  };

  const HandleWilayaChange = (e) => {
    setWilaya(e.target.value);
  };

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

  function formatTimestamp(timestampString) {
    // Convert the string to a number
    const timestamp = parseInt(timestampString);

    // Create a new Date object
    const date = new Date(timestamp);

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return (
    <div className="px-3 md:px-10 py-5">
      <p className="font-bold text-2xl text-right ">: سلة الهدايا </p>
      <div className="  flex  flex-col items-start md:grid grid-cols-2  max-h-full w-full p-3 md:p-5 font-sans rounded-md bg-lightGray">
        <section className="flex flex-col items-center justify-center  py-5 col-span-1 order-1 w-full ">
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
              onClick={(e) => HandleOrder(e, total, delivery)}
            >
              Confirmer la commande
            </button>
          </form>
        </section>
        <section className="col-span-1 order-2 bg-white px-5 py-5 rounded-md ">
          <p className="font-bold text-xl py-2">
            {ordersData.orders.length
              ? "Vous avez Commandé :"
              : "There is no items"}
          </p>
          <div>
            {ordersData.orders.map((order) => (
              <CheckoutProduct
                key={order.order_id}
                orderId={order.order_id}
                name={`${order.orderitems[0].product.giftname}`}
                productImage={order.orderitems[0].product.main_image}
                price={`${order.orderitems[0].product.price}`}
                amount={order.total_amount}
                recipient={order.recipient}
                quantity={order.orderitems[0].quantity}
                gifting_date={formatTimestamp(order.wished_gift_date)}
                isCheckout={true}
              />
            ))}
          </div>

          <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5">
            <div className="flex flex-row flex-nowrap items-center w-full ">
              <p>Sous-Total </p>
              <p className="flex flex-grow"></p>
              <p>
                {subTotal} <span>DA</span>
              </p>
            </div>
            <div className="flex flex-row flex-nowrap items-center w-full ">
              <p>Livraison</p>
              <p className="flex flex-grow"></p>
              <p>
                {items.length ? livraison : null} <span>DA</span>
              </p>
            </div>

            <div className=" font-bold border-t pt-3 flex flex-row flex-nowrap items-center w-full ">
              <p>Total </p>
              <p className="flex flex-grow"></p>
              <p>
                {items.length ? total : null} <span>DA</span>
              </p>
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
