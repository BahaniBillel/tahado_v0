import React from "react";
import Navigation from "../components/headers/navigation";
import MiddleHeader from "../components/headers/middleHeader";
import { getSession } from "next-auth/react";
const CheckPathname = (req, res) => {
  const session = getSession({ req });

  console.log("this the sessssss", session);

  const { query } = req;
  console.log("get your url from here...........", query);
  // const isHomePage = pathname === "/";
  // const isThankyouPage = pathname === "/thankyou";
  // const isRegisterPage = pathname === "/register";
  return (
    <div>
      {/* {isThankyouPage || isRegisterPage ? null : <Navigation />}

      {!isHomePage ? null : <MiddleHeader />} */}
    </div>
  );
};

export default CheckPathname;
