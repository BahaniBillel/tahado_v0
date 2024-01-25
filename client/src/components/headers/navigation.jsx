"use client";

import {
  RiSearchEyeLine,
  RiHeart2Fill,
  RiMenuLine,
  RiUser2Fill,
} from "react-icons/ri";
import { CgMenuRightAlt } from "react-icons/cg";
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

import SearchComp from "../SearchComp";
import UserInfo from "../user/userInfo";

function Navigation({ url }) {
  const items = useSelector(selectItems);
  const likes = useSelector(selectLikes);

  const [isItems, setIsItems] = useState();
  const [isLikes, setLikes] = useState();

  useEffect(() => {
    setIsItems(items);
  }, [items]);

  useEffect(() => {
    setLikes(likes);
  }, [likes]);
  // console.log("likes from navigation :", likes[0]?.product_id);

  // Get the user's session.
  const { data, status } = useSession();

  const firstName = data?.user?.first_name;
  const lastName = data?.user?.last_name;
  const userID = parseInt(data?.user?.id);

  return (
    <div className="text-right bg-white relative ">
      <div
        className="grid grid-cols-6  md:grid-cols-3 
      w-full place-items-center md:px-20 py-5  border-b border-b-charcoal/20"
      >
        {/* Search comp */}
        <div className=" order-2 md:order-1 col-start-2 col-span-4 md:col-span-1  w-full relative pr-5  ">
          <SearchComp />
        </div>
        {/* The image for medium view */}
        <div className=" hidden md:block order-1 md:order-2 col-span-1 ">
          <Link href="/">
            {/* <p className="text-2xl font-sans font-extrabold tracking-wide">
            TAHADO
          </p> */}
            <Image src={Logo} height={150} alt="simyah" />
          </Link>
        </div>
        {/* Image for small view */}
        <div className="md:hidden order-1 md:order-2 col-start-1 col-span-1 ">
          <Link href="/">
            {/* <p className="text-2xl font-sans font-extrabold tracking-wide">
            TAHADO
          </p> */}
            <Image src={Logo} height={50} alt="simyah" />
          </Link>
        </div>

        {/* Buttons */}
        <div className=" hidden col-span-1  md:flex flex-row items-center order-3  ">
          <ul className=" col-span-1 place-self-end w-full">
            <ul className=" flex flex-row space-x-5 ">
              <li className="md:midLink hidden relative "></li>

              <li className="midLink relative">
                <Link href={`/checkout/cart`}>
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
        <div className=" col-start-6  col-span-1 block md:hidden order-3 ">
          <CgMenuRightAlt className="text-charcoal h-8  w-8 cursor-pointer " />
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
    </div>
  );
}

export default Navigation;
