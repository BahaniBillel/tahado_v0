"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { RiLoginBoxLine } from "react-icons/ri";
function UserSignInButton() {
  return (
    <Button variant="default" onClick={() => signIn()}>
      {/* <RiLoginBoxLine /> */}
      sign in
    </Button>
  );
}

export default UserSignInButton;
