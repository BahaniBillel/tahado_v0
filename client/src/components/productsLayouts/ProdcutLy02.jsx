"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import DefaultImage from "../../../public/images/defaultGiftImage.jpg";
import DefaultCustom from "../../../public/images/brume.jpg";
// import { useDispatch } from "react-redux";
import { HeartIcon } from "@heroicons/react/24/solid";
// import { incrementLikes, decrementLikes } from "../../redux/slices/basketSlice";

// Components
import ReactStarsComp from "../ReactStars";

function ProductLy02({
  image,
  title,
  price,
  feature,
  featureColor,
  // QuickViewHandler,
  link,
  fill,
  width,
  height,
  custom,
}) {
  //   const dispatch = useDispatch();
  const [heart, setHeart] = useState(false);
  //   const HandleHeartLikes = () => {
  //     setHeart(!heart);

  //     const product = {
  //       image,
  //       title,
  //       subtitle,
  //       price,
  //       feature,
  //       featureColor,
  //     };
  //     if (!heart) {
  //       dispatch(incrementLikes(product));
  //     } else {
  //       dispatch(decrementLikes({ name }));
  //     }
  //   };

  return (
    <div>
      {!custom ? (
        <div className={`w-36 md:w-72 group`}>
          <div
            className={` ${"w-36 md:w-72" || width}  ${
              " h-44 md:h-72" || height
            }  group  border border-charcoal/20 hover:shadow-lg p-2 relative rounded-sm 
      hover:-translate-y-1 transition-all duration-150 ease-in-out cursor-pointer`}
          >
            {feature ? (
              <span
                className={`absolute -left-1 top-1 text-xs font-light px-3 py-1 ${featureColor}  bg-black text-white rounded-r-xl`}
              >
                {feature}
              </span>
            ) : null}
            <Link href={`/gift/${link}`}>
              <div className="h-full overflow-hidden">
                <Image
                  src={image || DefaultImage}
                  alt={title}
                  fill={fill}
                  sizes="(max*width:768) 100 vw,700px"
                />
              </div>
            </Link>

            <div className="absolute right-2 md:right-5 top-2 md:top-5 z-40 ">
              <button>
                {heart ? (
                  <HeartIcon className="h-6 text-red " />
                ) : (
                  <HeartIcon className="h-6 text-lightGray " />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col   space-y-3 items-end text-right  ">
            {/* first line  */}
            <div className="flex flex-col md:flex-row-reverse  md:justify-center w-full pt-2 text-right">
              <div className="text-sm font-light ">{title}</div>
              <div className=" flex flex-grow"></div>
              <div className="font-bold text-sm pr-2 flex flex-row justify-end md:justify-center whitespace-pre ">
                <p className="pr-2 ">دج</p>
                <p>{price}</p>
              </div>
            </div>
            {/* second line */}

            <p className=" text-sm text-turquoise font-bold text-right">
              <span className="text-coralPink">MSM GO</span>
              توصيل متوفر مع
            </p>

            {/* Third line */}
            <ReactStarsComp />
          </div>
        </div>
      ) : (
        // customised card
        <div className={`w-36 md:w-72 group bg-turquoise p-5`}>
          <div
            className={` ${"w-36 md:w-72" || width}  ${
              " h-56 md:h-80" || height
            }  group  border border-charcoal/20  p-2 relative rounded-sm 
            cursor-pointer`}
          >
            <Link href={`/gift/${link}`}>
              <div className="h-full overflow-hidden">
                <Image
                  src={image || DefaultCustom}
                  alt={title}
                  fill={fill}
                  sizes="(max*width:768) 100 vw,700px"
                />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductLy02;
