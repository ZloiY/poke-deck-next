import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
   
  },
  {
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/registration') {
        console.log('token', token);
        return !!token;
      } else {
        return true;
      }
    },
  }
})