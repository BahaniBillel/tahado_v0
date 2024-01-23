"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThankYouImage from "../../../public/images/access-denied.jpg";

export default function AccessDenied() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg w-full sm:w-96 text-center">
        {/* Placeholder for an image */}
        <div className="mb-4 relative">
          <Image src={ThankYouImage} objectFit="cover" alt="thankyou image" />
        </div>

        <h1 className="text-2xl font-bold mb-4">
          You Can`&apos;`t Access This Page!
        </h1>
        <p className="text-gray-700 mb-4">Your will be redirect it shorlty</p>
        <p className="text-sm text-gray-500">
          Redirecting to home in 2 seconds...
        </p>
      </div>
    </div>
  );
}
