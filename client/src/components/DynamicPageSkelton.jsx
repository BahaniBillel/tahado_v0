"use client";
import React, { useState, useEffect } from "react";
import ReactStarsComp from "../components/ReactStars";
import { MdLocalOffer } from "react-icons/md";
import MyDisclosure from "../utils/Disclosure";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

import {
  BiLogoInstagramAlt,
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoYoutube,
} from "react-icons/bi";

import NextJsCarousel from "../utils/ResponsiveCarousel";

function DynamicPageSkelton({ data, giftId, addItem }) {
  // FETCHING IMAGES FROM AMAEZON S3
  const [images, setImages] = useState([]);
  const [giftImageMap, setGiftImageMap] = useState({}); // New state to map gift_ids to their images
  const [open, setOpen] = React.useState(false); // For Yetanother lightbox

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
  });

  // Now, you can use giftImageMap[data.gift_id] to get the images for the given gift

  const getImages = async () => {
    try {
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Prefix: "gifts_photos/",
      };

      console.log("Sending ListObjectsCommand with params:", params);

      const command = new ListObjectsCommand(params);
      const imagesData = await s3Client.send(command);

      if (imagesData && imagesData.Contents) {
        const imageObjects = imagesData.Contents;

        let tempGiftImageMap = {};

        const { gift_id } = data;

        // New logic to map images to gifts by gift_id
        const giftImages = imageObjects.filter(
          (img) =>
            img.Key.startsWith(`gifts_photos/gift_${gift_id}/`) &&
            !img.Key.endsWith("/") &&
            (img.Key.toLowerCase().endsWith(".jpg") ||
              img.Key.toLowerCase().endsWith(".png")) // New condition
        );

        tempGiftImageMap[gift_id] = giftImages.map(
          (img) =>
            `https://tahadobucket.s3.eu-central-1.amazonaws.com/${img.Key}`
        );

        // Save the gift-image mapping and the images
        const actualImages = imageObjects.filter(
          (obj) =>
            obj.Key.toLowerCase().endsWith(".jpg") ||
            obj.Key.toLowerCase().endsWith(".png")
        );

        setGiftImageMap(tempGiftImageMap);
        console.log("acrual images", actualImages);
        setImages(actualImages); // Only set actual images, not folder paths
        console.log("images", images);
      }
    } catch (error) {
      console.log("logging error:", error);
    }
  };

  useEffect(() => {
    getImages();
    console.log("Updated images:", images);
  }, [images]);

  // Utilize the giftId to extract relevant images from giftImageMap
  const relevantImages = giftImageMap[giftId] || [];

  console.log("logging images to find out :", relevantImages);

  return (
    <div>
      <section className="h-50vh   flex flex-col md:flex-row ">
        {/* Right side : images Carousel */}
        <div className=" w-full md:w-3/5 order-1 md:order-2">
          <NextJsCarousel data={relevantImages} />
        </div>
        {/* Left side : Content */}
        <div
          className=" w-full md:w-2/5 text-right px-5 pt-5 md:px-10 
        flex flex-col flex-nowrap space-y-4 items-end order-2 md:order-1"
        >
          <h2 className="text-2xl md:text-3xl font">{data.giftname}</h2>
          <p className="para">{data.description}</p>
          <div className=" border-y border-y-charcoal/20 py-2 bg-lightGray w-full flex flex-row items-center justify-end">
            <ReactStarsComp />
          </div>
          <div className="text-2xl flex flex-row flex-nowrap space-x-2">
            <span> د.ج</span>
            <p className="font-bold ">{data.price}</p>
          </div>
          <div className="font-light text-xs flex flex-row flex-nowrap space-x-2 items-center">
            <p>تم شراؤه أكثر من 14 مرة</p>
            <p>{data.url}</p>
            <MdLocalOffer className="text-charcoal" />
          </div>

          <label id="expression" className="text-right whitespace-pre">
            : اكتب العبارة المراد كتابتها على البطاقة
          </label>
          <textarea
            type="text"
            name="expression"
            id="expression"
            className="input"
          />
          <label id="date" className="text-right whitespace-pre">
            : يوم تسليم الهدية
          </label>
          <input
            type="datetime-local"
            name="date"
            id="date"
            className="input"
          />

          <div className="flex flex-row space-x-3 w-full my-10 ">
            <select name="" id="" className="input">
              <option value="1">1</option>
              <option value="1">2</option>
              <option value="1">3</option>
              <option value="1">4</option>
            </select>
            <button
              type="button"
              className="border px-6 py-1 rounded-sm text-sm font-light bg-charcoal
             text-turquoise hover:text-coralPinkLight hover:bg-charcoal hover:border-charcoal
             transition-all duration-150 ease-in-out whitespace-pre "
              onClick={addItem}
            >
              أضف إلى السلة
            </button>
          </div>
          <div className="flex flex-grow" />
          <div className="border-t pt-3 border-charcoal/40">
            <div>
              <p className="text-sm text-charcoal">
                التصنيفات : الهدايا الجاهزة , هدايا الكميات , هدايا الموظف
                الجديد , هدايا اليوم الوطني , التورزيعات ,
              </p>
            </div>
            <div className="w-full flex flex-row flex-nowrap justify-end items-center space-x-2 my-4 ">
              <ul className="flex flex-row flex-nowrap justify-center space-x-4">
                <li
                  className=" rounded-full p-1 border border-charcoal/20 w-8 h-8 flex items-center justify-center
                group hover:border-coralPinkLight transition-all duration-300 ease-in-out cursor-pointer
                "
                >
                  {" "}
                  <BiLogoInstagramAlt className="text-charcoal/60 group-hover:text-coralPink  transition-all duration-300 ease-in-out" />
                </li>
                <li
                  className=" rounded-full p-1 border border-charcoal/20 w-8 h-8 flex items-center justify-center
                group hover:border-coralPinkLight transition-all duration-300 ease-in-out cursor-pointer
                "
                >
                  {" "}
                  <BiLogoFacebook className="text-charcoal/60 group-hover:text-coralPink  transition-all duration-300 ease-in-out" />
                </li>
                <li
                  className=" rounded-full p-1 border border-charcoal/20 w-8 h-8 flex items-center justify-center
                group hover:border-coralPinkLight transition-all duration-300 ease-in-out cursor-pointer
                "
                >
                  {" "}
                  <BiLogoTwitter className="text-charcoal/60 group-hover:text-coralPink  transition-all duration-300 ease-in-out" />
                </li>
                <li
                  className=" rounded-full p-1 border border-charcoal/20 w-8 h-8 flex items-center justify-center
                group hover:border-coralPinkLight transition-all duration-300 ease-in-out cursor-pointer
                "
                >
                  {" "}
                  <BiLogoYoutube className="text-charcoal/60 group-hover:text-coralPink  transition-all duration-300 ease-in-out" />
                </li>
              </ul>
              <p>: شارك المنتج </p>
            </div>
          </div>
        </div>
      </section>

      <section className="  w-full flex flex-col   md:flex-row md:space-x-10 mt-10 pt-16 px-4">
        <div className="md:w-1/2 order-2 md:order-1  ">
          <div className="">
            <h3 className="smalltitle"> هدية مصنوعة من</h3>
            <ul className=" flex flex-col space-y-2 text-right">
              <li>الورق</li>
              <li>قماش الساتان</li>
              <li>بطاقة تهادوا الوردية</li>
              <li>عطر الخزامى</li>
            </ul>
          </div>
          <div className="text-right">
            <h3 className="smalltitle"> الأبعاد</h3>
            <p>6 الطول x 2 العرض x 9.4 الإرتفاع</p>
          </div>
          <div className="text-right">
            <h3 className="smalltitle"> ملاحضات</h3>
            <p className="para">
              هذا النحت على الحائط لا يعزف الموسيقى. استخدم لأغراض الديكور فقط.
            </p>
            <p className="para">
              بمجرد تقديم طلبك ، يتم إدخاله في الإنتاج ولا يمكن استيعاب
              التغييرات والإلغاءات - نأسف ، لا استثناءات. نحن نبذل قصارى جهدنا
              لتحويل الطلبات في أسرع وقت ممكن ونتيجة لذلك ، تبدأ الطلبات في
              الإنتاج على الفور. - جميع الطلبات نهائية
            </p>
          </div>
          <div className="text-right">
            <h3 className="smalltitle"> : رمز الهدية</h3>
            <p className="text-sm ">2543</p>
          </div>
        </div>
        <div className="md:w-1/2 order-1 md:order-2  ">
          <MyDisclosure />
        </div>
      </section>
    </div>
  );
}

export default DynamicPageSkelton;
