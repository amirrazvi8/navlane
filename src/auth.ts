import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import authConfig from "@/auth.config";


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnected();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error(
            "This account uses Google sign-in. Please use the Google button to log in."
          );
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.profileImage || null,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnected();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Auto-link: update profile image from Google if not already set
          if (!existingUser.profileImage && user.image) {
            existingUser.profileImage = user.image;
            await existingUser.save();
          }
          return true;
        }

        // Create a new user for first-time Google sign-in
        await User.create({
          name: user.name || "Google User",
          email: user.email,
          profileImage: user.image || "",
          authProvider: "google",
        });

        return true;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        // On initial sign-in, attach the DB user ID to the JWT
        await dbConnected();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.authProvider = dbUser.authProvider || "credentials";
        }
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
  },
});
