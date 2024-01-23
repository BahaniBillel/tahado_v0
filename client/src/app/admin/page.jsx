import { getServerSession } from "next-auth";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";

const Admin = async () => {
  const session = await getServerSession(options);

  console.log(session.user.email);

  if (session?.user) {
    return (
      <div>
        <h1 className="text-2xl ">
          {" "}
          Welcome back,
          <span className="font-bold pl-1">{session.user?.first_name}</span>.
        </h1>
      </div>
    );
  }

  if (!session?.user) {
    return <h1>Please enter your credentials </h1>;
  }
};

export default Admin;
