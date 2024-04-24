import { KR_TIME_ZONE } from '@/constant/date';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { v4 as uuid } from 'uuid';
import { db } from './db';
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
