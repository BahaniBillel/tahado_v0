import React from "react";
import Image from "next/image";
import Gift from "../../../public/images/wedding-gift2.jpg";
import Gift2 from "../../../public/images/baby-gift.jpg";

export default function SectionLayout02() {
  return (
    <div className=" flex flex-col md:grid grid-cols-6  md:h-screen md:py-5 bg-turquoise gap-4 relative ">
      <div className=" col-span-3 flex flex-col justify-center items-end text-right px-10 md:px-44 order-2  ">
        <p className="text-3xl font-semibold ">وعسى حياتك كلها سعيدة</p>

        <p className="text-sm font-light py-4">
          عسى السعادة في حياة (اسم العريس، اسم العروس) تزدهر والحظ يضحك لهما على
          طول الزمان وعرض المكان ليحققا كل الأحلام.
        </p>

        <p className="button bg-coralPinkLight">اكتشف الهدايا</p>
      </div>
      <div
        className=" absolute left-32 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 px-5
       bg-white col-span-3 overflow-hidden order-1 justify-center flex flex-col :py-24
      w-40 md:w-64 h-40 md:h-64
       "
      >
        <Image src={Gift2} alt="wedding" fill className=" p-4 md:p-8" />
      </div>

      <div className=" col-span-3 overflow-hidden order-1 justify-center flex flex-col relative py-5 md:py-24 pr-16 pl-10">
        <Image src={Gift} alt="baby gift" />
      </div>
    </div>
  );
}
