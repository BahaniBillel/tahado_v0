"use client";
import React from "react";

import Image from "next/image";
import HeroImage from "../../public/images/hero-image-01.png";
function HeroImage01() {
  return (
    <div className="w-full h-96 overflow-hidden">
      <Image src={HeroImage} alt="hero image" />
    </div>
  );
}

export default HeroImage01;
