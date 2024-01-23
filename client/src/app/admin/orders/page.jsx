import Link from "next/link";
import React from "react";

function AddOrder() {
  return (
    <div
      className="flex flex-col justify-start items-start w-screen max-w-screen
    h-screen max-h-screen p-3"
    >
      <div>
        <h1 className="text-2xl font-bold ">Orders Management</h1>
      </div>
      <div className="flex flex-row space-x-3 text-sm">
        <Link href="/admin/orders/add" className="button">
          Add
        </Link>
        <Link href="/admin/orders/new" className="button">
          New Orders
        </Link>
        <Link href="/admin/orders/pending" className="button">
          Pending
        </Link>
        <Link href="/admin/orders/completed" className="button">
          Completed
        </Link>
        <Link href="/admin/orders/returned" className="button">
          Returned
        </Link>
      </div>
    </div>
  );
}

export default AddOrder;
