import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config.
 * This file must NOT import any Node.js modules (mongoose, bcryptjs, etc.)
 * because it is used by the middleware which runs in the Edge runtime.
 *
 * The full config (with Credentials provider + DB logic) lives in auth.ts.
 */
const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // On initial sign-in, store basic user info in the token.
        // The full DB lookup happens in auth.ts callbacks.
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.authProvider =
          (token.authProvider as string) || "credentials";
      }

      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedPaths = [
        "/dashboard",
        "/profile",
        "/roadmap",
        "/insights",
        "/analysis",
        "/reports",
        "/opportunities",
      ];

      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      // Redirect logged-in users away from login/register pages
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }

      return true;
    },
  },

  providers: [],

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};

export default authConfig;
