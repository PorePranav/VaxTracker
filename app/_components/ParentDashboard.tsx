import { auth } from '../_lib/auth';
import { getChildren, getImmunizationsByUser } from '../_lib/data-service';
import ChildrenCard from './ChildrenCard';
import ImmunizationCard from './ImmunizationCard';

export default async function ParentDashboard() {
  const session = await auth();
  let children;
  if (session?.user.userId) children = await getChildren(session?.user.userId);
  let immunizations;
  if (session?.user.userId)
    immunizations = await getImmunizationsByUser(session?.user.userId);

  return (
    <>
      <h1 className="text-4xl font-semibold">Welcome to VaxTracker</h1>
      <p className="text-lg mt-8">
        Track your child&apos;s immunizations and stay on top of their health
      </p>
      {children && children.length > 0 && (
        <ChildrenCard childrenList={children} />
      )}
      <h2 className="text-2xl mt-8 font-semibold">
        Your children&apos;s vaccinations
      </h2>
      <ImmunizationCard immunizationsList={immunizations} />
    </>
  );
}
