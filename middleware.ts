import NextAuth from 'next-auth';

import authConfig from './auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';
const { auth } = NextAuth(authConfig);
//export default auth;
export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  console.log('middleware 호출');
  console.log('route::', req.nextUrl.pathname);
  console.log('is LOGGEDIN', isLoggedIn);
  console.log('nextUrl', nextUrl);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    console.log('isApiAuthRoute');
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log('로그인 확인');
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url), 303);
    }
    console.log('isAuthRoute로 종료');
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log('로그인이 안 돼있고 public 경로가 아님');
    return Response.redirect(new URL('/auth/login', req.url), 303);
  }

  console.log('하단 종료');
  return;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
