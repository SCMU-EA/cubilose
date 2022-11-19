import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      name: "email",
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    CredentialsProvider({
      // 登录按钮显示 (e.g. "Sign in with Credentials")
      name: "credentials",
      // credentials 用于配置登录页面的表单
      credentials: {
        email: {
          label: "邮箱",
          type: "email",
          placeholder: "请输入邮箱",
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
        },
      },
      async authorize(credentials) {
        console.log(credentials);

        // 根据 credentials 我们查询数据库中的信息
        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        if (user) {
          // 返回的对象将保存才JWT 的用户属性中
          return user;
        } else {
          // 如果返回null，则会显示一个错误，建议用户检查其详细信息。
          return null;
          // 跳转到错误页面，并且携带错误信息 http://localhost:3000/api/auth/error?error=用户名或密码错误
          //throw new Error("用户名或密码错误");
        }
      },
    }),

    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 1,
    secret: env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/posts/login",
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "grey", // Hex color code
    logo: "https://raw.githubusercontent.com/SCMU-EA/cubilose/77907c28ea0e9f90dc684ff6cac9f66678e29ee9/public/logo.png", // Absolute URL to image
    buttonText: "grey", // Hex color code
  },
};

export default NextAuth(authOptions);
