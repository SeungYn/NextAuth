'use client';
import { BeatLoader } from 'react-spinners';
import CardWrapper from './CardWrapper';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/newVerification';
import { FormSuccess } from '../FormSuccess';
import { FormError } from '../FormError';

export default function NewVerificationForm({ token }: { token: string }) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('토큰이 없습니다!');
      return;
    }
    newVerification(token)
      .then((data) => {
        console.log(123, data);
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError('무언가 잘 못 됐습니다!');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel='이메일 인증'
      backButtonLabel='로그인으로 이동'
      backButtonHref='/auth/login'
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
}
