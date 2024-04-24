import { Card, CardFooter, CardHeader } from '../ui/card';
import BackButton from './BackButton';
import Header from './Header';

export default function ErrorCard() {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <Header label='에러가 발생했습니다!' />
      </CardHeader>
      <CardFooter>
        <BackButton label='Back to login' href='/auth/login' />
      </CardFooter>
    </Card>
  );
}
