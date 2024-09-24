import { auth } from '@/app/_lib/auth';
import {
  getChildrenParent,
  getHospitals,
  getImmunizationsDashboard,
} from '../_lib/data-service';
import AddChild from './AddChild';
import ChildrenCard from './ChildrenCard';
import ImmunizationCard from './ImmunizationCard';

export default async function ParentDashboard() {
  const session = await auth();
  let children;
  if (session?.user.userId)
    children = await getChildrenParent(session?.user.userId);
  let immunizations;
  if (session?.user.userId) immunizations = await getImmunizationsDashboard();

  const hospitalList = await getHospitals();

  return (
    <>
      <h1 className="text-4xl font-semibold">Welcome to VaxTracker</h1>
      <AddChild hospitalList={hospitalList} />
      {children && children.length > 0 && (
        <>
          <p className="text-lg mt-8">
            Track your child&apos;s immunizations and stay on top of their
            health
          </p>
          <ChildrenCard childrenList={children} />
        </>
      )}
      {immunizations && immunizations.length > 0 ? (
        <>
          <h2 className="text-2xl mt-8 font-semibold">
            Your children&apos;s vaccinations
          </h2>
          <ImmunizationCard immunizationsList={immunizations} />
        </>
      ) : (
        <p className="mt-4 text-xl">
          You have not added any children yet, start by clicking the above
          button page!
        </p>
      )}
    </>
  );
}
