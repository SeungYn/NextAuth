'use client';

import { logout } from '@/actions/logout';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Navbar } from '../_components/Navbar';

//import { auth, signOut } from '@/auth';

export default function Page() {
  const user = useCurrentUser();
  const onClick = () => {
    logout();
  };
  return (
    <div className='bg-white p-10 rounded-xl'>
      <button onClick={onClick}>로그아웃</button>
    </div>
  );
}
