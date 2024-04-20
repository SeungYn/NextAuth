'use server';
import { RegisterSchema } from '@/schemas';
// 서버로 선언한 코드는 클라이언트 번들에 포함되지 않음
import * as z from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  console.log(values);
  await new Promise((rev) => setTimeout(rev, 5000));
  if (!validatedFields.success) {
    return { error: '유효하지 않은 입력값입니다.' };
  }

  return { success: 'Email sent' };
};
