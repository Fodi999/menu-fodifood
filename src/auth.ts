import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // JWT-сессии - NextAuth сам управляет токенами
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  trustHost: true, // Обязательно для Vercel!
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
    async redirect({ url, baseUrl }) {
      // Полный контроль над редиректом после входа
      console.log(`🔀 Redirect callback: url=${url}, baseUrl=${baseUrl}`);
      
      // Если это редирект после входа и NextAuth хочет отправить на /auth/signin - игнорируем
      if (url === `${baseUrl}/auth/signin` || url === '/auth/signin') {
        console.log(`⚠️ Prevented redirect to signin, using /profile instead`);
        return `${baseUrl}/profile`;
      }
      
      // Если это относительный URL, делаем его абсолютным
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Если URL принадлежит нашему домену, разрешаем редирект
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Внешние редиректы игнорируем, возвращаем базовый URL
      console.log(`⚠️ External redirect blocked: ${url}`);
      return baseUrl;
    },
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
