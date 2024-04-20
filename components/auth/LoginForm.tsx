import CardWrapper from './CardWrapper';

export default function LoginForm() {
  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel={"Don't hae an account?"}
      backButtonHref='/auth/register'
      showSocial
    >
      Login Form!
    </CardWrapper>
  );
}
