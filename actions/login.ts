'use server';
import { signIn } from '@/auth';
import { sendMail } from '@/data/nodemail';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
// 서버로 선언한 코드는 클라이언트 번들에 포함되지 않음
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  console.log(values);
  await new Promise((rev) => setTimeout(rev, 5000));
  if (!validatedFields.success) {
    return { error: '유효하지 않은 입력값입니다.' };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: '이메일이 존재하지 않습니다!' };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendMail({
      email: verificationToken.email,
      token: verificationToken.token,
      message: '이메일 인증하기',
      subject: '이메일 인증',
    });

    return { success: '발송된 이메일을 확인해주세요!' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: '유효하지 않는 인증' };
        default:
          return { error: '무엇인가 잘 못됨' };
      }
    }

    throw error;
  }
};
