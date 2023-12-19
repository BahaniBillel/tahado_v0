"use client";
import React from "react";
import { useUserSession } from "../../hooks/useUserSession";

const UserInfo = () => {
  const { session, isLoading } = useUserSession();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <p>Logged in as {session.user.email}</p>
      {/* Display more user information here */}
    </div>
  );
};

export default UserInfo;
