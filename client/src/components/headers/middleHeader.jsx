import React from "react";
import { RiArrowUpSFill } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { links } from "./MyLinks";

function MiddleHeader() {
  return (
    <div className="  w-screen  md:px-20 flex flex-col justify-center items-center  space-y-12 place-items-center mt-10  ">
      <div className="row-span-1 w-full  px-10  ">
        <p className="hidden md:block text-5xl text-center  w-full whitespace-pre ">
          اكتشف هدايا فريدة و منسقة لجميع مناسباتك
        </p>
      </div>
      <div className="row-span-1 flex flex-row w-full overflow-x-auto justify-center space-x-16  py-5">
        {links.map((link, i) => (
          <div key={link.id} className="navOption group">
            <Link href={`/categories${link.page}`}>
              <div className="overflow-hidden rounded-full w-32 h-32 relative hover:scale-105 hover:shadow-sm duration-100 ease-out transition-all">
                <Image src={link.image} alt={link.name} />
              </div>
              <h1 className="text-gray-800 text-sm group-hover:underline my-2 cursor-pointer">
                {link.name}
              </h1>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiddleHeader;
