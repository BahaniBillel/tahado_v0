"use client";
import React from "react";
import Reset from "./resetStore";

import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("dashboard");

  const renderContent = () => {
    switch (selectedOption) {
      case "dashboard":
        return <div>Dashboard Content</div>;
      case "add-product":
        return <div>Add New Product Form</div>;
      case "orders":
        return <div>Order List</div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-20 text-white bg-indigo-600">
          Admin Panel
        </div>
        <ul>
          <li
            className="p-4 hover:bg-gray-100"
            onClick={() => setSelectedOption("dashboard")}
          >
            Dashboard
          </li>
          <li
            className="p-4 hover:bg-gray-100"
            onClick={() => setSelectedOption("add-product")}
          >
            Add New Product
          </li>
          <li
            className="p-4 hover:bg-gray-100"
            onClick={() => setSelectedOption("orders")}
          >
            Orders
          </li>
          <li className="p-4 hover:bg-gray-100">
            <Reset />
          </li>
          {/* Add more sidebar items here */}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-10 text-2xl font-semibold">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
