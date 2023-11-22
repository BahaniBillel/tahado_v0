"use client";
import React from "react";
import DefaultImage from "../../public/images/defaultGiftImage.jpg";
import ReactImageZoom from "react-image-zoom";
import Image from "next/image";

export default function GridGallery({ data }) {
  const imageZoomProps = {
    width: 400,
    zoomWidth: 300,
    img: "",
    scale: 1.5,
    zoomPosition: "left",
  };

  return (
    <div className="relative grid grid-cols-2  grid-flow-row gap-2">
      {data.map((image, index) => (
        <div
          key={index}
          className={`${
            index === 0 || index === 3
              ? "col-span-2 row-span-2"
              : index === 4
              ? "col-span-2 row-span-1"
              : null
          }`}
        >
          <ReactImageZoom
            {...{ ...imageZoomProps, img: image || DefaultImage }}
          />
        </div>
      ))}
    </div>
  );
}
