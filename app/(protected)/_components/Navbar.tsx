'use client';

import UserButton from '@/components/auth/UserButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm'>
      <div className='flex gap-x-2'>
        <Button
          asChild
          variant={pathname === '/server' ? 'default' : 'outline'}
        >
          <Link href='/server'>server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/client' ? 'default' : 'outline'}
        >
          <Link href='/client'>client</Link>
        </Button>

        <Button asChild variant={pathname === '/admin' ? 'default' : 'outline'}>
          <Link href='/admin'>admin</Link>
        </Button>

        <Button variant={pathname === '/settings' ? 'default' : 'outline'}>
          <Link href='/settings'>Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
