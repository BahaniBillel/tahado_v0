"use client";
import { useState } from "react";
import Image from "next/image";
export default function ImageMagnifier({ src }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const x = (offsetX / e.target.width) * 100;
    const y = (offsetY / e.target.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div className="relative">
      <Image
        src={src}
        alt="Product"
        className="cursor-crosshair w-full"
        onMouseMove={handleMouseMove}
        fill
      />
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${position.x}% ${position.y}%`,
          opacity: 0.5, // you can adjust
        }}
      ></div>
    </div>
  );
}
