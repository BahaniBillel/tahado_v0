"use client";
import React from "react";

import Image from "next/image";
import HeroImage from "../../public/images/hero-image-02.png";
function HeroImage01() {
  return (
    <div className="w-full h-96 overflow-hidden relative -mb-40 md:mb-0 ">
      <Image
        src={HeroImage}
        alt="hero image"
        className=" absolute md:-top-1/2 "
      />
    </div>
  );
}

export default HeroImage01;
