import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await dbConnected();

        // ✅ 1. Check input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // ✅ 2. Find user
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        // ✅ 3. Compare password
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // ✅ 4. Return user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        if (session.user) {
          (session.user as any).id = token.userId as string;
        }

      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // your custom login page
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_navlane_123",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };