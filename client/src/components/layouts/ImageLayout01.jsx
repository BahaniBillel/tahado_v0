import React from "react";
import Image from "next/image";

function ImageLayout01({ image, alt, title }) {
  return (
    <div className=" h-full flex flex-col items-center justify-center text-center">
      <div>
        <Image src={image} alt={alt} className="rounded-md " />
      </div>
      <p className="w-full font-bold whitespace-pre mt-2 text-sm font-sans">
        {title}
      </p>
    </div>
  );
}

export default ImageLayout01;
