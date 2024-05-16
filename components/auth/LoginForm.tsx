'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import CardWrapper from './CardWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormError } from '../FormError';
import { FormSuccess } from '../FormSuccess';
import { login } from '@/actions/login';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
const User = z.object({
  username: z.string(),
});

User.parse({ username: 'Ludwig' });

// extract the inferred typ

type User = z.infer<typeof User>;
// { username: string }

async function test() {
  await new Promise((rev) => setTimeout(rev, 5000));
  return 1;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? '이메일은 이미 사용중입니다!'
      : '';
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  // startTransition 을 사용하면 revalidate관련 함수를 사용할 때 언제 끝나는지 알 수 있음
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });
  console.log('login form');
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log('login submit');
    setError('');
    setSuccess('');
    // server action은 프로미스여도 스탈트랜지션이 적용됨
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError('무엇인가 잘못됐습니다.');
        });
      //test().then((data) => console.log(data));
    });
  };

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel={"Don't hae an account?"}
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {showTwoFactor && (
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='123456'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='test@example.com'
                          type='email'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='****'
                          type='password'
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size='sm'
                        variant='link'
                        asChild
                        className='px-0 font-nonal'
                      >
                        <Link href='/auth/reset'>Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            {showTwoFactor ? '인증하기' : '로그인'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
