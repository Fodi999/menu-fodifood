import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // true на Vercel (HTTPS)
      },
    },
  },
  trustHost: true, // Важно для Vercel!
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Login attempt without credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          console.log(`❌ User not found: ${credentials.email}`);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          console.log(`❌ Failed login attempt for: ${credentials.email}`);
          return null;
        }

        console.log(`✅ Successful login: ${user.email} (${user.role})`);
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id as string;
        console.log(`🔑 JWT created for: ${user.email} (role: ${user.role})`);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "user" | "admin";
        session.user.id = token.id as string;
        console.log(`👤 Session loaded for: ${session.user.email} (role: ${session.user.role})`);
      }
      return session;
    },
  },
});
