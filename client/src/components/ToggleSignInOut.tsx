import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth/next";
import { options } from "../app/api/auth/[...nextauth]/options";
import UserSignOutButton from "./UserSignOutButton";

const ToggleSignInOut = async () => {
  const session = await getServerSession(options);
  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      {session?.user ? (
        <UserSignOutButton />
      ) : (
        <Link className={buttonVariants()} href="/api/auth/signin">
          Sign in
        </Link>
      )}
    </div>
  );
};

export default ToggleSignInOut;
