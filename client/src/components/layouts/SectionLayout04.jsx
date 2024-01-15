import React from "react";
import Image from "next/image";
import Gift from "../../../public/images/festive-gift.gif";
import Gift2 from "../../../public/images/baby-gift.jpg";
import ImageLayout01 from "./ImageLayout01";

export default function SectionLayout03() {
  return (
    <div className="px-4 md:px-16 py-4 h-screen md:h-96 mt-16 text-white ">
      <h1 className="mb-2 text-right font-medium text-lg">
        تم عرضها مؤخرًا والمزيد{" "}
      </h1>
      <div
        className=" grid grid-cols-1 md:grid-cols-5 
      grid-rows-5 md:grid-rows-1 h-full   relative overflow-hidden gap-2  "
      >
        <div
          className=" md:col-span-4 relative grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 
        grid-row-5 row-span-4 row-start-1  gap-2 h-full "
        >
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01
              image={Gift}
              alt="gift"
              price="1299.50"
              currency="DA"
            />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div
            className="p-4 bg-magenta rounded-md col-span-2 row-span-1 md:hidden h-full flex flex-col
        justify-center space-y-2 shadow-md"
          >
            <h3 className="font-semibold text-lg">GET THE TOP GIFTS TRENDS</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
              inventore.
            </p>
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
          <div className="col-span-1 row-span-1  relative rounded-md overflow-hidden">
            <ImageLayout01 image={Gift} alt="gift" />
          </div>
        </div>
        <div
          className="p-4 bg-magenta rounded-md md:col-span-1 h-full hidden md:flex flex-col
        justify-center space-y-2 shadow-md"
        >
          <h3 className="font-semibold text-lg">GET THE TOP GIFTS TRENDS</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
            inventore.
          </p>
        </div>
      </div>
    </div>
  );
}
