"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

function UserSignInButton() {
  return (
    <Button variant="default" onClick={() => signIn()}>
      Sign in
    </Button>
  );
}

export default UserSignInButton;
