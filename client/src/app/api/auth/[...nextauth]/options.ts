import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import db from "../../../../db/prismaDB";
import { compare } from "bcrypt";

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "../../sign-in",
    signOut: "../../sign-out",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "your email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        console.log("Inside authorize", credentials); // Debugging line

        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.users.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password_hash
        );
        if (!passwordMatch) {
          return null;
        }

        // Log the result for debugging
        console.log("Is password match:", passwordMatch);

        if (!passwordMatch) {
          console.log("Password does not match");
          return null;
        }

        // Include user roles in the returned object
        const userRoles = existingUser.roles || []; // Replace 'roles' with the actual field in your user model
        console.log("User Roles:", userRoles);

        return {
          user_id: `${existingUser.user_id}`,
          email: existingUser.email,
          first_name: existingUser.first_name,
          roles: userRoles,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email: user.email,
          first_name: user.first_name,
          user_id: user.user_id,
          roles: user.roles,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
          first_name: token.first_name,
          user_id: token.user_id,
          roles: token.roles,
        },
      };
    },
  },
};
