"use client";
import React from "react";
import { getSession, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { selectItems, selectLikes } from "../../slices/basketSlice";

function ClientComp() {
  // const items = useSelector(selectLikes);
  const session = useSession();
  //   console.log(session);
  return <div>ClientComp</div>;
}

export default ClientComp;
