"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThankYouImage from "../../../public/images/thankyou.jpg";

export default function ThankYou() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/sign-in");
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

        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-700 mb-4">
          Your account has been successfully created.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to home in 2 seconds...
        </p>
      </div>
    </div>
  );
}
