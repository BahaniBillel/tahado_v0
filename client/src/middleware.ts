// Without a defined matcher, this one line applies next-auth
// to the entire project
// export { default } from "next-auth/middleware"

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    console.log(request.nextUrl.pathname);
    console.log(request.nextauth.token);

    // if (
    //   request.nextUrl.pathname.startsWith("/extra") &&
    //   request.nextauth.token?.roles !== "admin"
    // ) {
    //   return NextResponse.rewrite(new URL("/denied", request.url));
    // }

    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextauth.token?.roles.indexOf("admin") === -1
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/admin", "/dashboard"] };
