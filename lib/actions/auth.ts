// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { PATHS } from "@/app/_config/routes";

//* 驗證規則
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  //* 供應者
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        try {
          //* 驗證 Input 格式
          const { username, password } =
            await loginSchema.parseAsync(credentials);

          //* 查詢數據庫
          const user = await prisma.user.findFirst({
            where: { name: username },
          });

          //* 數據庫查詢失敗 ( 資料沒有在數據庫 )
          if (!user || !user.password) return null;

          //* 驗證密碼 （ Hash )
          const passwordsMatch = await bcrypt.compare(password, user.password);

          //* 密碼匹配
          if (passwordsMatch) {
            return user;
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: PATHS.LOGIN,
    error: PATHS.LOGIN,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    //* 添加 SESSION 記錄的資料
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
