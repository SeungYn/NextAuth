'use server';

import { signOut } from '@/auth';

export const logout = async () => {
  // 로그아웃 처리 후 미들웨어 호출시 페이지는 전환되지만 url이 안바뀌는 현상이 있음
  // 아래처럼 redirectTo를 활용해 리다이렉트 진행
  await signOut({ redirectTo: '/auth/login' });
};
