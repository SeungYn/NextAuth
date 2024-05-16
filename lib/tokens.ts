import { KR_TIME_ZONE } from '@/constant/date';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { v4 as uuid } from 'uuid';
import { db } from './db';
import { getPasswordResetTokenByEmail } from '@/data/passwordResetToken';

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + KR_TIME_ZONE + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationTOken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationTOken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + KR_TIME_ZONE + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    // 토큰이 이미 존재하면 기존 토큰 지워줌
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
