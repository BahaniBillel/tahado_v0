"use client";
import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    signIn("google");
  };

  return (
    <Button
      onClick={loginWithGoogle}
      className="w-full bg-charcoal text-white "
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
