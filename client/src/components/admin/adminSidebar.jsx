"use client";
// components/Sidebar.js
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";
import React from "react";

const Sidebar = () => {
  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setUsersDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setUsersDropdownOpen(false);
  };

  const handleDropdownMouseEnter = () => {
    // Prevent closing the dropdown when moving to the dropdown itself
    clearTimeout(closeTimer);
  };

  const handleDropdownMouseLeave = () => {
    // Close the dropdown after a delay
    closeTimer = setTimeout(() => {
      setUsersDropdownOpen(false);
    }, 300); // Adjust the delay as needed
  };

  // Clear the timeout when the component unmounts
  useEffect(() => {
    return () => clearTimeout(closeTimer);
  }, []);

  let closeTimer;

  return (
    <div
      className="bg-gray-800 text-white p-4 flex flex-col justify-start
     min-h-screen h-full bg-charcoal relative" // Add relative positioning
    >
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <Link
        className="bg-turquoise text-charcoal px-4 py-2  mb-2 hover:bg-lightGray duration-150 ease-in-out"
        href={"/admin/addgift/initial_info"}
      >
        Add new gift
      </Link>
      <Link
        className="bg-turquoise  text-charcoal px-4 py-2 mb-2 hover:bg-lightGray duration-150 ease-in-out"
        href={"/admin/resetredux"}
      >
        Reset redux store
      </Link>
      <Link
        className="bg-turquoise  text-charcoal px-4 py-2  mb-2 hover:bg-lightGray duration-150 ease-in-out"
        href={"/admin/addcraftman"}
      >
        Add craftman
      </Link>
      <Link
        className="bg-turquoise  text-charcoal px-4 py-2  mb-2 hover:bg-lightGray duration-150 ease-in-out"
        href={"/admin/addoccasion"}
      >
        Add new occasion
      </Link>
      <Link
        className="bg-turquoise  text-charcoal px-4 py-2  mb-2 hover:bg-lightGray duration-150 ease-in-out"
        href={"/admin/addcategory"}
      >
        Add category
      </Link>
      <Link
        className="bg-turquoise  text-charcoal px-4 py-2  mb-2 hover:bg-lightGray duration-150 ease-in-out whitespace-pre"
        href={"/admin/orders"}
      >
        Orders Management
      </Link>

      {/* Users link with dropdown */}
      <div
        className="relative my-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          className="bg-turquoise  text-charcoal px-4 py-2 
        mb-2 cursor-pointer  hover:bg-lightGray duration-150 ease-in-out"
        >
          users
        </a>
        <CSSTransition
          in={isUsersDropdownOpen}
          timeout={300}
          classNames="dropdown"
          unmountOnExit
        >
          <div
            className="absolute left-0 mt-2  
            text-charcoal p-2 rounded flex flex-col space-y-2 "
            ref={dropdownRef}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {/* Add your sublinks here */}
            <Link href={"/admin/users/adduser"} className="py-1 px-4 bg-white">
              add user
            </Link>
            <Link
              href={"/admin/users/makeadmin"}
              className="py-1 px-4 bg-white"
            >
              make admin
            </Link>
            {/* Add more sublinks as needed */}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Sidebar;
