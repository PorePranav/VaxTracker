import AddChild from '@/app/_components/AddChild';
import ChildrenList from '@/app/_components/ChildrenList';
import { auth } from '@/app/_lib/auth';
import { getChildrenHospital } from '@/app/_lib/data-service';

export default async function ChildrenPageHospital() {
  const session = await auth();
  let childrenList;
  if (session?.user.userId) childrenList = await getChildrenHospital();

  return (
    <>
      <h1 className="text-4xl font-semibold">Children&apos;s Profile</h1>
      {childrenList && childrenList.length > 0 ? (
        <ChildrenList childrenList={childrenList} />
      ) : (
        <p className="mt-4 text-xl">
          You have not added any children yet, start by clicking on the above
          button!
        </p>
      )}
    </>
  );
}
