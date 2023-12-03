"use client";
import React, { useState, useEffect } from "react";
import ReactStarsComp from "../components/ReactStars";
import { MdLocalOffer } from "react-icons/md";
import MyDisclosure from "../utils/Disclosure";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import fetchImagesFromS3 from "../utils/fetchImagesFromS3";
// Form submission Prequesites
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { request, gql } from "graphql-request";

import {
  BiLogoInstagramAlt,
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoYoutube,
} from "react-icons/bi";

import NextJsCarousel from "../utils/ResponsiveCarousel";

function DynamicPageSkelton({ data, giftId }) {
  // FETCHING IMAGES FROM AMAEZON S3
  const [images, setImages] = useState([]);
  const [giftImageMap, setGiftImageMap] = useState({}); // New state to map gift_ids to their images
  const [open, setOpen] = React.useState(false); // For Yetanother lightbox

  useEffect(() => {
    const loadImages = async () => {
      const images = await fetchImagesFromS3(giftId);
      setGiftImageMap((prevMap) => ({ ...prevMap, [giftId]: images }));
    };

    loadImages();
  }, [giftId]);

  const relevantImages = giftImageMap[giftId] || [];

  // The first image in the array of the relevant product images
  const MainImage = relevantImages[0];

  // Form Submission setup

  // TODO: see the logic
  //  the gift data is already present in data, so we need to integrate  quantity and
  // date and expression into data and descrese the from invontory table and decrease
  // it from order table and the related tables also, then submit the mix
  console.log("logging from gift product", data);

  const { giftname, price, description, gift_id } = data;
  const formSchema = z.object({
    giftname: z.string(), // add to order table
    price: z.number(),
    description: z.string(),
    gift_id: z.number(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    date: z.string().min(1, "Date is required"), // add to order table
    expression: z.string().optional(), // add to oder table
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      giftname: data.giftname,
      price: data.price,
      description: data.description,
      gift_id: data.gift_id,
      // Set default values for other fields if necessary
    },
  });

  const addToOrder = async (addToOrder) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `mutation CreateGift($giftData: GiftInput!) {
  createGift(giftData: $giftData) {
    craftman_id
    sku
    giftname
    description
    price
    url
    occasions {
      occasion {
        id
      }
    }
    productCategory {
      category {
        category_id
      }
    }
  }
}`;
  };
  const onSubmit = (formData) => {
    console.log(formData);
    // Submit formData to your backend
  };

  return (
    <div>
      <section className="h-50vh   flex flex-col md:flex-row ">
        {/* Right side : images Carousel */}
        <div className=" w-full md:w-3/5 order-1 md:order-2">
          <NextJsCarousel data={relevantImages} />
        </div>
        {/* Left side : Content */}
        {/* //TODO: This needs to be form that send information to Order Table in */}
        {/* database */}
        <form
          className=" w-full md:w-2/5 text-right px-5 pt-5 md:px-10 
        flex flex-col flex-nowrap space-y-4 items-end order-2 md:order-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl md:text-3xl font">{data.giftname}</h2>
          <div className="text-2xl flex flex-row flex-nowrap space-x-2">
            <span> د.ج</span>
            <p className="font-bold ">{data.price}</p>
          </div>
          <p className="para">{data.description}</p>
          <div className=" border-y border-y-charcoal/20 py-2 bg-lightGray w-full flex flex-row items-center justify-end">
            <ReactStarsComp />
          </div>

          <div className="font-light text-xs flex flex-row flex-nowrap space-x-2 items-center">
            <p>تم شراؤه أكثر من 14 مرة</p>
            <p>{data.url}</p>
            <MdLocalOffer className="text-charcoal" />
          </div>

          <label id="gifter_message">المتلقي</label>
          <input
            type="text"
            name="gifter_message"
            id="gifter_message"
            className="input"
          />
          <label id="gifter_message" className="text-right whitespace-pre">
            : اكتب العبارة المراد كتابتها على البطاقة
          </label>
          <textarea
            type="text"
            name="gifter_message"
            id="gifter_message"
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
            <select name="quantity" id="" className="input">
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
        </form>
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
