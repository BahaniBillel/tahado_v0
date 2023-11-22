import React from "react";
import Image from "next/image";
import RegisterForm from "../../components/form/registerForm";
import SignOutIMAGE from ".././../../public/images/signup-bg.jpg";

function RegisterPage() {
  return (
    <div className="w-screen h-screen max-h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-3/4 h-full">
        <Image src={SignOutIMAGE} alt={"/"} objectFit="cover" />
      </div>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
