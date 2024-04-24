'use server';

import { KR_TIME_ZONE } from '@/constant/date';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verificationToken';
import { db } from '@/lib/db';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  console.log('existingTOken::', existingToken, token);
  if (!existingToken) return { error: '토큰이 유효하지 않습니다!!' };

  const hasExpired =
    new Date(existingToken.expires) <
    new Date(new Date().getTime() + KR_TIME_ZONE);

  if (hasExpired) return { error: '토큰 유효기간이 지났습니다!' };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: '유저 정보가 존재하지 않습니다.!' };

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(new Date().getTime() + KR_TIME_ZONE),
      email: existingUser.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: '이메일이 인증되었습니다!!' };
};
