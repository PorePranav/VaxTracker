import CompleteProfileForm from '@/app/_components/CompleteProfileForm';
import { auth } from '@/app/_lib/auth';

export default async function CompleteProfile() {
  const session = await auth();

  return (
    <>
      <h1 className="text-4xl font-semibold">Complete Your Profile</h1>
      <p className="text-xl mt-4">
        Complete your profile here! Start tracking your child&apos;s
        immunization journey with real-time updates and easy-to-read records
      </p>
      <CompleteProfileForm session={session} />
    </>
  );
}
