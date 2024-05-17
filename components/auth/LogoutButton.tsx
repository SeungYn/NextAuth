'use client';

import { logout } from '@/actions/logout';

type LogoutButtonProps = {
  children?: React.ReactNode;
};

export default function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = () => {
    logout();
  };
  return (
    <span className='cursor-pointer' onClick={onClick}>
      {children}
    </span>
  );
}
