'use client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

type LoginButtonProps = PropsWithChildren<{
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}>;
export default function LoginButton({
  children,
  mode = 'redirect',
  asChild,
}: LoginButtonProps) {
  const router = useRouter();

  const onClick = () => {
    console.log('login button Clicked');
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <span>TODO: Implement modal</span>;
  }
  return (
    <span className='cursor-pointer' onClick={onClick}>
      {children}
    </span>
  );
}
