'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import CardWrapper from './CardWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';
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
import { useState, useTransition } from 'react';
import { reset } from '@/actions/reset';

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

export default function ResetForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  // startTransition 을 사용하면 revalidate관련 함수를 사용할 때 언제 끝나는지 알 수 있음
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    // server action은 프로미스여도 스탈트랜지션이 적용됨
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        console.log(data);
      });
      //test().then((data) => console.log(data));
    });
  };

  return (
    <CardWrapper
      headerLabel='비밀번호를 잊으셨나요?'
      backButtonLabel='로그인으로 이동'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            리셋 이메일 보내기
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
