import React from "react";
import SignInForm from "../../components/form/SignInForm";
import Link from "next/link";
import SignInIMage from ".././../../public/images/gift-bg.jpg";
import Image from "next/image";

function SignIn() {
  return (
    <div className="w-screen h-screen max-h-screen flex flex-row overflow-hidden">
      <div className="w-3/4 h-full">
        <Image src={SignInIMage} alt={"/"} style="cover" />
      </div>
      <SignInForm />
    </div>
  );
}

export default SignIn;
