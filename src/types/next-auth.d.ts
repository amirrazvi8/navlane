import NextAuth from "next-auth";

declare module "next-auth" {
 interface session {
  user:{
   id:string,
   name:string,
   email:string,
   image?:string
  };
 }
}