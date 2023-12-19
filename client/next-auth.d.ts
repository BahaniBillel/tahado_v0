// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: number;
      first_name: string;
      last_name: string;
      phone_number: string;
      roles: string;
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    roles: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    roles: string;
  }
}
