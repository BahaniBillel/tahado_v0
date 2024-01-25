"use client";
import React from "react";

import Image from "next/image";
import HeroImage3 from "../../public/images/hero-image-03.png";
import HeroImage2 from "../../public/images/hero-image-02.png";
import HeroImage1 from "../../public/images/hero-image-01.png";
function HeroImage02() {
  return (
    <div className="w-full h-96 overflow-hidden grid-cols-3 grid">
      <div
        className="col-span-1 bg-tulipyellow h-full  -skew-x-6 hover:scale-110 hover:shadow-md 
      duration-150 ease-in-out transition-all "
      >
        <Image
          src={HeroImage1}
          alt="hero image"
          style={{ objectFit: "fill" }}
        />
      </div>

      <div
        className="col-span-1 bg-magenta h-full -skew-x-6 hover:scale-110 hover:shadow-md 
      duration-150 ease-in-out transition-all "
      >
        <Image
          src={HeroImage2}
          alt="hero image"
          style={{ objectFit: "fill" }}
        />
      </div>
      <div
        className="col-span-1 bg-lightGray h-full -skew-x-6 hover:scale-110 hover:shadow-md 
      duration-150 ease-in-out transition-all"
      >
        <Image
          src={HeroImage3}
          alt="hero image"
          style={{ objectFit: "fill" }}
        />
      </div>
    </div>
  );
}

export default HeroImage02;
