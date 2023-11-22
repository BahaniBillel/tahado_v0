"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

function UserSignOutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
    >
      Sign out
    </Button>
  );
}

export default UserSignOutButton;
