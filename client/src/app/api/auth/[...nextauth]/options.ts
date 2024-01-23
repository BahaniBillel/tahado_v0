import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import db from "../../../../db/prismaDB";
import { compare } from "bcrypt";
import { error } from "console";

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
        phone_number: {
          label: "Phone Number",
          type: "text",
          placeholder: "123-456-7890",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        console.log("Inside authorize", credentials); // Debugging line

        if (!credentials?.phone_number || !credentials?.password) {
          return null;
        }
        const existingUser = await db.users.findUnique({
          where: { phone_number: credentials?.phone_number },
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
          id: String(existingUser.user_id), // Assuming `user_id` can be mapped to `id`
          email: existingUser.email, // Add this if your user object has an email field
          name: `${existingUser.first_name} ${existingUser.last_name}`,
          // user_id: `${existingUser.user_id}`,
          phone_number: existingUser.phone_number,
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          roles: userRoles,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user roles to the token
        token.roles = user.roles || [];
        return {
          ...token,
          id: String(user.id),
          email: user.email, // Add this if your user object has an email field
          name: user.name,
          phone_number: user.phone_number,
          first_name: user.first_name,
          last_name: user.last_name,
          // user_id: user.user_id,
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
          id: token.id,
          name: token.name,
          email: token.email,
          phone_number: token.phone_number,
          first_name: token.first_name,
          // user_id: token.user_id,
          roles: token.roles,
        },
      };
    },
  },
};
