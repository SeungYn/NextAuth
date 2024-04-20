import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: '이메일이 올바르지 않습니다.',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});
