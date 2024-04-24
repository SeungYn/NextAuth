import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card, CardFooter, CardHeader } from '../ui/card';
import BackButton from './BackButton';
import CardWrapper from './CardWrapper';
import Header from './Header';

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel='에러가 발생!'
      backButtonHref='/auth/login'
      backButtonLabel='로그인으로 이동'
    >
      <div className='w-full flex justify-center items-center'>
        <ExclamationTriangleIcon className='text-destructive' />
      </div>
    </CardWrapper>
  );
}
