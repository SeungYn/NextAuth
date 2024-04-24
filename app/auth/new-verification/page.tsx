import NewVerificationForm from '@/components/auth/NewVerificationForm';

export default function NewVerificationPage({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  return <NewVerificationForm token={token} />;
}
