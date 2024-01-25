"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThankYouImage from "../../../../public/images/thankyou.jpg";

export default function Thanks() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/categories");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg w-full sm:w-96 text-center">
        {/* Placeholder for an image */}
        <div className="mb-4 relative">
          <Image src={ThankYouImage} style="cover" alt="thankyou image" />
        </div>

        <h1 className="text-2xl font-bold mb-4">Thank You for Trusting us!</h1>
        <p className="text-gray-700 mb-4">
          Your order is bieng treated by our employees, you will receive a
          confirmation call before the delivery.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to home in 4 seconds...
        </p>
      </div>
    </div>
  );
}
