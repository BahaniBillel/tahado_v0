import { FC, ReactNode } from "react";
import { Button } from "./ui/button";

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => console.log("login with google");

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
