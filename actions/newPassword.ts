'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { NewPasswordSchema } from '@/schemas';
import { getPasswordResetTokenByToken } from '@/data/passwordResetToken';
import { KR_TIME_ZONE } from '@/constant/date';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: '토큰이 존재하지 않습니다!' };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success)
    return { error: '유효하지 않는 비밀번호입니다!' };

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) return { error: '유효하지 않는 토큰입니다!' };

  const hasExpired =
    new Date(existingToken.expires) <
    new Date(new Date().getTime() + KR_TIME_ZONE);

  if (hasExpired) return { error: '토큰 유효기간이 지났습니다!!' };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: '이메일이 존재하지 않습니다!' };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  return { success: '비밀번호가 변경됐습니다!!' };
};
