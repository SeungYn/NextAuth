'use server';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
// 서버로 선언한 코드는 클라이언트 번들에 포함되지 않음
import bcrypt from 'bcrypt';
import * as z from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  console.log(values);
  await new Promise((rev) => setTimeout(rev, 3000));
  if (!validatedFields.success) {
    return { error: '유효하지 않은 입력값입니다.' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: 'Email already in use!' };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: '계정 생성 완료!' };
};
