/**
 * 인증이 필요하지 않는 경로
 * @type {string[]}
 */
export const publicRoutes = ['/'];

export const authRoutes = ['/auth/login', '/auth/register'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/settings';
