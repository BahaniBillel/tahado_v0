"use client";
import React from "react";

import Image from "next/image";
import HeroImage from "../../public/images/hero-image-02.png";
function HeroImage01() {
  return (
    <div className="w-full h-96 overflow-hidden relative ">
      <Image src={HeroImage} alt="hero image" className=" absolute -top-1/2 " />
    </div>
  );
}

export default HeroImage01;
