import NextAuth, { DefaultSession } from 'next-auth';
export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  isTwoFactor: boolean;
};
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: UserRole;
    isTwoFactor: boolean;
  }
}
