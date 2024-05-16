'use server';

import * as z from 'zod';
import { getUserByEmail } from '@/data/user';
import { ResetSchema } from '@/schemas';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendMail, sendPasswordResetEmail } from '@/data/nodemail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '유효하지 않는 이메일입니다.' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: '이메일이 존재하지 않습니다.!' };

  // TODO: 리셋 이메일 보내기
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail({
    email: passwordResetToken.email,
    subject: '비밀번호 초기화 메일',
    token: passwordResetToken.token,
    message: '비밀번호 초기화',
  });
  return { success: '초기화 이메일을 보냈습니다!' };
};
