// edge에서 프리즈마 어댑터는 사용 안되니 분리

import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { db } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from './data/user';
import { UserRole } from '@prisma/client';
import { KR_TIME_ZONE } from './constant/date';
import { getTwoFactorConfirmationByUserId } from './data/twoFactorConfirmation';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      // 사용자가 provider의 계정에 연결할 때 호출되는 메서드
      // Sent when an account in a given provider is linked to a user in our user database.
      // For example, when a user signs up with Twitter or when an existing user links their Google account.
      //console.log('linkAccount::', user);
      await db.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date(new Date().getTime() + KR_TIME_ZONE) },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Oauth는 로그인을 허락
      console.group('auth-signin-callback');
      console.log(user);
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id!);

      // 이메일 인증이 없으면 로그인 진행 막음
      if (!existingUser?.emailVerified) return false;
      console.log('existingUser:::auth.ts', existingUser);
      // TODO: Add 2FA check
      //if (!existingUser?.isTwoFactorEnabled) return false;
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        console.log('twoFactorConfirmation:::', twoFactorConfirmation);
        if (!twoFactorConfirmation) return false;

        // delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      console.groupEnd();
      return true;
    },
    async session({ user, session, token }) {
      //console.log('session', { session, user, token });
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactor = token.isTwoFactor as boolean;
      }

      return session;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // 토큰을 관리 토큰에 데이터를 추가해줄 수 있음, 그럼 세션에서 해당 토큰을 이용
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.isTwoFactor = existingUser.isTwoFactorEnabled;
      //console.log({ token, user, account, profile, trigger });
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
// async signIn({ user }) {
//   // db의 user을 가져와줌
//   console.log('signin::', user);
//   const existingUser = await getUserById(user.id!);
//   if (!existingUser || !existingUser.emailVerified) return false;

//   return true;
// },
