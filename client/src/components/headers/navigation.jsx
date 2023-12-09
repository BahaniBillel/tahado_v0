"use client";
import React from "react";
// import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import {
  RiSearchEyeLine,
  RiHeart2Fill,
  RiMenuLine,
  RiUser2Fill,
} from "react-icons/ri";
import { IoIosBasket } from "react-icons/io";
import Link from "next/link";
import Logo from "../../../public/images/logo-blue.png";
import DropDownMenu from "./dropdown";
import Image from "next/image";

// Redux
import { useSelector } from "react-redux";
import { selectItems, selectLikes } from "../../../slices/basketSlice";

import { getSession, useSession } from "next-auth/react";
import UserSignOutButton from "../UserSignOutButton";
import UserSignInButton from "../UserSignInButton";
import WishlistLength from "../WishlistLength";
import BasketLength from "../BasketLength";
import { useParams, useSearchParams } from "next/navigation";
import SearchComp from "../SearchComp";

function Navigation({ url }) {
  const items = useSelector(selectItems);
  const likes = useSelector(selectLikes);

  const pathname = useParams();
  const searchParams = useSearchParams();
  console.log(pathname, searchParams);

  // Get the user's session.
  const { data, status } = useSession();

  // console.log("This data from naigation bar", data);

  const isUserSignIn = data?.user?.first_name;
  const userID = parseInt(data?.user?.user_id);

  return (
    <div className="text-right  py-2   grid grid-cols-3 md:grid-cols-3 w-full md:px-20 place-items-center border-b border-b-charcoal/20">
      {/* Search comp */}
      <div className="bg-blue-800   ">
        <SearchComp />
      </div>
      {/* The image */}
      <div className="col-span-1">
        <Link href="/">
          {/* <p className="text-2xl font-sans font-extrabold tracking-wide">
            TAHADO
          </p> */}
          <Image src={Logo} height={100} />
        </Link>
      </div>

      {/* Buttons */}
      <div className=" hidden col-span-1  md:flex flex-row items-center ">
        <p className="text-gray-800 tracking-wide whitespace-pre">
          تهادو تحابو
        </p>

        <ul className=" col-span-1 place-self-end w-full">
          <ul className=" flex flex-row space-x-5 ">
            <li className="md:midLink hidden relative "></li>

            <Link href={`/wishlist`}>
              <li className="md:midLink  relative">
                <RiHeart2Fill className="text-black h-10 cursor-pointer " />
                <span className=" absolute -top-1 left-1/4 text-white text-xs font-bold   z-10  bg-red py-1 px-2 rounded-full">
                  {/* {likes ? likes.length : 0} */}
                  <WishlistLength userId={userID} />
                </span>
              </li>
            </Link>
            <Link href={`/checkout`}>
              <li className="midLink relative">
                <IoIosBasket className="text-black h-10 cursor-pointer " />
                <span className=" absolute -top-1 left-1/4 text-white text-xs font-bold   z-10  bg-red py-1 px-2 rounded-full">
                  {/* {items ? items.length : 0} */}
                  <BasketLength userId={userID} />
                </span>
              </li>
            </Link>
            <li className="midLink">
              <RiUser2Fill className="text-black h-10 cursor-pointer " />
              {isUserSignIn ? <UserSignOutButton /> : <UserSignInButton />}
            </li>
          </ul>
        </ul>
      </div>
      <div className="col-span-1 block md:hidden ">
        <RiMenuLine className="text-black h-10 cursor-pointer " />
      </div>
    </div>
  );
}

export default Navigation;
