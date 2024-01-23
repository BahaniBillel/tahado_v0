// customSessionHook.js
"use client";
import { useSession } from "next-auth/react";

export const useCustomSession = () => {
  const { data, status } = useSession();
  const userId = data?.user?.id;

  return {
    userId,
    data,
    status,
  };
};
