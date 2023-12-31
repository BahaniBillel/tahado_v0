"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { resetLikes } from "../../slices/basketSlice";
import { useDispatch } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../store/configureStore"; // Replace with the path to your store file

function UserSignOutButton() {
  const dispatch = useDispatch();

  useEffect(() => {}, []);
  const HandleLogOut = () => {
    signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/sign-in`,
    });
    localStorage.setItem("likes", JSON.stringify([])); // Reset 'likes' to an empty array
    persistStore(store).purge();
  };

  return (
    <Button variant="destructive" onClick={HandleLogOut}>
      Sign out
    </Button>
  );
}

export default UserSignOutButton;
