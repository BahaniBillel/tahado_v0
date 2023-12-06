import React from "react";
import { getClient } from "../../../../app/lib/client";
import { GET_ALL_ORDERS } from "../../../../graphql/querries";

async function page() {
  const client = getClient();
  // Use the client instance to query data for occasions
  const { data: ordersData } = await client.query({
    query: GET_ALL_ORDERS,
    fetchPolicy: "network-only",
    context: {
      fetchOptions: {
        next: { revalidate: 5 },
      },
    },
  });

  console.log(ordersData.orders);
  return (
    <div className="h-screen py-4 text-xs px-2">
      <table className="table-auto w-full text-left rounded-md  border border-lightGray">
        <thead className="bg-charcoal/80 text-turquoise font-light ">
          <tr className="capitalize ">
            <th className="p-2 whitespace-pre">order id</th>
            <th className="py-1 px-1 whitespace-pre ">order date</th>
            <th className="py-1 px-1 whitespace-pre ">Gift name</th>
            <th className="py-1  px-1 whitespace-pre">Quantity</th>
            <th className="py-1 px-1 whitespace-pre">user id</th>
            <th className="py-1 px-1  whitespace-pre">first name</th>
            <th className="py-1 px-1 whitespace-pre">last name</th>
            <th className="py-1 px-1 ">email</th>
            <th className="py-1 px-1 whitespace-pre">gifter message</th>
            <th className="py-1 px-1">recipient</th>
            <th className="py-1 px-1 whitespace-pre">total amount</th>
            <th className="py-1 px-1 whitespace-pre">wished gift date</th>
          </tr>
        </thead>
        <tbody className="mt-1">
          {ordersData.orders.map((order) => (
            <tr key={order.order_id} className="border border-lightGray ">
              <td className="p-2">{order.order_id}</td>
              <td className="py-2">
                {new Date(parseInt(order.order_date)).toLocaleDateString()}
              </td>
              <td className="py-2">{order.orderitems[0].product.giftname}</td>{" "}
              <td className="py-2">{order.orderitems[0].quantity}</td>{" "}
              {/* New line for giftname */}
              <td className="py-2">{order.user_id}</td>
              <td className="py-2">{`${order.user.first_name} `}</td>
              <td className="py-2">{`${order.user.last_name} `}</td>
              <td className="py-2">{`${order.user.email} `}</td>
              <td className="py-2">{order.gifter_message}</td>
              <td className="py-2">{order.recipient}</td>
              <td className="py-2">{order.total_amount}</td>
              <td className="py-2">
                {new Date(
                  parseInt(order.wished_gift_date)
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default page;
