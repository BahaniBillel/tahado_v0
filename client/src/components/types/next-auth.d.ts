import NextAuth from "next-auth"

declare module "next-auth" {
interface User {
    email:string
}
  interface Session {
    user:User & {
      email:string
    }
    token:{
        email:string
    }
  }
}