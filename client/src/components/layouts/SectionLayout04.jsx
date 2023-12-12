import React from "react";
import Image from "next/image";
import Gift from "../../../public/images/festive-gift.gif";
import Gift2 from "../../../public/images/baby-gift.jpg";
import ImageLayout01 from "./ImageLayout01";

export default function SectionLayout03() {
  return (
    <div className="px-16 py-4 h-96 mt-16 ">
      <h1 className="mb-2 text-right font-medium text-lg">
        تم عرضها مؤخرًا والمزيد{" "}
      </h1>
      <div className=" grid grid-cols-5 h-full   relative overflow-hidden gap-2  ">
        <div className=" col-span-4 relative grid grid-cols-4 grid-rows-2 gap-2 h-full">
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
          className="p-4 bg-turquoise rounded-md col-span-1 h-full flex flex-col
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
