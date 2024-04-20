'use server';
import { LoginSchema } from '@/schemas';
// 서버로 선언한 코드는 클라이언트 번들에 포함되지 않음
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  console.log(values);
  await new Promise((rev) => setTimeout(rev, 5000));
  if (!validatedFields.success) {
    return { error: '유요하지 않은 입력값입니다.' };
  }

  return { success: 'Email sent' };
};
