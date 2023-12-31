"use client";
import React, { useState, useEffect } from "react";
// import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import {
  RiSearchEyeLine,
  RiHeart2Fill,
  RiMenuLine,
  RiUser2Fill,
} from "react-icons/ri";
import { IoIosBasket } from "react-icons/io";
import Link from "next/link";
import Logo from "../../../public/images/logo-new.png";
import UserDropDownMenu from "./UserDropDownMenu";
import Image from "next/image";
import UserSignInButton from "../UserSignInButton";

// Redux
import { useSelector } from "react-redux";
import { selectItems, selectLikes } from "../../../slices/basketSlice";

import { getSession, useSession } from "next-auth/react";

import WishlistLength from "../WishlistLength";
import BasketLength from "../BasketLength";
import { useParams, useSearchParams } from "next/navigation";
import SearchComp from "../SearchComp";
import UserInfo from "../user/userInfo";

function Navigation({ url }) {
  const items = useSelector(selectItems);
  const likes = useSelector(selectLikes);

  console.log("likes from navigatioon :", likes);

  const [isItems, setIsItems] = useState();
  const [isLikes, setLikes] = useState();

  useEffect(() => {
    setIsItems(items);
  }, [items]);

  useEffect(() => {
    setLikes(likes);
  }, [likes]);
  // console.log("likes from navigation :", likes[0]?.product_id);

  const pathname = useParams();
  const searchParams = useSearchParams();
  // console.log(pathname, searchParams);

  // Get the user's session.
  const { data, status } = useSession();

  console.log("This data from naigation bar", data?.user);

  const firstName = data?.user?.first_name;
  const lastName = data?.user?.last_name;
  const userID = parseInt(data?.user?.user_id);

  console.log("last_name", firstName);
  return (
    <div className="text-right bg-white">
      <div className="grid grid-cols-3  md:grid-cols-3 w-full place-items-center md:px-20  border-b border-b-charcoal/20">
        {/* Search comp */}
        <div className="  col-span-1 w-full relative  ">
          <SearchComp />
        </div>
        {/* The image */}
        <div className="col-span-1 ">
          <Link href="/">
            {/* <p className="text-2xl font-sans font-extrabold tracking-wide">
            TAHADO
          </p> */}
            <Image src={Logo} height={150} />
          </Link>
        </div>

        {/* Buttons */}
        <div className=" hidden col-span-1  md:flex flex-row items-center  ">
          <ul className=" col-span-1 place-self-end w-full">
            <ul className=" flex flex-row space-x-5 ">
              <li className="md:midLink hidden relative "></li>

              <li className="midLink relative">
                <Link href={`/checkout`}>
                  <IoIosBasket className="text-black h-10 cursor-pointer " />
                  <span className=" absolute -top-1 left-1/4 text-white text-xs font-bold   z-10  bg-red py-1 px-2 rounded-full">
                    {isItems ? isItems?.length : 0}

                    <BasketLength userId={userID} />
                  </span>
                </Link>
              </li>

              <li className="md:midLink  relative">
                <Link href={`/wishlist`}>
                  <RiHeart2Fill className="text-black h-10 cursor-pointer " />
                  <span className=" absolute -top-1 left-1/4 text-white text-xs font-bold   z-10  bg-red py-1 px-2 rounded-full">
                    {/* {userID ? (
                      <WishlistLength userId={userID} />
                    ) : likes ? (
                      likes?.length
                    ) : (
                      0
                    )} */}

                    <WishlistLength userId={userID} />
                  </span>
                </Link>
              </li>

              <li className="midLink relative">
                {firstName ? (
                  <UserDropDownMenu
                    first_name={firstName}
                    last_name={lastName}
                  />
                ) : (
                  <UserSignInButton />
                )}
              </li>
            </ul>
          </ul>
        </div>
      </div>
      <div
        className="h-8 bg-lightPink text-charcoal 
      items-center justify-center text-center w-full col-span-3 grid grid-cols-3"
      >
        <p className="col-span-1">phones number</p>
        <p className="text-gray-800 tracking-wide whitespace-pre col-span-1">
          @ تهادو تحابو
        </p>
        <p className="col-span-1">socials links</p>
      </div>
      <div className="col-span-1 block md:hidden ">
        <RiMenuLine className="text-black h-10 cursor-pointer " />
      </div>
    </div>
  );
}

export default Navigation;
