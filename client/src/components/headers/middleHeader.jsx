import React from "react";
import { RiArrowUpSFill } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { links } from "./MyLinks";
import SearchComp from "../SearchComp";

function MiddleHeader() {
  return (
    <div className="  w-screen  md:px-20 flex flex-col  space-y-12 place-items-center mt-10  ">
      <div className="row-span-1 w-full md:w-3/5 px-10 ">
        <SearchComp />
      </div>
      <div className="row-span-1 flex flex-row w-full overflow-x-auto justify-center space-x-16  py-5">
        {links.map((link, i) => (
          <div key={link.id} className="navOption group">
            <Link href={`/categories${link.page}`}>
              <div className="overflow-hidden rounded-full w-36 h-36 relative">
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
