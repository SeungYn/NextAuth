import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { db } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from './data/user';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ user, session, token }) {
      console.log('session', { session, user, token });
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // 토큰을 관리 토큰에 데이터를 추가해줄 수 있음, 그럼 세션에서 해당 토큰을 이용
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      console.log({ token, user, account, profile, trigger });
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
