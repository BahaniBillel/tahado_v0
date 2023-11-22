import React from "react";
import Image from "next/image";
import Gift from "../../../public/images/wedding-gift.jpg";

function SectionLayout01() {
  return (
    <div className=" flex flex-col md:grid grid-cols-6  md:h-screen md:py-10 bg-coralPinkLight gap-4 ">
      <div className=" col-span-2 flex flex-col justify-center items-end text-right pr-5 order-2  ">
        <p className="text-3xl font-semibold ">وعسى حياتك كلها سعيدة</p>

        <p className="text-sm font-light py-4">
          عسى السعادة في حياة (اسم العريس، اسم العروس) تزدهر والحظ يضحك لهما على
          طول الزمان وعرض المكان ليحققا كل الأحلام.
        </p>

        <p className="button">اكتشف الهدايا</p>
      </div>

      <div className=" col-span-4 overflow-hidden order-1">
        <Image src={Gift} alt="#" />
      </div>
    </div>
  );
}

export default SectionLayout01;
