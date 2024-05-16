import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: '이메일이 올바르지 않습니다.',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: '이메일이 올바르지 않습니다.',
  }),
  password: z.string().min(6, {
    message: '최소 6글자 이상이어야합니다',
  }),
  name: z.string().min(1, {
    message: '이름은 필수입니다.',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: '이메일이 올바르지 않습니다.',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: '최소 6글자 이상으로 가능합니다.',
  }),
});
