"use client";
import React, { useState, useEffect } from "react";
import { GrUserFemale } from "react-icons/gr";
import { ImHome3 } from "react-icons/im";
import { CiShop } from "react-icons/ci";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BsHeart, BsBasket, BsSearch } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Link from "next/link";
import { TbBrandBlogger } from "react-icons/tb";

import { useSelector } from "react-redux";
// import { selectItems, selectLikes } from "../../redux/slices/basketSlice";

function BottomNavigationBar() {
  //   const items = useSelector(selectItems);
  //   const likes = useSelector(selectLikes);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex justify-center md:hidden flex-row space-x-8 bg-white border-t border-t-charcoal/20 py-3 fixed bottom-0 left-0 w-full shadow-md px-2 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer ">
        <ImHome3 className="h-6 w-6" />
        <p className="text-gray-600">Home</p>
      </div>

      <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer ">
        <MdOutlineLocalOffer className="h-6 w-6" />
        <p className="text-gray-600">Offers</p>
      </div>
      <Link href="/cart">
        <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer">
          <HiOutlineShoppingBag className="h-6 w-6" />
          <p className="text-gray-600 relative">
            Shop
            <span className=" absolute -top-4 left-2/4 text-white text-xs font-bold   z-10  bg-red-600 py-1 px-2 rounded-full">
              {/* {items ? items.length : 0} */}
            </span>
          </p>
        </div>
      </Link>
      <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer ">
        <GrUserFemale className="h-6 w-6" />
        <p className="text-gray-600">Me</p>
      </div>

      <Link href="/blogs/12" className="hidden">
        <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer">
          <TbBrandBlogger className="h-6 w-6" />
          <p className="text-gray-600">Blogs</p>
        </div>
      </Link>

      <Link href="/likes">
        <div className="flex flex-col text-xs font-light items-center justify-center cursor-pointer ">
          <BsHeart className="h-6 w-6" />

          <p className="text-gray-600 relative">
            Likes
            <span className=" absolute -top-4 left-2/4 text-white text-xs font-bold   z-10  bg-red-600 py-1 px-2 rounded-full">
              {/* {likes ? likes.length : 0} */}
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
}

export default BottomNavigationBar;
