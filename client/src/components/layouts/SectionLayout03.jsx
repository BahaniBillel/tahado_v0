import React from "react";
import Image from "next/image";
import Gift from "../../../public/images/festive-gift.gif";
import Gift2 from "../../../public/images/baby-gift.jpg";
import ImageLayout01 from "./ImageLayout01";

export default function SectionLayout03() {
  return (
    <div
      className=" flex flex-col md:grid grid-cols-6 
     md:h-3/6 md:py-5 bg-mustardYellow gap-4 relative px-32 items-center "
    >
      <div className="col-span-2 px-2">
        <p className="font-bold text-2xl font-sans pb-2">Holiday magic</p>
        <p className="font-sans">
          Add a personal touch to your holidays with thoughtfully personalized
          gifts and custom décor.
        </p>
      </div>

      <div className="flex flex-row justify-between space-x-8 col-span-4">
        <ImageLayout01
          image={Gift}
          alt="some photo"
          title="Personalized Ornaments"
        />
        <ImageLayout01
          image={Gift2}
          alt="some photo"
          title="Personalized Ornaments"
        />
        <ImageLayout01
          image={Gift}
          alt="some photo"
          title="Personalized Ornaments"
        />
        <ImageLayout01
          image={Gift2}
          alt="some photo"
          title="Personalized Ornaments"
        />
      </div>
    </div>
  );
}
